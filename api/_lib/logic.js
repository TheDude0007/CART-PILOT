import * as C from './catalog.js';

const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
function pathLen(pts, s, e) { let d = 0, p = s; for (const x of pts) { d += dist(p, x); p = x; } return d + dist(p, e); }

export function optimizeRoute(skus, storeId) {
  const stops = skus.map(sku => {
    const p = C.getProduct(sku); if (!p) return null;
    return { sku, name: p.name, icon: p.icon, aisle: p.aisle, x: p.x, z: p.z,
      price_cents: C.priceCents(sku, storeId), in_stock: C.inStock(sku) };
  }).filter(Boolean);
  if (!stops.length) return { order: [], distance_ft: 0, est_minutes: 0, total_cents: 0, geometry: { entrance: C.ENTRANCE, checkout: C.CHECKOUT } };

  // nearest-neighbor seed
  let order = []; const rem = [...stops]; let cur = C.ENTRANCE;
  while (rem.length) { rem.sort((a, b) => dist(cur, a) - dist(cur, b)); order.push(cur = rem.shift()); }
  // 2-opt
  let improved = true, g = 0;
  while (improved && g++ < 50) {
    improved = false;
    for (let i = 0; i < order.length - 1; i++) for (let j = i + 1; j < order.length; j++) {
      const cand = order.slice(0, i).concat(order.slice(i, j + 1).reverse(), order.slice(j + 1));
      if (pathLen(cand, C.ENTRANCE, C.CHECKOUT) + 1e-9 < pathLen(order, C.ENTRANCE, C.CHECKOUT)) { order = cand; improved = true; }
    }
  }
  const d = pathLen(order, C.ENTRANCE, C.CHECKOUT);
  return {
    order: order.map((o, i) => ({ step: i + 1, sku: o.sku, name: o.name, icon: o.icon, aisle: o.aisle, x: o.x, z: o.z, price_cents: o.price_cents, in_stock: o.in_stock })),
    distance_ft: Math.round(d * 9), est_minutes: Math.max(4, Math.round(d * 1.1)),
    total_cents: order.reduce((s, o) => s + (o.price_cents || 0), 0),
    geometry: { entrance: C.ENTRANCE, checkout: C.CHECKOUT },
  };
}

export function priceCartAtStore(skus, storeId) {
  let total = 0;
  const lines = skus.map(sku => { const price = C.priceCents(sku, storeId) || 0; total += price; return { sku, price_cents: price }; });
  return { store_id: storeId, total_cents: total, lines };
}

export function compareStores(skus) {
  const priced = C.listStores().map(s => ({ ...s, total_cents: priceCartAtStore(skus, s.id).total_cents }));
  const cheapest = priced.reduce((a, b) => (b.total_cents < a.total_cents ? b : a), priced[0]);
  const closest = priced.reduce((a, b) => (b.drive_min < a.drive_min ? b : a), priced[0]);
  return {
    stores: priced.map(p => ({ ...p, is_cheapest: p.id === cheapest.id, is_closest: p.id === closest.id })),
    cheapest_store_id: cheapest.id, closest_store_id: closest.id,
  };
}

export function optimizeSplit(skus, { min_save_cents = 50 } = {}) {
  const stores = C.listStores();
  if (skus.length < 2) return { worth_it: false, reason: 'too_few_items', save_cents: 0, legs: [] };
  const assign = skus.map(sku => {
    let best = { store_id: stores[0].id, price_cents: C.priceCents(sku, stores[0].id) || 0 };
    for (const s of stores) { const pr = C.priceCents(sku, s.id) || 0; if (pr < best.price_cents) best = { store_id: s.id, price_cents: pr }; }
    return { sku, ...best };
  });
  const splitTotal = assign.reduce((s, a) => s + a.price_cents, 0);
  const singleTotals = stores.map(s => priceCartAtStore(skus, s.id).total_cents);
  const singleBest = Math.min(...singleTotals);
  const singleBestStore = stores[singleTotals.indexOf(singleBest)].id;
  const save = singleBest - splitTotal;
  const used = [...new Set(assign.map(a => a.store_id))];
  if (save < min_save_cents || used.length < 2)
    return { worth_it: false, reason: used.length < 2 ? 'one_store_wins' : 'savings_below_threshold', save_cents: Math.max(0, save), single_best_store_id: singleBestStore, single_best_cents: singleBest, legs: [] };
  const legs = used.map(storeId => {
    const items = assign.filter(a => a.store_id === storeId);
    const store = stores.find(s => s.id === storeId);
    return { store_id: storeId, store_name: store.name, drive_min: store.drive_min, items: items.map(i => i.sku), subtotal_cents: items.reduce((s, i) => s + i.price_cents, 0) };
  });
  return { worth_it: true, save_cents: save, split_total_cents: splitTotal, single_best_store_id: singleBestStore, single_best_cents: singleBest, legs };
}

export function swapsFor(skus) {
  const out = [];
  for (const sku of skus) { const p = C.getProduct(sku); if (p && p.swap) out.push({ sku, original: p.name, ...p.swap }); }
  return out;
}
export function savedFromSales(skus, storeId) {
  let saved = 0;
  for (const sku of skus) { const was = C.wasCents(sku, storeId), now = C.priceCents(sku, storeId); if (was != null && now != null && was > now) saved += was - now; }
  return saved;
}
