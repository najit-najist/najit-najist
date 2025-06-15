import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Logo } from '@components/common/Logo';
import { ADMIN_EMAIL, COMPANY_INFO } from '@constants';
import { TvIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';

import InstagramIcon from '../../../public/icons/instagram.svg';
import { UpdateCookiePreferences } from './UpdateCookiePreferences';

const iconSize = 21;

type NavigationItem = {
  name: string;
  href: string;
  newTab?: boolean;
};

type NavigationItems = {
  social: (NavigationItem & { icon: typeof TvIcon; iconSize?: number })[];
  main: {
    useful: NavigationItem[];
    actual: NavigationItem[];
    other: NavigationItem[];
  };
};

const YoutubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="-mt-0.5"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z" />
  </svg>
);

export const footerNavigationItems: NavigationItems = {
  social: [
    {
      name: 'Mail',
      href: `mailto:${ADMIN_EMAIL}`,
      icon: EnvelopeIcon,
      iconSize: 23,
    },
    {
      name: 'Instagram',
      href: `https://www.instagram.com/najitnajist/`,
      icon: InstagramIcon,
      iconSize: 22,
    },
    {
      name: 'YouTube',
      href: `https://www.youtube.com/@NajitNajist/videos`,
      icon: YoutubeIcon,
      iconSize: 23,
    },
    {
      name: 'Telefon',
      href: `tel:+420792651408`,
      icon: PhoneIcon,
      iconSize: 20,
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
      { name: 'Články', href: '/clanky' },
      { name: 'E-Shop', href: '/produkty' },
    ],
    other: [],
  },
};

export const Footer: FC<PropsWithChildren> = () => {
  return (
    <footer aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto container pb-12 pt-12 sm:pt-20">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="flex flex-wrap gap-y-8 gap-x-10 lg:block lg:col-span-1">
            <Logo className="h-28 w-auto flex-none" />
            <div className="lg:mt-6">
              <address className="text-base text-gray-500 not-italic">
                {COMPANY_INFO.address.street}
                <br />
                {COMPANY_INFO.address.city}
                <br />
                {COMPANY_INFO.address.postCode}
              </address>
              <div className="flex space-x-6 mt-4">
                {footerNavigationItems.social.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href as any}
                    className="text-project-accent/60 hover:text-project-accent"
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
          </div>
          <div className="mt-12 lg:mt-0 grid grid-cols-2 gap-8 lg:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-medium text-project-secondary font-title">
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
                <h3 className="text-base font-medium text-project-secondary font-title">
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
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* <div>
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
                </div> */}
              {/* <div className="mt-12 md:mt-0">
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
              <div>
                <h3 className="text-base font-medium text-project-secondary font-title">
                  Ostatní
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNavigationItems.main.other.map((item) => (
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
                  <li>
                    <UpdateCookiePreferences />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex">
          <p className={buttonStyles({ appearance: 'link', size: 'sm' })}>
            &copy; {new Date().getFullYear()}{' '}
            <a href="https://najitnajist.cz">NajitNajist.cz</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
