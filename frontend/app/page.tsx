import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-red-600">Bienvenido a McSimple</h1>
        
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="w-64 rounded-lg bg-red-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-red-700"
          >
            Crew
          </Link>
          
          <Link
            href="/login"
            className="w-64 rounded-lg bg-red-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-red-700"
          >
            Entrenador
          </Link>
        </div>
      </div>
    </div>
  );
}
