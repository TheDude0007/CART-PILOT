import { store } from './_lib/store.js';
import * as C from './_lib/catalog.js';
import { getUserId } from './_lib/auth.js';
import { readBody, send, cors, cartView, completeTrip } from './_lib/http.js';
import { optimizeRoute, compareStores, optimizeSplit, savedFromSales, priceCartAtStore } from './_lib/logic.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  const uid = getUserId(req);
  if (!uid) return send(res, 401, { error: 'missing_token' });

  const action = req.query.action || 'view';
  const body = readBody(req);

  try {
    switch (action) {
      case 'view':
        return send(res, 200, await cartView(uid));

      case 'add': {
        let sku = body.sku;
        if (!sku && body.text) sku = C.resolveSku(body.text);
        if (!sku || !C.getProduct(sku)) return send(res, 404, { error: 'unknown_product' });
        const cart = await store.getActiveCart(uid);
        await store.addItemAsync(cart.id, sku, body.qty || 1);
        return send(res, 201, await cartView(uid));
      }
      case 'remove': {
        const cart = await store.getActiveCart(uid);
        await store.removeItem(cart.id, body.sku || req.query.sku);
        return send(res, 200, await cartView(uid));
      }
      case 'check': {
        const cart = await store.getActiveCart(uid);
        await store.setChecked(cart.id, body.sku, !!body.checked);
        return send(res, 200, await cartView(uid));
      }
      case 'store': {
        if (!C.listStores().some(s => s.id === body.store_id)) return send(res, 400, { error: 'unknown_store' });
        const cart = await store.getActiveCart(uid);
        await store.setStore(cart.id, body.store_id);
        return send(res, 200, await cartView(uid));
      }
      case 'budget': {
        const cents = body.budget_cents;
        if (cents !== null && (!Number.isInteger(cents) || cents < 0)) return send(res, 400, { error: 'invalid_budget' });
        const cart = await store.getActiveCart(uid);
        await store.setBudget(cart.id, cents);
        return send(res, 200, await cartView(uid));
      }

      case 'qty': {
        const qty = body.qty;
        if (!Number.isInteger(qty) || qty < 0) return send(res, 400, { error: 'invalid_qty' });
        const cart = await store.getActiveCart(uid);
        await store.setQty(cart.id, body.sku, qty);
        return send(res, 200, await cartView(uid));
      }

      case 'compare': {
        const cart = await store.getActiveCart(uid);
        const skus = (await store.getItems(cart.id)).map(i => i.sku);
        return send(res, 200, compareStores(skus));
      }
      case 'route': {
        const cart = await store.getActiveCart(uid);
        const skus = (await store.getItems(cart.id)).map(i => i.sku);
        return send(res, 200, optimizeRoute(skus, cart.store_id || C.listStores()[0].id));
      }
      case 'split': {
        const cart = await store.getActiveCart(uid);
        const skus = (await store.getItems(cart.id)).map(i => i.sku);
        return send(res, 200, optimizeSplit(skus));
      }

      case 'clip': {
        const cart = await store.getActiveCart(uid);
        const skus = (await store.getItems(cart.id)).map(i => i.sku);
        const coupon = C.couponsFor(skus).find(c => c.id === (body.coupon_id || req.query.coupon_id));
        if (!coupon) return send(res, 404, { error: 'coupon_not_applicable' });
        await store.clipCoupon(uid, coupon.id, coupon.sku);
        return send(res, 200, { clipped: coupon.id });
      }
      case 'clipped':
        return send(res, 200, { clipped: await store.getClipped(uid) });

      case 'checkout': {
        const cart = await store.getActiveCart(uid);
        const items = await store.getItems(cart.id);
        if (!items.length) return send(res, 400, { error: 'empty_cart' });
        const skus = items.map(i => i.sku);
        const storeId = cart.store_id || C.listStores()[0].id;
        const clipped = await store.getClipped(uid, true);
        const applicable = C.couponsFor(skus);
        let couponValue = 0;
        for (const c of clipped) { const m = applicable.find(a => a.id === c.coupon_id); if (m) couponValue += m.value_cents || 0; }
        await store.redeemAllClipped(uid);
        const saleSavings = savedFromSales(skus, storeId);
        const total = priceCartAtStore(skus, storeId).total_cents;
        const cashback = couponValue + Math.round(total * 0.01);
        const totalSaved = saleSavings + couponValue;
        const stats = await completeTrip(uid, { saved_cents: totalSaved, cashback_cents: cashback });
        await store.completeCart(cart.id);
        return send(res, 200, {
          receipt: { store_id: storeId, total_cents: total, saved_cents: totalSaved, cashback_cents: cashback, coupons_redeemed: clipped.length },
          rewards: { wallet_cents: stats.wallet_cents, lifetime_cents: stats.lifetime_cents, trips: stats.trips, streak_weeks: stats.streak_weeks },
        });
      }

      default:
        return send(res, 400, { error: 'unknown_action', action });
    }
  } catch (e) {
    return send(res, 500, { error: 'internal', message: e.message });
  }
}
