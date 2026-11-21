import { store } from './_lib/store.js';
import { hashPassword, verifyPassword, signToken, getUserId } from './_lib/auth.js';
import { readBody, send, cors } from './_lib/http.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  const action = req.query.action;

  try {
    if (req.method === 'GET' && action === 'me') {
      const uid = getUserId(req);
      if (!uid) return send(res, 401, { error: 'missing_token' });
      const u = await store.getUser(uid);
      if (!u) return send(res, 404, { error: 'not_found' });
      return send(res, 200, { user: pub(u) });
    }

    if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
    const body = readBody(req);
    const email = String(body.email || '').toLowerCase().trim();
    const password = String(body.password || '');

    if (action === 'register') {
      if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return send(res, 400, { error: 'invalid_input' });
      let u;
      try { u = await store.createUser({ email, password_hash: hashPassword(password), name: body.name }); }
      catch { return send(res, 409, { error: 'email_taken' }); }
      return send(res, 201, { token: signToken(u), user: pub(u) });
    }

    if (action === 'login') {
      const u = await store.getUserByEmail(email);
      if (!u || !verifyPassword(password, u.password_hash)) return send(res, 401, { error: 'invalid_credentials' });
      return send(res, 200, { token: signToken(u), user: pub(u) });
    }

    return send(res, 400, { error: 'unknown_action' });
  } catch (e) {
    return send(res, 500, { error: 'internal', message: e.message });
  }
}

function pub(u) {
  return { id: u.id, email: u.email, name: u.name, plus: u.plus,
    wallet_cents: u.wallet_cents, lifetime_cents: u.lifetime_cents, streak_weeks: u.streak_weeks, trips: u.trips };
}
