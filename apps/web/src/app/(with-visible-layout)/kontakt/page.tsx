import { brandedShops } from '@najit-najist/database/models';
import { getLoggedInUser } from '@server/utils/server';
import { StaticImageData } from 'next/image';
import { FC } from 'react';

import { ContactForm } from './_components/ContactForm';
import { imagePosition, UserHead } from './_components/UserHead';
import arnostZizkaUrl from '/public/images/team/arnost-zizka.jpg';
import kristynaZizkovaUrl from '/public/images/team/kristyna-zizkova.jpg';
import lenkaCernouskovaUrl from '/public/images/team/lenka-cernouskova.jpg';
import martinStaryUrl from '/public/images/team/martin-stary.jpg';
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
    name: 'Martin Starý',
    title: 'Marketing',
    imageUrl: martinStaryUrl,
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
  {
    name: 'Kristýna Žižková',
    title: 'Prodejna Hradec Králové',
    imageUrl: kristynaZizkovaUrl,
    imagePosition: 'center',
  },
];

const locations = brandedShops;

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
            Naše prodejny
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {locations.map((item) => (
            <div
              key={item.name}
              className="rounded-project flex gap-x-4 gap-y-3 flex-col sm:justify-end sm:flex-row-reverse"
            >
              <iframe
                className="w-full sm:w-1/2 top-0 left-0 rounded-project shadow-white bg-white shadow-lg flex-none h-56"
                scrolling="no"
                frameBorder={0}
                src={item.map.location}
              ></iframe>

              <div className="w-full sm:w-1/2">
                <p className="text-project-primary text-3xl font-semibold mt-4 font-title">
                  {item.name}
                </p>

                <address className="block mt-2 font-normal not-italic text-xl ">
                  {item.address.street} <br />
                  {item.address.city}
                  <br />
                  {item.address.postCode}
                </address>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-16 mb-10" id="nas-team">
        <div className="mx-auto">
          <h2 className="text-4xl font-bold mt-20 mb-7 font-title tracking-wide">
            Náš tým
          </h2>
        </div>
        <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
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
