// ============================================================================
// STORAGE — serverless-compatible persistence with two interchangeable backends.
//
//  • MemoryStore (default): zero-config, seeded demo data. Fully functional the
//    instant the app deploys. State resets on cold start — perfect for demos,
//    pitches, and trying the product. No database to provision.
//
//  • PostgresStore: set POSTGRES_URL (e.g. Vercel Postgres / Neon) and the app
//    uses durable storage automatically. Same interface, real persistence.
//
// Every API function imports `store` from here and never touches a backend
// directly, so switching is a single env var with no code changes.
// ============================================================================

import { hashPassword } from './auth.js';

const USE_PG = !!process.env.POSTGRES_URL;

/* ---------------- In-memory backend ---------------- */
class MemoryStore {
  constructor() {
    this.kind = 'memory';
    this.users = new Map();        // id -> user
    this.byEmail = new Map();      // email -> id
    this.carts = new Map();        // id -> cart
    this.items = new Map();        // cartId -> Map(sku -> {sku,qty,checked})
    this.clipped = new Map();      // userId -> Map(couponId -> {sku,redeemed})
    this.ledger = new Map();       // userId -> [{delta_cents,reason,created_at}]
    this.seq = { user: 0, cart: 0 };
    this._seed();
  }
  _seed() {
    // demo account, pre-populated so the deployed app is immediately alive
    const id = ++this.seq.user;
    const u = { id, email: 'demo@cartpilot.app', password_hash: hashPassword('demo1234'),
      name: 'Demo Shopper', plus: 1, wallet_cents: 555, lifetime_cents: 1284,
      streak_weeks: 3, trips: 3, created_at: new Date().toISOString(), last_trip_at: new Date().toISOString() };
    this.users.set(id, u); this.byEmail.set(u.email, id);
    const cart = this._newCart(id);
    ['bananas','oat-milk','chicken-breast','spaghetti','salmon'].forEach(sku => this.addItem(cart.id, sku));
    this.ledger.set(id, [{ delta_cents: 555, reason: 'seed_demo', created_at: new Date().toISOString() }]);
  }
  _newCart(userId) {
    const id = ++this.seq.cart;
    const cart = { id, user_id: userId, store_id: null, budget_cents: null, status: 'active' };
    this.carts.set(id, cart); this.items.set(id, new Map());
    return cart;
  }
  async createUser({ email, password_hash, name }) {
    if (this.byEmail.has(email)) throw new Error('email_taken');
    const id = ++this.seq.user;
    const u = { id, email, password_hash, name: name || null, plus: 0,
      wallet_cents: 0, lifetime_cents: 0, streak_weeks: 0, trips: 0,
      created_at: new Date().toISOString(), last_trip_at: null };
    this.users.set(id, u); this.byEmail.set(email, id);
    return u;
  }
  async getUserByEmail(email) { const id = this.byEmail.get(email); return id ? this.users.get(id) : null; }
  async getUser(id) { return this.users.get(id) || null; }
  async updateUser(id, patch) { Object.assign(this.users.get(id), patch); return this.users.get(id); }

  async getActiveCart(userId) {
    for (const c of this.carts.values()) if (c.user_id === userId && c.status === 'active') return c;
    return this._newCart(userId);
  }
  async getItems(cartId) { return [...(this.items.get(cartId)?.values() || [])]; }
  addItem(cartId, sku, qty = 1) {
    const m = this.items.get(cartId);
    const ex = m.get(sku);
    if (ex) ex.qty += qty; else m.set(sku, { sku, qty, checked: 0 });
  }
  async addItemAsync(cartId, sku, qty = 1) { this.addItem(cartId, sku, qty); }
  async removeItem(cartId, sku) { this.items.get(cartId)?.delete(sku); }
  async setQty(cartId, sku, qty) {
    const m = this.items.get(cartId); if (!m) return;
    if (qty <= 0) { m.delete(sku); return; }
    const it = m.get(sku); if (it) it.qty = qty; else m.set(sku, { sku, qty, checked: 0 });
  }
  async setChecked(cartId, sku, checked) { const it = this.items.get(cartId)?.get(sku); if (it) it.checked = checked ? 1 : 0; }
  async setStore(cartId, storeId) { this.carts.get(cartId).store_id = storeId; }
  async setBudget(cartId, cents) { this.carts.get(cartId).budget_cents = cents; }
  async completeCart(cartId) { this.carts.get(cartId).status = 'completed'; }

  async clipCoupon(userId, couponId, sku) {
    if (!this.clipped.has(userId)) this.clipped.set(userId, new Map());
    const m = this.clipped.get(userId);
    if (!m.has(couponId)) m.set(couponId, { sku, redeemed: 0 });
  }
  async getClipped(userId, onlyUnredeemed = false) {
    const m = this.clipped.get(userId) || new Map();
    return [...m.entries()].filter(([, v]) => !onlyUnredeemed || !v.redeemed)
      .map(([coupon_id, v]) => ({ coupon_id, sku: v.sku, redeemed: v.redeemed }));
  }
  async redeemAllClipped(userId) { const m = this.clipped.get(userId); if (m) for (const v of m.values()) v.redeemed = 1; }

  async credit(userId, delta, reason) {
    const u = this.users.get(userId); u.wallet_cents += delta;
    if (!this.ledger.has(userId)) this.ledger.set(userId, []);
    this.ledger.get(userId).unshift({ delta_cents: delta, reason, created_at: new Date().toISOString() });
  }
  async getLedger(userId, limit = 20) { return (this.ledger.get(userId) || []).slice(0, limit); }
}

/* ---------------- Postgres backend ---------------- */
// Lazy-loaded only when POSTGRES_URL is set, so the dependency is optional.
class PostgresStore {
  constructor() { this.kind = 'postgres'; this.ready = this._init(); }
  async _init() {
    const { neon } = await import('@neondatabase/serverless');
    this.sql = neon(process.env.POSTGRES_URL);
    await this.sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT,
      plus INT NOT NULL DEFAULT 0, wallet_cents INT NOT NULL DEFAULT 0, lifetime_cents INT NOT NULL DEFAULT 0,
      streak_weeks INT NOT NULL DEFAULT 0, trips INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(), last_trip_at TIMESTAMPTZ)`;
    await this.sql`CREATE TABLE IF NOT EXISTS carts (
      id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      store_id TEXT, budget_cents INT, status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(), completed_at TIMESTAMPTZ)`;
    await this.sql`CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY, cart_id INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      sku TEXT NOT NULL, qty INT NOT NULL DEFAULT 1, checked INT NOT NULL DEFAULT 0,
      UNIQUE(cart_id, sku))`;
    await this.sql`CREATE TABLE IF NOT EXISTS clipped_coupons (
      id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      coupon_id TEXT NOT NULL, sku TEXT, redeemed INT NOT NULL DEFAULT 0, UNIQUE(user_id, coupon_id))`;
    await this.sql`CREATE TABLE IF NOT EXISTS rewards_ledger (
      id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      delta_cents INT NOT NULL, reason TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  }
  async createUser({ email, password_hash, name }) {
    await this.ready;
    const ex = await this.sql`SELECT id FROM users WHERE email=${email}`;
    if (ex.length) throw new Error('email_taken');
    const r = await this.sql`INSERT INTO users (email,password_hash,name) VALUES (${email},${password_hash},${name||null}) RETURNING *`;
    return r[0];
  }
  async getUserByEmail(email) { await this.ready; const r = await this.sql`SELECT * FROM users WHERE email=${email}`; return r[0]||null; }
  async getUser(id) { await this.ready; const r = await this.sql`SELECT * FROM users WHERE id=${id}`; return r[0]||null; }
  async updateUser(id, patch) {
    await this.ready;
    const SAFE = ['lifetime_cents','trips','streak_weeks','last_trip_at','wallet_cents','plus','name'];
    const cols = Object.keys(patch).filter(k => SAFE.includes(k));
    for (const k of cols) await this.sql(`UPDATE users SET ${k}=$1 WHERE id=$2`, [patch[k], id]);
    return this.getUser(id);
  }
  async getActiveCart(userId) {
    await this.ready;
    let r = await this.sql`SELECT * FROM carts WHERE user_id=${userId} AND status='active' ORDER BY id DESC LIMIT 1`;
    if (!r.length) r = await this.sql`INSERT INTO carts (user_id,status) VALUES (${userId},'active') RETURNING *`;
    return r[0];
  }
  async getItems(cartId) { await this.ready; return await this.sql`SELECT sku,qty,checked FROM cart_items WHERE cart_id=${cartId} ORDER BY id`; }
  async addItemAsync(cartId, sku, qty = 1) {
    await this.ready;
    await this.sql`INSERT INTO cart_items (cart_id,sku,qty) VALUES (${cartId},${sku},${qty})
      ON CONFLICT (cart_id,sku) DO UPDATE SET qty = cart_items.qty + ${qty}`;
  }
  async removeItem(cartId, sku) { await this.ready; await this.sql`DELETE FROM cart_items WHERE cart_id=${cartId} AND sku=${sku}`; }
  async setQty(cartId, sku, qty) {
    await this.ready;
    if (qty <= 0) return this.removeItem(cartId, sku);
    await this.sql`UPDATE cart_items SET qty=${qty} WHERE cart_id=${cartId} AND sku=${sku}`;
  }
  async setChecked(cartId, sku, checked) { await this.ready; await this.sql`UPDATE cart_items SET checked=${checked?1:0} WHERE cart_id=${cartId} AND sku=${sku}`; }
  async setStore(cartId, storeId) { await this.ready; await this.sql`UPDATE carts SET store_id=${storeId} WHERE id=${cartId}`; }
  async setBudget(cartId, cents) { await this.ready; await this.sql`UPDATE carts SET budget_cents=${cents} WHERE id=${cartId}`; }
  async completeCart(cartId) { await this.ready; await this.sql`UPDATE carts SET status='completed', completed_at=now() WHERE id=${cartId}`; }
  async clipCoupon(userId, couponId, sku) { await this.ready; await this.sql`INSERT INTO clipped_coupons (user_id,coupon_id,sku) VALUES (${userId},${couponId},${sku}) ON CONFLICT DO NOTHING`; }
  async getClipped(userId, onlyUnredeemed = false) {
    await this.ready;
    return onlyUnredeemed
      ? await this.sql`SELECT coupon_id,sku,redeemed FROM clipped_coupons WHERE user_id=${userId} AND redeemed=0`
      : await this.sql`SELECT coupon_id,sku,redeemed FROM clipped_coupons WHERE user_id=${userId}`;
  }
  async redeemAllClipped(userId) { await this.ready; await this.sql`UPDATE clipped_coupons SET redeemed=1 WHERE user_id=${userId} AND redeemed=0`; }
  async credit(userId, delta, reason) {
    await this.ready;
    await this.sql`UPDATE users SET wallet_cents = wallet_cents + ${delta} WHERE id=${userId}`;
    await this.sql`INSERT INTO rewards_ledger (user_id,delta_cents,reason) VALUES (${userId},${delta},${reason})`;
  }
  async getLedger(userId, limit = 20) { await this.ready; return await this.sql`SELECT delta_cents,reason,created_at FROM rewards_ledger WHERE user_id=${userId} ORDER BY id DESC LIMIT ${limit}`; }
}

// Singleton across warm invocations
let _store = globalThis.__cartpilot_store;
if (!_store) { _store = USE_PG ? new PostgresStore() : new MemoryStore(); globalThis.__cartpilot_store = _store; }
export const store = _store;
