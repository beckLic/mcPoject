'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCoaches, validateCoach } from '@/app/services/authServices';

export default function Login() {
  const router = useRouter();
  const [coaches, setCoaches] = useState<string[]>([]);
  const [nombre, setNombre] = useState('');
  const [legajo, setLegajo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCoaches, setLoadingCoaches] = useState(true);

  // Load coaches on component mount
  useEffect(() => {
    const loadCoaches = async () => {
      try {
        const coachesList = await getCoaches();
        setCoaches(coachesList);
      } catch (err) {
        console.error('Failed to load coaches:', err);
        setCoaches([]);
      } finally {
        setLoadingCoaches(false);
      }
    };

    loadCoaches();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const trimmedLegajo = legajo.trim(); // Limpieza local

    if (!nombre || !trimmedLegajo) {
        setError('Por favor, completá todos los campos.');
        return;
    }

    // Validation
    if (!nombre || !trimmedLegajo) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const user = await validateCoach(nombre, trimmedLegajo);

      if (user) {
        // Save user profile to localStorage
        localStorage.setItem('userProfile', JSON.stringify(user));
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError('Nombre o legajo inválido. Intenta nuevamente.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocurrió un error durante el inicio de sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Red Header with Curved Bottom */}
      <div className="relative bg-red-600 pt-12 pb-20">
        <h1 className="text-center text-3xl font-bold text-black">Iniciar Sesión</h1>

        {/* Curved Bottom Edge */}
        <div className="absolute -bottom-12 left-0 right-0 h-12 bg-white rounded-t-3xl"></div>
      </div>

      {/* Main Form Container */}
      <div className="flex flex-1 items-center justify-center px-4 pt-16">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-8">
          {/* Name Select */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Nombre</label>
            <select
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loadingCoaches || loading}
              className="w-full border-b-2 border-black bg-transparent py-3 text-gray-800 focus:outline-none focus:border-red-600 placeholder-gray-400 transition-colors disabled:opacity-50"
            >
              <option value="" disabled>
                {loadingCoaches ? 'Cargando nombres...' : 'Selecciona un nombre'}
              </option>
              {coaches.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Legajo Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Legajo</label>
            <input
              type="text"
              value={legajo}
              onChange={(e) => setLegajo(e.target.value)}
              disabled={loading}
              placeholder="Ingresa tu legajo"
              className="w-full border-b-2 border-black bg-transparent py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors disabled:opacity-50"
            />

            {/* Error Message */}
            {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || loadingCoaches}
            className="w-full rounded-lg bg-red-600 py-4 text-lg font-bold text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg mt-12"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}