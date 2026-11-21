import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-in-prod';
const TTL = '7d';

export function hashPassword(pw) { return bcrypt.hashSync(pw, 10); }
export function verifyPassword(pw, hash) { return bcrypt.compareSync(pw, hash); }
export function signToken(user) { return jwt.sign({ uid: user.id, email: user.email }, SECRET, { expiresIn: TTL }); }

export function getUserId(req) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return null;
  try { return jwt.verify(token, SECRET).uid; } catch { return null; }
}
