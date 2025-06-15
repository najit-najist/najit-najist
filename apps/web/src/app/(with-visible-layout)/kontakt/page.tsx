import { COMPANY_INFO } from '@constants';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { getLoggedInUser } from '@server/utils/server';
import { StaticImageData } from 'next/image';
import { FC } from 'react';

import { ContactForm } from './_components/ContactForm';
import { imagePosition, UserHead } from './_components/UserHead';
import arnostZizkaUrl from '/public/images/team/arnost-zizka.jpg';
import lenkaCernouskovaUrl from '/public/images/team/lenka-cernouskova.jpg';
import ondrejLangrUrl from '/public/images/team/ondrej-langr.jpg';
import terezaZizkovaUrl from '/public/images/team/tereza-zizkova.jpg';
import vojtechZizkaUrl from '/public/images/team/vojtech-zizka.jpg';

export const metadata = {
  title: 'Kontakt',
};

const teamMembers: {
  name: string;
  title: string;
  imageUrl: StaticImageData;
  imagePosition?: imagePosition;
}[] = [
  {
    name: 'Arnošt Žižka',
    title: 'Jednatel',
    imageUrl: arnostZizkaUrl,
  },
  {
    name: 'Lenka Černoušková',
    title: 'Finance',
    imageUrl: lenkaCernouskovaUrl,
    imagePosition: 'center',
  },
  {
    name: 'Vojtěch Žižka',
    title: 'Grafik',
    imageUrl: vojtechZizkaUrl,
  },
  {
    name: 'Tereza Žižková',
    title: 'PR, Marketing a Grafik',
    imageUrl: terezaZizkovaUrl,
  },
  {
    name: 'Ondřej Langr',
    title: 'Programátor',
    imageUrl: ondrejLangrUrl,
  },
];

const ContactPage: FC = async () => {
  const loggedInUser = await getLoggedInUser().catch(() => undefined);

  return (
    <>
      <div className="container">
        <div className="mx-auto">
          <h2 className="text-4xl font-bold font-title tracking-wide mt-10 mb-7">
            {metadata.title}
          </h2>
        </div>
        <div>
          <ContactForm
            defaultValues={{
              email: loggedInUser?.email,
              firstName: loggedInUser?.firstName,
              lastName: loggedInUser?.lastName,
              telephone: loggedInUser?.telephone
                ? `+${loggedInUser?.telephone?.code} ${loggedInUser?.telephone?.telephone}`
                : undefined,
            }}
          />
        </div>
      </div>

      <div className="container" id="prodejny">
        <div className="mx-auto">
          <h2 className="text-4xl font-bold mt-20 mb-7 font-title tracking-wide">
            Sídlo
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-project flex gap-x-4 gap-y-3 flex-col sm:justify-end sm:flex-row-reverse">
            <iframe
              className="w-full sm:w-1/2 top-0 left-0 rounded-project shadow-white bg-white shadow-lg flex-none h-56"
              scrolling="no"
              frameBorder={0}
              src={COMPANY_INFO.map.location}
            ></iframe>

            <div className="w-full sm:w-1/2">
              <p className="text-project-primary text-3xl font-semibold mt-4 font-title">
                {COMPANY_INFO.name}
              </p>

              <address className="block mt-2 font-normal not-italic text-xl ">
                {COMPANY_INFO.address.street} <br />
                {COMPANY_INFO.address.city}
                <br />
                {COMPANY_INFO.address.postCode}
              </address>

              {COMPANY_INFO.emailAddress ? (
                <a
                  href={`mailto:${COMPANY_INFO.emailAddress}`}
                  className="mt-2 block hover:underline text-project-accent"
                >
                  <AtSymbolIcon className="w-4 h-4 inline-block mr-2" />{' '}
                  {COMPANY_INFO.emailAddress.replace('@', '(at)')}
                </a>
              ) : null}

              {COMPANY_INFO.telephoneNumbers.length
                ? COMPANY_INFO.telephoneNumbers.map(({ code, telephone }) => (
                    <a
                      key={code + telephone}
                      href={`tel:${code.replaceAll(' ', '')}${telephone.replaceAll(' ', '')}`}
                      className="mt-2 block hover:underline text-project-accent"
                    >
                      <PhoneIcon className="w-4 h-4 inline-block mr-2" /> +
                      {code} {telephone}
                    </a>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-16 mb-10" id="nas-team">
        <div className="mx-auto">
          <h2 className="text-4xl font-bold mt-20 mb-7 font-title tracking-wide">
            Náš tým
          </h2>
        </div>
        <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {teamMembers.map((memberInfo) => (
            <UserHead
              key={memberInfo.name}
              image={memberInfo.imageUrl}
              name={memberInfo.name}
              position={memberInfo.title}
              imagePosition={memberInfo.imagePosition}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ContactPage;
