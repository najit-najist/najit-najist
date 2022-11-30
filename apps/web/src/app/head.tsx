import { FC, PropsWithChildren } from 'react';

const Head: FC<PropsWithChildren> = () => {
  return (
    <head>
      <meta charSet="utf-8" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <meta name="viewport" content="width=device-width" />
      <link rel="stylesheet" href="https://use.typekit.net/pct3thf.css" />
      <title>Najít Najíst</title>
    </head>
  );
};

export default Head;
