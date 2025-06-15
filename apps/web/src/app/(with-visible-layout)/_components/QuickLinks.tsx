import { Badge } from '@components/common/Badge';
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
  enabled?: boolean;
  isNew?: boolean;
};

const items: Item[] = [
  {
    title: 'E-Shop',
    href: '/produkty',
    imageSrc: shoppingImage,
    enabled: true,
    isNew: true,
  },
  { title: 'Restaurace', href: '/', imageSrc: waitressImage },
  { title: 'Akce', href: '/', imageSrc: eventsImage },
];

const LinkItem: FC<Item> = ({ href, imageSrc, title, enabled, isNew }) => (
  <a
    href={href}
    className="w-full aspect-[2/0.6] sm:aspect-[3/1.5] duration-100 --hover:shadow-2xl lg:w-full relative group"
  >
    <div className="rounded-project overflow-hidden relative w-full h-full ring-project-primary">
      <Image
        className="absolute top-0 left-0 w-full h-full object-cover object-top group-hover:scale-105 duration-200"
        src={imageSrc}
        alt={`Obrázek pro ${title}`}
      />
      <div className="absolute inset-0 from-transparent to-black bg-gradient-to-b opacity-70" />
      <div className="absolute inset-0 bg-[#ffcccc] opacity-20" />
      <p className="absolute left-0 bottom-0 ml-5 mb-5 xl:ml-8 xl:mb-10 text-4xl text-white font-title">
        {title}
      </p>
    </div>
    {isNew ? (
      <Badge className="m-3 absolute top-0 right-0" size="lg" color="green">
        Nový
      </Badge>
    ) : null}
    {!enabled ? (
      <div className="absolute top-0 inset-0 backdrop-blur-sm flex items-center justify-center font-bold text-xl lg:text-4xl uppercase text-red-500 rounded-project overflow-hidden">
        Již brzy
      </div>
    ) : null}
  </a>
);

export const QuickLinks: FC = () => {
  return (
    <section className="container w-full mx-auto -mt-20 sm:-mt-20 lg:-mt-32">
      <div className="relative w-full flex-wrap sm:flex-nowrap flex gap-3 sm:gap-5">
        {items.map((data) => (
          <LinkItem key={data.title} {...data} />
        ))}
      </div>
    </section>
  );
};
