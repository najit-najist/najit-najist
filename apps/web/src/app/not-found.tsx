import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="text-center">
        <h1 className="text-deep-green-400 text-6xl font-bold">404 ☹️</h1>
        <p className="text-2xl mt-2 mb-6">Stránka nenalezena...</p>
        <div className="flex gap-4 justify-center">
          <Link href="/">Domů</Link>
          <Link href="/kontakt">Kontakt</Link>
        </div>
      </div>
    </div>
  );
}
