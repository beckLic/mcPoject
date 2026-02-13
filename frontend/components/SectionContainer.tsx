'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddButton from './addButton';
import AddCardModal from './addCardModal';
import { getCardsBySection, Tarjeta, deleteCard } from '@/app/services/cardServices';
import { LogOut } from 'lucide-react';

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionContainer({ title, children }: SectionContainerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState<Tarjeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoach, setIsCoach] = useState(false);
  const [editingCard, setEditingCard] = useState<Tarjeta | null>(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getCardsBySection(title);
      setCards(data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Robust role check
    try {
      const userProfileRaw = localStorage.getItem('userProfile');
      if (userProfileRaw) {
        const userProfile = JSON.parse(userProfileRaw);
        if (
          userProfile.role &&
          typeof userProfile.role === 'string' &&
          userProfile.role.trim() === 'Entrenador'
        ) {
          setIsCoach(true);
        } else {
          setIsCoach(false);
        }
      } else {
        setIsCoach(false);
      }
    } catch {
      setIsCoach(false);
    }
  }, [title]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCard(null); // Clear editing state
    fetchData();
  };

  // Edit handler
  const handleEdit = (card: Tarjeta) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  // Delete handler
  const handleDelete = async (cardId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta tarjeta?')) {
      try {
        await deleteCard(cardId);
        fetchData();
      } catch (error) {
        alert('Error al eliminar la tarjeta.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
          {title}
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
      
      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto mb-20">
        {isLoading ? (
          <div className="text-center text-gray-500 py-12">
            Cargando tarjetas...
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No hay tarjetas en esta sección
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 relative"
              >
                {/* Edit/Delete Buttons (Coach only) */}
                {isCoach && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(card)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-full"
                      title="Editar"
                    >
                      {/* Pencil SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.232-6.232a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
                      </svg>
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full"
                      title="Eliminar"
                    >
                      {/* X SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {/* Card Title */}
                <h3 className="text-lg font-bold text-black mb-3 line-clamp-2">
                  {card.title}
                </h3>
                {/* Card Content */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                  {card.content}
                </p>
                {/* Card Footer */}
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                  <span className="font-medium">
                    {card.created_by}
                  </span>
                  <span>
                    {formatDate(card.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden children prop (kept for backward compatibility) */}
      <div className="hidden">{children}</div>
      
      <AddButton onClick={() => setIsModalOpen(true)} />
      <AddCardModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        sectionName={title} 
        cardToEdit={editingCard}
      />
    </div>
  );
}