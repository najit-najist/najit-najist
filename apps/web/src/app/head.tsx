import { FC, PropsWithChildren } from 'react';

const Head: FC<PropsWithChildren> = () => {
  return (
    <>
      <meta charSet="utf-8" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
        // @ts-ignore
        precedence="default"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
        // @ts-ignore
        precedence="default"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
        // @ts-ignore
        precedence="default"
      />
      <meta name="viewport" content="width=device-width" />
      <link
        rel="stylesheet"
        href="https://use.typekit.net/pct3thf.css"
        // @ts-ignore
        precedence="default"
      />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        // @ts-ignore
        precedence="default"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        // @ts-ignore
        precedence="default"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Suez+One&display=swap"
        rel="stylesheet"
        // @ts-ignore
        precedence="default"
      />
      <title>Najít Najíst</title>
    </>
  );
};

export default Head;
