import { useEffect, useState } from 'react';
import { fetchHealth } from './services/api';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import RegisterPage from './pages/RegisterPage';

const TOKEN_KEY = 'hertime_token';

function Home() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <main className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-600">Her Time</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Marketplace foundation</h1>
        <p className="mt-3 text-slate-600">
          React + Vite + Tailwind frontend connected to the Express API.
        </p>

        <div className="mt-8 rounded-lg bg-slate-50 p-4 text-sm">
          <p className="font-medium text-slate-700">API health</p>
          {error && <p className="mt-2 text-red-600">{error}</p>}
          {!error && !health && <p className="mt-2 text-slate-500">Checking backend…</p>}
          {health && (
            <pre className="mt-2 overflow-x-auto text-xs text-slate-600">
              {JSON.stringify(health, null, 2)}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === '/dashboard') {
    return <DashboardPage />;
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/register') {
    return <RegisterPage />;
  }

  if (path === '/provider/profile') {
    return <ProviderProfilePage />;
  }

  if (path === '/' && localStorage.getItem(TOKEN_KEY)) {
    window.location.assign('/dashboard');
    return null;
  }

  return <Home />;
}

export default App;
