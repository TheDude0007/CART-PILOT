import { store } from './_lib/store.js';
import { getUserId } from './_lib/auth.js';
import { send, cors } from './_lib/http.js';

const CASHOUT_MIN = 2500;

export default async function handler(req, res) {
  if (cors(req, res)) return;
  const uid = getUserId(req);
  if (!uid) return send(res, 401, { error: 'missing_token' });
  const action = req.query.action || 'wallet';

  try {
    if (action === 'wallet') {
      const u = await store.getUser(uid);
      const ledger = await store.getLedger(uid, 20);
      return send(res, 200, { wallet_cents: u.wallet_cents, lifetime_cents: u.lifetime_cents, streak_weeks: u.streak_weeks, trips: u.trips, plus: u.plus, ledger });
    }
    if (action === 'cashout') {
      const u = await store.getUser(uid);
      if (u.wallet_cents < CASHOUT_MIN) return send(res, 400, { error: 'below_minimum', needed_cents: CASHOUT_MIN - u.wallet_cents });
      const amount = u.wallet_cents;
      await store.credit(uid, -amount, 'cashout');
      return send(res, 200, { cashed_out_cents: amount });
    }
    if (action === 'plus_subscribe') { await store.updateUser(uid, { plus: 1 }); return send(res, 200, { plus: true }); }
    if (action === 'plus_cancel') { await store.updateUser(uid, { plus: 0 }); return send(res, 200, { plus: false }); }
    return send(res, 400, { error: 'unknown_action' });
  } catch (e) {
    return send(res, 500, { error: 'internal', message: e.message });
  }
}
