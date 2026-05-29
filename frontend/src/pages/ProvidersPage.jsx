import { useEffect, useState } from 'react';
import { fetchProviders } from '../services/api';

const FILTERS = [
  { label: 'All', value: null },
  { label: 'Tutor', value: 'tutor' },
  { label: 'Home Cook', value: 'home_cook' },
  { label: 'Beautician', value: 'beautician' },
  { label: 'Cleaning', value: 'cleaning' },
];

function formatRole(role) {
  return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ProvidersPage() {
  const [roleFilter, setRoleFilter] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function handleFilterChange(value) {
    setLoading(true);
    setError(null);
    setRoleFilter(value);
  }

  useEffect(() => {
    let cancelled = false;

    fetchProviders(roleFilter)
      .then((data) => {
        if (!cancelled) {
          setProviders(data.providers ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load providers.');
          setProviders([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [roleFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Her Time</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Browse providers</h1>
            <p className="mt-1 text-sm text-slate-500">Find trusted local services near you</p>
          </div>
          <a
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            Back to dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => handleFilterChange(filter.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                roleFilter === filter.value
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-16 flex flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            <p className="text-sm font-medium text-slate-600">Loading providers…</p>
          </div>
        )}

        {!loading && error && (
          <p className="mt-12 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && providers.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-slate-900">No providers found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try another category or check back later for new listings.
            </p>
          </div>
        )}

        {!loading && !error && providers.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <a
                key={provider.user_id}
                href={`/provider/${provider.user_id}`}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-sm font-bold text-brand-700">
                    {getInitials(provider.full_name)}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      provider.is_available
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {provider.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <h2 className="mt-4 font-semibold text-slate-900">{provider.full_name}</h2>
                <p className="mt-1 text-sm font-medium text-brand-600">{formatRole(provider.role)}</p>

                {provider.bio && (
                  <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-600">{provider.bio}</p>
                )}

                <div className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">Area:</span>{' '}
                    {provider.service_area || 'Not specified'}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Rate:</span>{' '}
                    {provider.hourly_rate != null ? `$${provider.hourly_rate}/hr` : 'Not listed'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
