import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Footer, Header } from '@components/layout';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="w-full">
      <Header />
      <main>
        <div className="min-h-[50vh] flex items-center justify-center w-full">
          <div className="text-center">
            <h1 className="text-project-primary text-6xl font-bold">404 ☹️</h1>
            <p className="text-2xl mt-2 mb-6">Stránka nenalezena...</p>
            <div className="flex gap-4 justify-center">
              <Link href="/" className={buttonStyles({ appearance: 'link' })}>
                Domů
              </Link>
              <Link
                href="/kontakt"
                className={buttonStyles({ appearance: 'link' })}
              >
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
