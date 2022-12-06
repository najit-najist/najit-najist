import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

import bakeryImage from '../../../public/images/pages/main-page/bakery.jpg';
import eventsImage from '../../../public/images/pages/main-page/events.jpg';
import shoppingImage from '../../../public/images/pages/main-page/shopping.jpg';
import waitressImage from '../../../public/images/pages/main-page/waitress.jpg';

type Item = {
  title: string;
  href: string;
  imageSrc: StaticImageData;
};

const items: Item[] = [
  { title: 'Obchody', href: '', imageSrc: shoppingImage },
  { title: 'Restaurace', href: '', imageSrc: waitressImage },
  { title: 'Akce', href: '', imageSrc: eventsImage },
  { title: 'Naše pekárny', href: '', imageSrc: bakeryImage },
];

const LinkItem: FC<Item> = ({ href, imageSrc, title }) => (
  <a className="shadow-inner">
    <Image src={imageSrc} alt={`Obrázek pro ${title}`} />
    <p>{title}</p>
  </a>
);

export const ExportLinks: FC = () => {
  return (
    <section className="container">
      {items.map((data) => (
        <LinkItem key={data.title} {...data} />
      ))}
    </section>
  );
};
