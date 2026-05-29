import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/api';

const TOKEN_KEY = 'hertime_token';

const PROVIDER_ROLES = ['home_cook', 'tutor', 'beautician', 'cleaning'];

const STATS = [
  { label: 'Available Providers', value: '128', change: '+12 this week' },
  { label: 'Active Requests', value: '3', change: '2 pending review' },
  { label: 'Nearby Services', value: '24', change: 'Within 5 km' },
  { label: 'Saved Providers', value: '5', change: 'Your shortlist' },
];

const FEATURED_PROVIDERS = [
  {
    name: 'Amina Hassan',
    role: 'Home cook',
    area: 'Downtown',
    hourlyRate: 28,
    available: true,
  },
  {
    name: 'Sofia Reyes',
    role: 'Tutor',
    area: 'Westside',
    hourlyRate: 35,
    available: true,
  },
  {
    name: 'Lena Okonkwo',
    role: 'Beautician',
    area: 'Midtown',
    hourlyRate: 45,
    available: false,
  },
  {
    name: 'Maria Chen',
    role: 'Cleaning',
    area: 'Riverside',
    hourlyRate: 22,
    available: true,
  },
];

const SIDEBAR_NAV = [
  'Dashboard',
  'Browse Providers',
  'My Profile',
  'Bookings',
  'Messages',
  'Settings',
  'Logout',
];

function formatRole(role) {
  return role.replace(/_/g, ' ');
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <p className="text-sm text-red-600">{error || 'Unable to load dashboard.'}</p>
      </div>
    );
  }

  const isProvider = PROVIDER_ROLES.includes(user.role);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Her Time</p>
          <p className="mt-1 text-sm text-slate-500">Marketplace</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {SIDEBAR_NAV.map((item) => (
            <button
              key={item}
              type="button"
              onClick={
                item === 'Logout'
                  ? handleLogout
                  : item === 'Browse Providers'
                    ? () => {
                        window.location.assign('/providers');
                      }
                    : undefined
              }
              className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                item === 'Dashboard'
                  ? 'bg-brand-50 text-brand-700'
                  : item === 'Logout'
                    ? 'text-slate-600 hover:bg-red-50 hover:text-red-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Her Time</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {SIDEBAR_NAV.slice(0, 4).map((item) => (
              <span
                key={item}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  item === 'Dashboard' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item}
              </span>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <section className="rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 p-6 text-white shadow-lg shadow-brand-600/20 md:p-8">
            <p className="text-sm font-medium text-brand-100">Good to see you</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Welcome, {user.full_name}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-brand-100">
              {formatRole(user.role)} · {user.city} — discover trusted local services in your area.
            </p>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-400">{stat.change}</p>
              </div>
            ))}
          </section>

          <section className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.assign('/providers')}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Browse Providers
            </button>
            <button
              type="button"
              onClick={() =>
                isProvider ? window.location.assign('/provider/profile') : window.location.assign('/dashboard')
              }
              className={`rounded-xl border px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
                isProvider
                  ? 'border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
                  : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
              }`}
              disabled={!isProvider}
            >
              Complete Provider Profile
            </button>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Featured providers</h2>
                <p className="mt-1 text-sm text-slate-500">Top-rated services near you</p>
              </div>
              <span className="hidden text-sm font-medium text-brand-600 sm:inline">View all →</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {FEATURED_PROVIDERS.map((provider) => (
                <article
                  key={provider.name}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-sm font-bold text-brand-700">
                      {getInitials(provider.name)}
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        provider.available
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {provider.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{provider.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{provider.role}</p>
                  <div className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
                    <p className="text-slate-600">
                      <span className="font-medium text-slate-800">Area:</span> {provider.area}
                    </p>
                    <p className="text-slate-600">
                      <span className="font-medium text-slate-800">Rate:</span> ${provider.hourlyRate}
                      /hr
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
