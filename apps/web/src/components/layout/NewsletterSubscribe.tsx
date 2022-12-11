import { Button, Input } from '@najit-najist/ui';
import Link from 'next/link';
import { FC } from 'react';

// TODO: make this work

export const NewsletterSubscribe: FC = () => {
  return (
    <div className="relative container">
      <div className="rounded-3xl bg-gradient-to-br from-deep-green-300 to-deep-green-700 py-10 px-6 sm:py-16 sm:px-12 lg:flex lg:items-center lg:py-20 lg:px-20">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Přihlašte se k našemu newsletteru
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-cyan-100">
            Buďte vždy v obraze o novinkách a akcích z našeho webu.
          </p>
        </div>
        <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
          <form className="sm:flex">
            <Input
              id="email-address"
              name="email-address"
              type="email"
              placeholder="Váš email"
              autoComplete="email"
              size="md"
              label="Emailová adresa"
              rootClassName="w-full"
              hideLabel
            />
            <Button
              type="submit"
              color="sweet"
              className="whitespace-nowrap ml-3"
            >
              Přihlásit se
            </Button>
          </form>

          <p className="mt-3 text-sm text-cyan-100">
            Záleží nám na vašich dat a jejich ochranu. Přečtě si naše{' '}
            <Link href="/gdpr" className="font-medium text-white underline">
              GDPR.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
