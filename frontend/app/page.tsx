'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleCrewAccess = () => {
    localStorage.setItem('userProfile', JSON.stringify({ role: 'Crew', full_name: 'Equipo' }));
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-red-600">Bienvenido a McSimple</h1>
        
        <div className="flex flex-col gap-4">
          {/* Crew Button */}
          <button
            onClick={handleCrewAccess}
            className="flex-1 bg-yellow-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition-colors"
          >
            Crew
          </button>

          {/* Coach Link - keep as is */}
          <Link
            href="/login"
            className="flex-1 bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
          >
            Entrenador
          </Link>
        </div>
      </div>
    </div>
  );
}
