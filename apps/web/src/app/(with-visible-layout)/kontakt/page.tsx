import { FC } from 'react';

import ondrejLangrUrl from '/public/images/team/ondrej-langr.jpg';
import arnostZizkaUrl from '/public/images/team/arnost-zizka.jpg';
import martinStaryUrl from '/public/images/team/martin-stary.jpg';
import terezaZizkovaUrl from '/public/images/team/tereza-zizkova.jpg';
import vojtechZizkaUrl from '/public/images/team/vojtech-zizka.jpg';
import lenkaCernouskovaUrl from '/public/images/team/lenka-cernouskova.jpg';
import kristynaZizkovaUrl from '/public/images/team/kristyna-zizkova.jpg';
import { imagePosition, UserHead } from './components/UserHead';
import { StaticImageData } from 'next/image';

const teamMembers: {
  name: string;
  title: string;
  imageUrl: StaticImageData;
  imagePosition?: imagePosition;
}[] = [
  {
    name: 'Martin Starý',
    title: 'Marketing',
    imageUrl: martinStaryUrl,
  },
  {
    name: 'Ondřej Langr',
    title: 'Programátor',
    imageUrl: ondrejLangrUrl,
  },
  {
    name: 'Arnošt Žižka',
    title: 'Jednatel',
    imageUrl: arnostZizkaUrl,
  },
  {
    name: 'Tereza Žižková',
    title: 'Grafik',
    imageUrl: terezaZizkovaUrl,
  },
  {
    name: 'Vojtěch Žižka',
    title: 'Grafik',
    imageUrl: vojtechZizkaUrl,
  },
  {
    name: 'Lenka Černoušková',
    title: 'Finance',
    imageUrl: lenkaCernouskovaUrl,
    imagePosition: 'center',
  },
  {
    name: 'Kristýna Žižková',
    title: 'Prodejna Fénix',
    imageUrl: kristynaZizkovaUrl,
    imagePosition: 'center',
  },
];

const ContactPage: FC = () => {
  return (
    <div className="px-4 my-20" id="nas-team">
      <div className="mx-auto text-center">
        <h2 className="text-5xl font-bold mt-10 mb-7">Náš tým</h2>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5">
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
  );
};

export default ContactPage;
