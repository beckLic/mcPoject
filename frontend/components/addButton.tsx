import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-red-600 shadow-lg transition-transform hover:scale-110 hover:bg-red-700 flex items-center justify-center"
      aria-label="Add new item"
    >
      <Plus className="h-8 w-8 text-white" strokeWidth={2.5} />
    </button>
  );
}
