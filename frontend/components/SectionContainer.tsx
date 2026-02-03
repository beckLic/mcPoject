import AddButton from './addButton';

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionContainer({ title, children }: SectionContainerProps) {
  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">{title}</h1>
      <div className="max-w-7xl mx-auto">{children}</div>
      <AddButton />
    </div>
  );
}
