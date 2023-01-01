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
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email-address"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border-white px-5 py-3 placeholder-warm-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-700"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-green-400 px-5 py-3 text-base font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-cyan-700 sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
            >
              Notify me
            </button>
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
