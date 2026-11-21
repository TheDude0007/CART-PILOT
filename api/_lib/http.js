import { store } from './store.js';
import * as C from './catalog.js';
import { savedFromSales } from './logic.js';

export function readBody(req) {
  // Vercel parses JSON automatically when content-type is set; fall back to raw.
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) { try { return JSON.parse(req.body); } catch { return {}; } }
  return {};
}
export function send(res, status, obj) { res.status(status).json(obj); }
export function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

export async function cartView(userId) {
  const cart = await store.getActiveCart(userId);
  const items = await store.getItems(cart.id);
  const skus = items.map(i => i.sku);
  const storeId = cart.store_id || C.listStores()[0].id;
  const lines = items.map(i => {
    const p = C.getProduct(i.sku);
    return { sku: i.sku, name: p?.name, icon: p?.icon, aisle: p?.aisle, qty: i.qty, checked: !!i.checked,
      price_cents: C.priceCents(i.sku, storeId), was_cents: C.wasCents(i.sku, storeId),
      in_stock: C.inStock(i.sku), has_swap: !!(p && p.swap),
      brand: p?.brand || null, dept: p?.dept || null };
  });
  const total = lines.reduce((s, l) => s + (l.price_cents || 0) * l.qty, 0);
  return {
    cart_id: cart.id, store_id: storeId, budget_cents: cart.budget_cents,
    over_budget: cart.budget_cents != null && total > cart.budget_cents,
    items: lines, total_cents: total,
    sale_savings_cents: savedFromSales(skus, storeId),
    coupons: C.couponsFor(skus), swaps: swapsForView(skus),
  };
}
function swapsForView(skus) {
  const out = [];
  for (const sku of skus) { const p = C.getProduct(sku); if (p && p.swap) out.push({ sku, original: p.name, ...p.swap }); }
  return out;
}

// Trip completion: streak logic + credits, backend-agnostic.
export async function completeTrip(userId, { saved_cents, cashback_cents }) {
  const u = await store.getUser(userId);
  let streak = u.streak_weeks || 0;
  if (u.last_trip_at) {
    const days = Math.floor((Date.now() - new Date(u.last_trip_at).getTime()) / 86400000);
    streak = days <= 10 ? streak + 1 : 1;
  } else streak = 1;
  const bonus = (streak > 0 && streak % 4 === 0) ? 500 : 0;
  await store.updateUser(userId, {
    lifetime_cents: u.lifetime_cents + saved_cents,
    trips: u.trips + 1, streak_weeks: streak,
    last_trip_at: new Date().toISOString(),
  });
  // credit() updates wallet + appends ledger atomically per backend
  await store.credit(userId, cashback_cents, 'trip_cashback');
  if (bonus) await store.credit(userId, bonus, `streak_bonus_week_${streak}`);
  return await store.getUser(userId);
}
