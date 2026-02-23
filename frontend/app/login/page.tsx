'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/services/authServices';

export default function Login() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('Crew');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const profile = await loginUser(trimmedEmail, password);

      if (!profile) {
        setError('Email o contraseña inválidos. Intenta nuevamente.');
        return;
      }

      if (profile.role !== selectedRole) {
        setError('El rol seleccionado no coincide con su cuenta');
        return;
      }

      localStorage.setItem('userProfile', JSON.stringify(profile));
      router.push('/dashboard/servicio');
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocurrió un error durante el inicio de sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-8 text-center text-3xl font-bold text-red-600">Bienvenido a McSimple</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Rol</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
            >
              <option value="Crew">Crew</option>
              <option value="Entrenador">Entrenador</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Email / Usuario</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="Ingresa tu email o usuario"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Ingresa tu contraseña"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
            />

            {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-red-600 py-4 text-lg font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}