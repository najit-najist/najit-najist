import { FC, PropsWithChildren } from 'react';
import { ADMIN_EMAIL } from '@constants';
import { TvIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

import InstagramIcon from '../../../public/icons/instagram.svg';
import { Logo } from '@components/common/Logo';
import Link from 'next/link';

const iconSize = 21;

type NavigationItem = {
  name: string;
  href: string;
  newTab?: boolean;
};

type NavigationItems = {
  social: (NavigationItem & { icon: typeof TvIcon; iconSize?: number })[];
  main: { useful: NavigationItem[]; actual: NavigationItem[] };
};

export const footerNavigationItems: NavigationItems = {
  social: [
    {
      name: 'Mail',
      href: `mailto:${ADMIN_EMAIL}`,
      icon: EnvelopeIcon,
    },
    {
      name: 'Telefon',
      href: `+420123456789`,
      icon: PhoneIcon,
    },
    {
      name: 'Instagram',
      href: `https://www.instagram.com/najitnajist/`,
      icon: InstagramIcon,
      iconSize: 23,
    },
  ],
  main: {
    useful: [
      { name: 'O nás', href: '/#o-nas' },
      { name: 'Kontakt', href: '/kontakt' },
      { name: 'Náš team', href: '/kontakt#nas-team' },
      { name: 'VOP', href: '/vop', newTab: true },
      { name: 'GDPR', href: '/gdpr', newTab: true },
    ],
    actual: [
      { name: 'Události', href: '/udalosti' },
      { name: 'Recepty', href: '/recepty' },
    ],
  },
};

export const Footer: FC<PropsWithChildren> = () => {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto container py-12 g:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Logo className="h-20 w-auto" />
            <address className="text-base text-gray-500 not-italic">
              Tomkova 1230/4a
              <br />
              Hradec Králové
              <br />
              500 03
            </address>
            <div className="flex space-x-6">
              {footerNavigationItems.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href as any}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon
                    width={item.iconSize ?? iconSize}
                    height={item.iconSize ?? iconSize}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-medium text-deep-green-300 font-title">
                  Užitečné
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNavigationItems.main.useful.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href as any}
                        className="text-base text-gray-500 hover:text-gray-900"
                        target={item.newTab ? '_blank' : undefined}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-base font-medium text-deep-green-300 font-title">
                  Aktuální
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNavigationItems.main.actual.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href as any}
                        className="text-base text-gray-500 hover:text-gray-900"
                        target={item.newTab ? '_blank' : undefined}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-medium text-gray-900">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-base font-medium text-gray-900">Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2022 <a href="https://najitnajist.cz">NajitNajist.cz</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
