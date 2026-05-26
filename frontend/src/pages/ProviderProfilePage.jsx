import { useEffect, useState } from 'react';
import { createProviderProfile, fetchCurrentUser, fetchProviderProfile } from '../services/api';

const TOKEN_KEY = 'hertime_token';

const PROVIDER_ROLES = ['home_cook', 'tutor', 'beautician', 'cleaning'];

const emptyForm = {
  bio: '',
  experience_years: '0',
  hourly_rate: '',
  service_area: '',
  profile_photo_url: '',
  is_available: true,
};

export default function ProviderProfilePage() {
  const [form, setForm] = useState(emptyForm);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      window.location.assign('/login');
      return;
    }

    async function loadPage() {
      try {
        const { user } = await fetchCurrentUser(token);

        if (user.role === 'customer' || !PROVIDER_ROLES.includes(user.role)) {
          window.location.assign('/dashboard');
          return;
        }

        const profile = await fetchProviderProfile(token);

        if (profile) {
          setForm({
            bio: profile.bio ?? '',
            experience_years: String(profile.experience_years ?? 0),
            hourly_rate: profile.hourly_rate != null ? String(profile.hourly_rate) : '',
            service_area: profile.service_area ?? '',
            profile_photo_url: profile.profile_photo_url ?? '',
            is_available: profile.is_available ?? true,
          });
        }
      } catch (err) {
        if (err.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.assign('/login');
          return;
        }
        setError(err.message || 'Failed to load profile.');
      } finally {
        setPageLoading(false);
      }
    }

    loadPage();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      window.location.assign('/login');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const payload = {
      bio: form.bio.trim() || null,
      experience_years: Number(form.experience_years) || 0,
      hourly_rate: form.hourly_rate === '' ? null : Number(form.hourly_rate),
      service_area: form.service_area.trim() || null,
      profile_photo_url: form.profile_photo_url.trim() || null,
      is_available: form.is_available,
    };

    try {
      await createProviderProfile(token, payload);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSubmitting(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-slate-600">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <main className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-600">Her Time</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Provider profile</h1>
        <p className="mt-2 text-sm text-slate-600">Tell clients about your services.</p>

        {success && (
          <p className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Profile saved successfully.
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              disabled={submitting}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor="experience_years" className="block text-sm font-medium text-slate-700">
              Years of experience
            </label>
            <input
              id="experience_years"
              name="experience_years"
              type="number"
              min="0"
              value={form.experience_years}
              onChange={handleChange}
              disabled={submitting}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor="hourly_rate" className="block text-sm font-medium text-slate-700">
              Hourly rate
            </label>
            <input
              id="hourly_rate"
              name="hourly_rate"
              type="number"
              min="0"
              value={form.hourly_rate}
              onChange={handleChange}
              disabled={submitting}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor="service_area" className="block text-sm font-medium text-slate-700">
              Service area
            </label>
            <input
              id="service_area"
              name="service_area"
              type="text"
              value={form.service_area}
              onChange={handleChange}
              disabled={submitting}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor="profile_photo_url" className="block text-sm font-medium text-slate-700">
              Profile photo URL
            </label>
            <input
              id="profile_photo_url"
              name="profile_photo_url"
              type="text"
              value={form.profile_photo_url}
              onChange={handleChange}
              disabled={submitting}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              name="is_available"
              type="checkbox"
              checked={form.is_available}
              onChange={handleChange}
              disabled={submitting}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Available for bookings
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </main>
    </div>
  );
}
