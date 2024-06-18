import Link from 'next/link';

export const metadata = {
  robots: {
    follow: false,
    index: false,
    googleBot: {
      follow: false,
      index: false,
    },
  },
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="text-center">
        <h1 className="text-project-primary text-6xl font-bold">401 ☹️</h1>
        <p className="text-2xl mt-2 mb-6">Na tuto stránku nemáte přístup...</p>
        <div className="flex gap-4 justify-center">
          <Link href="/">Domů</Link>
          <Link href="/muj-ucet/profil">Můj Profil</Link>
          <Link href="/kontakt">Kontakt</Link>
        </div>
      </div>
    </div>
  );
}
