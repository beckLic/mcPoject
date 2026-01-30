'use client';

import { useState } from 'react';

export default function Login() {
  const [nombre, setNombre] = useState('');
  const [legajo, setLegajo] = useState('');

  const nombres = ['Marcos', 'Mara', 'Malena', 'Zaira', 'Franco', 'Rocio B', 'Rocio A', 'Valentina'];

  const handleLogin = () => {
    console.log({ nombre, legajo });
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
        <div className="w-full max-w-sm space-y-8">
          
          {/* Name Select */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Nombre</label>
            <select
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border-b-2 border-black bg-transparent py-3 text-gray-800 focus:outline-none focus:border-red-600 placeholder-gray-400 transition-colors"
            >
              <option value="" disabled>
                Selecciona un nombre
              </option>
              {nombres.map((name) => (
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
              placeholder="Ingresa tu legajo"
              className="w-full border-b-2 border-black bg-transparent py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-red-600 py-4 text-lg font-bold text-white hover:bg-red-700 transition-colors shadow-md hover:shadow-lg mt-12"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}