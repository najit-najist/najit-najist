import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

import bakeryImage from '/public/images/pages/main-page/bakery.jpg';
import eventsImage from '/public/images/pages/main-page/events.jpg';
import shoppingImage from '/public/images/pages/main-page/shopping.jpg';
import waitressImage from '/public/images/pages/main-page/waitress.jpg';

type Item = {
  title: string;
  href: string;
  imageSrc: StaticImageData;
};

const items: Item[] = [
  { title: 'Obchody', href: '/', imageSrc: shoppingImage },
  { title: 'Restaurace', href: '/', imageSrc: waitressImage },
  { title: 'Akce', href: '/', imageSrc: eventsImage },
  { title: 'Naše pekárny', href: '/', imageSrc: bakeryImage },
];

const LinkItem: FC<Item> = ({ href, imageSrc, title }) => (
  <a
    href={href}
    className="w-full aspect-[3/2.5] sm:aspect-[3/3.5] sm:w-[calc(50%-1.25rem)] hover:scale-[1.02] duration-100 hover:shadow-2xl lg:w-full"
  >
    <div className="rounded-xl overflow-hidden relative w-full h-full hover:ring-2 ring-deep-green-300">
      <Image
        className="absolute top-0 left-0 w-full h-full object-cover content-center"
        src={imageSrc}
        alt={`Obrázek pro ${title}`}
      />
      <div className="absolute inset-0 from-transparent to-black bg-gradient-to-b opacity-70" />
      <div className="absolute inset-0 bg-[#ffcccc] opacity-20" />
      <p className="absolute left-0 bottom-0 ml-5 mb-5 xl:ml-12 xl:mb-12 text-4xl text-white font-suez">
        {title}
      </p>
    </div>
  </a>
);

export const QuickLinks: FC = () => {
  return (
    <section className="container w-full mx-auto flex-wrap lg:flex-nowrap flex gap-5 -mt-32">
      {items.map((data) => (
        <LinkItem key={data.title} {...data} />
      ))}
    </section>
  );
};
