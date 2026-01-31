'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const menuItems = [
    { label: 'Inicio', href: '/dashboard', icon: '🏠' },
    { label: 'Servicio', href: '#servicio', icon: '👥' },
    { label: 'Cocina', href: '#cocina', icon: '👨‍🍳' },
    { label: 'Lobby', href: '#lobby', icon: '🪑' },
    { label: 'CDP', href: '#cdp', icon: '🍦' },
  ];

  const gridItems = [
    { label: 'Servicio', icon: '👥' },
    { label: 'Cocina', icon: '👨‍🍳' },
    { label: 'Lobby', icon: '🪑' },
    { label: 'CDP', icon: '🍦' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar/Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-red-600 text-white shadow-lg transition-transform duration-300 ease-in-out z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-700">
          <h2 className="text-xl font-bold">McSimple</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-red-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => item.label === 'Inicio' && setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={28} className="text-red-600" />
          </button>
          <h1 className="text-2xl font-bold text-red-600">{user?.full_name || 'Dashboard'}</h1>
          <div className="w-10" />
        </div>

        {/* Center Content - Grid */}
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-6">
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
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}