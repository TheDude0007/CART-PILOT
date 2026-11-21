import * as C from './_lib/catalog.js';
import { send, cors } from './_lib/http.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  const { resource, q, sku } = req.query;
  switch (resource) {
    case 'stores':      return send(res, 200, { stores: C.listStores() });
    case 'search':      return send(res, 200, { results: C.searchProducts(q || '') });
    case 'resolve': {
      const s = C.resolveSku(q || '');
      return s ? send(res, 200, { sku: s, product: C.getProduct(s) }) : send(res, 404, { error: 'no_match' });
    }
    case 'product': {
      const p = C.getProduct(sku);
      return p ? send(res, 200, { product: p }) : send(res, 404, { error: 'not_found' });
    }
    case 'suggestions': return send(res, 200, { skus: C.suggestions(req.query.dept), depts: C.listDepts() });
    default:            return send(res, 400, { error: 'unknown_resource' });
  }
}
