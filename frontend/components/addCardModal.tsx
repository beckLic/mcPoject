'use client';

import { useState, FormEvent, useEffect } from 'react';
import { X } from 'lucide-react';
import { createCard, updateCard } from '@/app/services/cardServices';

interface Tarjeta {
  id: string;
  title: string;
  content: string;
  section: string;
  created_by?: string;
  updated_by?: string;
}

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionName: string;
  cardToEdit?: Tarjeta | null;
}

export default function AddCardModal({ isOpen, onClose, sectionName, cardToEdit }: AddCardModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill for editing
  useEffect(() => {
    if (cardToEdit) {
      setTitle(cardToEdit.title);
      setContent(cardToEdit.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [cardToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const userName = userProfile.full_name || userProfile.email || 'Entrenador';

      if (cardToEdit) {
        // Edit mode
        await updateCard(cardToEdit.id, {
          title: title.trim(),
          content: content.trim(),
          section: sectionName.trim(),
          updated_by: userName,
        });
      } else {
        // Create mode
        await createCard({
          title: title.trim(),
          content: content.trim(),
          section: sectionName.trim(),
          created_by: userName,
          updated_by: userName,
        });
      }

      setTitle('');
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error creating/updating card:', error);
      alert('Error al guardar la tarjeta. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {cardToEdit ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-white hover:bg-red-700 rounded-full p-1 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Input */}
          <div>
            <label htmlFor="card-title" className="block text-sm font-semibold text-gray-700 mb-2">
              Título
            </label>
            <input
              id="card-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el título de la tarjeta"
              required
              maxLength={100}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="card-content" className="block text-sm font-semibold text-gray-700 mb-2">
              Contenido
            </label>
            <textarea
              id="card-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe las instrucciones o mensaje..."
              required
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Section Info (Read-only display) */}
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Sección:</span> {sectionName}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border-2 border-red-600 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : cardToEdit ? 'Actualizar' : 'Aceptar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

