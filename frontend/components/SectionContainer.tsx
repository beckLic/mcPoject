'use client';

import { useState, useEffect } from 'react';
import AddButton from './addButton';
import AddCardModal from './addCardModal';
import { getCardsBySection, Tarjeta } from '@/app/services/cardServices';

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionContainer({ title, children }: SectionContainerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState<Tarjeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, [title]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchData(); // Auto-refresh after creating a card
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
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
        {title}
      </h1>
      
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
                key={card.uuid}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-5"
              >
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
      />
    </div>
  );
}