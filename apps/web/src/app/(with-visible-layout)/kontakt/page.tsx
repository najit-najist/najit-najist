import { FC } from 'react';

import ondrejLangrUrl from '/public/images/team/ondrej-langr.jpg';
import arnostZizkaUrl from '/public/images/team/arnost-zizka.jpg';
import martinStaryUrl from '/public/images/team/martin-stary.jpg';
import terezaZizkovaUrl from '/public/images/team/tereza-zizkova.jpg';
import vojtechZizkaUrl from '/public/images/team/vojtech-zizka.jpg';
import lenkaCernouskovaUrl from '/public/images/team/lenka-cernouskova.jpg';
import kristynaZizkovaUrl from '/public/images/team/kristyna-zizkova.jpg';
import { imagePosition, UserHead } from './_components/UserHead';
import { StaticImageData } from 'next/image';
import { ContactForm } from './_components/ContactForm';

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

const locations = [
  {
    name: 'Prodejna v Hradci',
    address: {
      city: 'Hradec Kralové',
      postCode: '500 03',
      street: 'Tomkova 1230/4a',
    },
    map: {
      location:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2553.3877819242625!2d15.8321447!3d50.2099736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470c2b2d912fc907%3A0xad7818771f15e6cc!2s4a%2C%20Tomkova%201230%2F4A%2C%20500%2003%20Hradec%20Kr%C3%A1lov%C3%A9!5e0!3m2!1sen!2scz!4v1691750049156!5m2!1sen!2scz',
    },
  },
];

const ContactPage: FC = () => {
  return (
    <>
      <div className="container">
        <div className="mx-auto">
          <h2 className="text-5xl font-bold font-title tracking-wide mt-10 mb-7">
            {metadata.title}
          </h2>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>

      <div className="container my-20" id="nas-team">
        <div className="mx-auto">
          <h2 className="text-5xl font-bold mt-10 mb-7 font-title tracking-wide">
            Náš tým
          </h2>
        </div>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
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

      <div className="container" id="prodejny">
        <div className="mx-auto">
          <h2 className="text-5xl font-bold mt-10 mb-7 font-title tracking-wide">
            Prodejny
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((item) => (
            <div key={item.name} className="p-2 bg-white rounded-lg shadow-lg">
              <iframe
                className="w-full top-0 left-0 rounded-lg shadow-white bg-white aspect-square"
                scrolling="no"
                frameBorder={0}
                src={item.map.location}
              ></iframe>

              <div className="p-2">
                <p className="text-project-primary text-2xl font-semibold mt-4 font-title">
                  {item.name}
                </p>

                <address className="block mt-1 font-normal not-italic">
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
    </>
  );
};

export default ContactPage;
