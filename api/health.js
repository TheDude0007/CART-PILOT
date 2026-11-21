import { store } from './_lib/store.js';
import { send, cors } from './_lib/http.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  send(res, 200, { ok: true, service: 'cartpilot-api', storage: store.kind, ts: new Date().toISOString() });
}
