import { randomUUID } from 'node:crypto';
import { pool } from '../config/database.js';

const PROVIDER_ROLES = ['home_cook', 'tutor', 'beautician', 'cleaning'];

const PROFILE_FIELDS =
  'id, user_id, bio, experience_years, hourly_rate, service_area, profile_photo_url, is_available, created_at';

function httpError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

async function getUserRole(userId) {
  const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
  return rows[0]?.role ?? null;
}

export async function createProviderProfile(userId, body) {
  const role = await getUserRole(userId);

  if (!role) {
    throw httpError('Unauthorized', 401);
  }

  if (role === 'customer') {
    throw httpError('Only providers can create a profile', 403);
  }

  if (!PROVIDER_ROLES.includes(role)) {
    throw httpError('Only providers can create a profile', 403);
  }

  const {
    bio,
    experience_years,
    hourly_rate,
    service_area,
    profile_photo_url,
    is_available,
  } = body ?? {};

  const id = randomUUID();

  try {
    const { rows } = await pool.query(
      `INSERT INTO provider_profiles (
         id, user_id, bio, experience_years, hourly_rate, service_area, profile_photo_url, is_available
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING ${PROFILE_FIELDS}`,
      [
        id,
        userId,
        bio ?? null,
        experience_years ?? 0,
        hourly_rate ?? null,
        service_area ?? null,
        profile_photo_url ?? null,
        is_available ?? true,
      ],
    );

    return rows[0];
  } catch (err) {
    if (err.code === '23505') {
      throw httpError('Provider profile already exists', 409);
    }

    throw err;
  }
}

export async function getProviderProfile(userId) {
  const { rows } = await pool.query(
    `SELECT ${PROFILE_FIELDS} FROM provider_profiles WHERE user_id = $1`,
    [userId],
  );

  if (!rows[0]) {
    throw httpError('Provider profile not found', 404);
  }

  return rows[0];
}
