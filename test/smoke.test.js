// Simulates Vercel's (req,res) invocation against every handler in-process.
process.env.JWT_SECRET = 'test-secret';
import assert from 'node:assert';

import auth from '../api/auth.js';
import catalog from '../api/catalog.js';
import cart from '../api/cart.js';
import rewards from '../api/rewards.js';
import health from '../api/health.js';

function mockRes() {
  return { _s: 200, _j: null, statusCode: 200,
    status(c) { this._s = c; this.statusCode = c; return this; },
    json(o) { this._j = o; return this; },
    setHeader() {}, end() { return this; } };
}
async function call(fn, { method = 'GET', query = {}, body = null, token = null } = {}) {
  const req = { method, query, body, headers: token ? { authorization: `Bearer ${token}` } : {} };
  const res = mockRes();
  await fn(req, res);
  return { status: res._s, json: res._j };
}

let pass = 0;
const ok = (n, c) => { assert.ok(c, n); console.log('  ✓', n); pass++; };
console.log('CartPilot Vercel smoke test\n');

// health
let r = await call(health);
ok('health ok (memory store)', r.json.ok && r.json.storage === 'memory');

// catalog
r = await call(catalog, { query: { resource: 'stores' } });
ok('stores list = 3', r.json.stores.length === 3);
r = await call(catalog, { query: { resource: 'resolve', q: 'oat milk' } });
ok('resolve oat milk', r.json.sku === 'oat-milk');

// seeded demo login
r = await call(auth, { method: 'POST', query: { action: 'login' }, body: { email: 'demo@cartpilot.app', password: 'demo1234' } });
ok('seeded demo login works', !!r.json.token);
const demoToken = r.json.token;
r = await call(cart, { query: { action: 'view' }, token: demoToken });
ok('demo has pre-seeded 5-item cart', r.json.items.length === 5);

// fresh register
r = await call(auth, { method: 'POST', query: { action: 'register' }, body: { email: 'new@test.com', password: 'hunter2', name: 'New' } });
ok('register returns token', !!r.json.token);
const token = r.json.token;
r = await call(auth, { method: 'GET', query: { action: 'me' }, token });
ok('me works', r.json.user.email === 'new@test.com');

// build a cart
for (const text of ['bananas', 'oat milk', 'chicken breast', 'spaghetti', 'salmon']) {
  r = await call(cart, { method: 'POST', query: { action: 'add' }, body: { text }, token });
}
ok('cart built to 5 items', r.json.items.length === 5);
ok('coupons matched', r.json.coupons.length > 0);

r = await call(cart, { query: { action: 'compare' }, token });
ok('compare 3 stores + cheapest', r.json.stores.length === 3 && !!r.json.cheapest_store_id);
r = await call(cart, { query: { action: 'route' }, token });
ok('route orders 5 stops + metrics', r.json.order.length === 5 && r.json.distance_ft > 0);
r = await call(cart, { query: { action: 'split' }, token });
ok('split optimizer runs', typeof r.json.worth_it === 'boolean');
if (r.json.worth_it) ok('split saves across >=2 stores', r.json.save_cents > 0 && r.json.legs.length >= 2);
else ok('split honest one-store-wins', !!r.json.reason);

// budget
const view = await call(cart, { query: { action: 'view' }, token });
r = await call(cart, { method: 'PUT', query: { action: 'budget' }, body: { budget_cents: Math.floor(view.json.total_cents / 2) }, token });
ok('over-budget flagged', r.json.over_budget === true);

// store switch
r = await call(cart, { method: 'PUT', query: { action: 'store' }, body: { store_id: 'valumart' }, token });
ok('store switch reprices', r.json.store_id === 'valumart');

// clip + check + checkout
const cid = view.json.coupons[0].id;
r = await call(cart, { method: 'POST', query: { action: 'clip' }, body: { coupon_id: cid }, token });
ok('clip coupon', r.json.clipped === cid);
r = await call(cart, { method: 'POST', query: { action: 'check' }, body: { sku: 'bananas', checked: true }, token });
ok('check item', r.json.items.find(i => i.sku === 'bananas').checked === true);
r = await call(cart, { method: 'POST', query: { action: 'checkout' }, token });
ok('checkout receipt + cashback', !!r.json.receipt && r.json.receipt.cashback_cents > 0);
ok('trip + streak recorded', r.json.rewards.trips === 1 && r.json.rewards.streak_weeks >= 1);

// wallet
r = await call(rewards, { query: { action: 'wallet' }, token });
ok('wallet > 0 + ledger', r.json.wallet_cents > 0 && r.json.ledger.length > 0);

// cart empty after checkout
r = await call(cart, { query: { action: 'view' }, token });
ok('fresh empty cart after checkout', r.json.items.length === 0);

// auth guard
r = await call(cart, { query: { action: 'view' } });
ok('unauthed rejected 401', r.status === 401);

console.log(`\n${pass} checks passed ✓`);
