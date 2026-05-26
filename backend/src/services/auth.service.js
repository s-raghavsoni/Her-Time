import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { env } from '../config/env.js';

const USER_PUBLIC_FIELDS =
  'id, full_name, phone_number, email, city, role, is_verified, created_at';

const VALID_ROLES = [
  'customer',
  'home_cook',
  'tutor',
  'beautician',
  'cleaning',
  'admin',
];

function httpError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export async function registerUser(body) {
  const { full_name, phone_number, email, password, city, role } = body ?? {};

  if (!full_name?.trim()) {
    throw httpError('Full name is required', 400);
  }

  if (!phone_number) {
    throw httpError('Phone number is required', 400);
  }

  if (!password) {
    throw httpError('Password is required', 400);
  }

  if (!city?.trim()) {
    throw httpError('City is required', 400);
  }

  if (!role) {
    throw httpError('Role is required', 400);
  }

  if (!VALID_ROLES.includes(role)) {
    throw httpError('Invalid role', 400);
  }

  const password_hash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  const normalizedEmail = email?.trim() || null;

  try {
    const { rows } = await pool.query(
      `INSERT INTO users (id, full_name, phone_number, email, password_hash, city, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, full_name, phone_number, email, city, role, is_verified, created_at`,
      [
        id,
        full_name.trim(),
        String(phone_number).trim(),
        normalizedEmail,
        password_hash,
        city.trim(),
        role,
      ],
    );

    return rows[0];
  } catch (err) {
    if (err.code === '23505') {
      const detail = err.detail ?? '';

      if (detail.includes('phone_number')) {
        throw httpError('Phone number already registered', 409);
      }

      if (detail.includes('email')) {
        throw httpError('Email already registered', 409);
      }

      throw httpError('User already exists', 409);
    }

    if (err.code === '23514') {
      throw httpError('Invalid role', 400);
    }

    throw err;
  }
}

export async function loginUser(body) {
  const { phone_number, password } = body ?? {};

  if (!phone_number) {
    throw httpError('Phone number is required', 400);
  }

  if (!password) {
    throw httpError('Password is required', 400);
  }

  const { rows } = await pool.query(
    `SELECT id, full_name, phone_number, email, city, role, is_verified, created_at, password_hash
     FROM users
     WHERE phone_number = $1`,
    [String(phone_number).trim()],
  );

  const user = rows[0];

  if (!user) {
    throw httpError('Invalid credentials', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw httpError('Invalid credentials', 401);
  }

  delete user.password_hash;

  const token = jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: '7d' });

  return { token, user };
}

export async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT ${USER_PUBLIC_FIELDS} FROM users WHERE id = $1`,
    [id],
  );

  return rows[0] ?? null;
}
