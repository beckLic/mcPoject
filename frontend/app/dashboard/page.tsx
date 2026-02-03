'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Type definition for user profile
interface UserProfile {
  id: string;
  full_name: string;
  legajo: string;
  role: string;
  [key: string]: unknown;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication Guard
  useEffect(() => {
    const userProfileString = localStorage.getItem('userProfile');
    
    if (userProfileString) {
      try {
        const userProfile = JSON.parse(userProfileString);
        setUser(userProfile);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing user profile:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  // Prevent UI flickering - Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-red-600 font-semibold text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  const gridItems = [
    { label: 'Servicio', icon: '👥' },
    { label: 'Cocina', icon: '👨‍🍳' },
    { label: 'Lobby', icon: '🪑' },
    { label: 'CDP', icon: '🍦' },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {gridItems.map((item) => (
            <button
              key={item.label}
              className="aspect-square bg-red-600 hover:bg-red-700 text-white rounded-lg flex flex-col items-center justify-center gap-3 font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <span className="text-6xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}