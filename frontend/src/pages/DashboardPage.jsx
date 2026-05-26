import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/api';

const TOKEN_KEY = 'hertime_token';

function formatRole(role) {
  return role.replace(/_/g, ' ');
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      window.location.assign('/login');
      return;
    }

    fetchCurrentUser(token)
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => {
        if (err.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.assign('/login');
          return;
        }
        setError(err.message || 'Failed to load your account.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.assign('/login');
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-slate-600">Loading your dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-red-600">{error || 'Unable to load dashboard.'}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <main className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-600">Her Time</p>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h1 className="text-xl font-semibold text-slate-900">Welcome {user.full_name}</h1>
          <p className="mt-3 text-sm text-slate-700">
            <span className="font-medium">Role:</span> {formatRole(user.role)}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            <span className="font-medium">City:</span> {user.city}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Log out
        </button>
      </main>
    </div>
  );
}
