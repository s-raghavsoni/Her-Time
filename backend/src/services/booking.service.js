import { randomUUID } from 'node:crypto';
import { pool } from '../config/database.js';

const PROVIDER_ROLES = [
  'home_cook',
  'tutor',
  'beautician',
  'cleaning',
];

function httpError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

async function getUser(userId) {
  const { rows } = await pool.query(
    `SELECT id, full_name, role
     FROM users
     WHERE id = $1`,
    [userId],
  );

  return rows[0] ?? null;
}

export async function createBooking(customerId, body) {
  const customer = await getUser(customerId);

  if (!customer || customer.role !== 'customer') {
    throw httpError('Only customers can create bookings', 403);
  }

  const {
    provider_user_id,
    message,
    service_date,
  } = body ?? {};

  if (!provider_user_id || !service_date) {
    throw httpError(
      'provider_user_id and service_date are required',
      400,
    );
  }

  if (provider_user_id === customerId) {
    throw httpError('You cannot book yourself', 400);
  }

  const provider = await getUser(provider_user_id);

  if (!provider) {
    throw httpError('Provider not found', 404);
  }

  if (!PROVIDER_ROLES.includes(provider.role)) {
    throw httpError('Provider not found', 404);
  }

  const id = randomUUID();

  const { rows } = await pool.query(
    `INSERT INTO bookings (
      id,
      customer_id,
      provider_user_id,
      message,
      service_date
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      id,
      customerId,
      provider_user_id,
      message ?? null,
      service_date,
    ],
  );

  return rows[0];
}

export async function getBookings(userId) {
  const user = await getUser(userId);

  if (!user) {
    throw httpError('Unauthorized', 401);
  }

  const isCustomer = user.role === 'customer';

  const { rows } = await pool.query(
    `
    SELECT
      b.id,
      b.status,
      b.message,
      b.service_date,
      b.created_at,
      customer.full_name AS customer_name,
      provider.full_name AS provider_name,
      provider.role AS provider_role
    FROM bookings b
    INNER JOIN users customer
      ON customer.id = b.customer_id
    INNER JOIN users provider
      ON provider.id = b.provider_user_id
    WHERE ${
      isCustomer
        ? 'b.customer_id = $1'
        : 'b.provider_user_id = $1'
    }
    ORDER BY b.created_at DESC
    `,
    [userId],
  );

  return rows;
}