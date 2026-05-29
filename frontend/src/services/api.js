const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `API error: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export function fetchHealth() {
  return request('/api/health');
}

export function fetchProviders(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : '';
  return request(`/api/providers${query}`);
}

export function fetchProvider(userId) {
  return request(`/api/providers/${encodeURIComponent(userId)}`);
}

export function registerUser(body) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function loginUser(body) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function fetchCurrentUser(token) {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `API error: ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  return data;
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchProviderProfile(token) {
  const response = await fetch(`${API_BASE}/api/provider/profile`, {
    headers: authHeaders(token),
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const message = data.message || `API error: ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  return data.profile;
}

export async function createProviderProfile(token, body) {
  const response = await fetch(`${API_BASE}/api/provider/profile`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `API error: ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  return data;
}

export async function createBooking(token, body) {
  const response = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `API error: ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  return data;
}
