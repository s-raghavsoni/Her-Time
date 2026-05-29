import { useEffect, useState } from 'react';
import { fetchProvider } from '../services/api';

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

export default function ProviderDetailPage({ userId }) {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchProvider(userId)
      .then((data) => {
        if (!cancelled) {
          setProvider(data.provider);
          setPhotoError(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load provider.');
          setProvider(null);
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
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Loading provider…</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Provider not found.'}
        </p>
        <a
          href="/providers"
          className="mt-6 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← Back to providers
        </a>
      </div>
    );
  }

  const showPhoto = provider.profile_photo_url && !photoError;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <a href="/providers" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            ← All providers
          </a>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Her Time</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 px-6 py-8 md:px-8">
            <div className="flex flex-wrap items-start gap-5">
              {showPhoto ? (
                <img
                  src={provider.profile_photo_url}
                  alt={provider.full_name}
                  onError={() => setPhotoError(true)}
                  className="h-24 w-24 shrink-0 rounded-2xl border-2 border-white/30 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-white/30 bg-white/20 text-2xl font-bold text-white shadow-lg">
                  {getInitials(provider.full_name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    provider.is_available
                      ? 'bg-emerald-500/20 text-emerald-100'
                      : 'bg-white/20 text-white/80'
                  }`}
                >
                  {provider.is_available ? 'Available' : 'Unavailable'}
                </span>
                <h1 className="mt-3 text-2xl font-bold text-white md:text-3xl">{provider.full_name}</h1>
                <p className="mt-1 text-sm font-medium text-brand-100">{formatRole(provider.role)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-8 md:px-8">
            {provider.bio && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">About</h2>
                <p className="mt-2 text-slate-700 leading-relaxed">{provider.bio}</p>
              </section>
            )}

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Experience</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {provider.experience_years}{' '}
                  {provider.experience_years === 1 ? 'year' : 'years'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hourly rate</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {provider.hourly_rate != null ? `$${provider.hourly_rate}/hr` : 'Not listed'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Service area</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {provider.service_area || 'Not specified'}
                </p>
              </div>
            </section>

            <button
              type="button"
              className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Request Service
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}
