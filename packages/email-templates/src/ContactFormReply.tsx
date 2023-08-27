import { Layout } from './components/Layout';

export interface ContactFormReplyProps {
  fullName: string;
  message: string;
  telephone?: string;
  email: string;
}

export default function ContactFormReply({
  email,
  fullName,
  message,
  telephone,
}: ContactFormReplyProps) {
  const title = 'Nový kontakt v kontaktním formuláři';

  return (
    <Layout title={title}>
      <p>Zpráva od: {fullName}</p>
      <p>
        <b>Obsah zprávy:</b> {message}{' '}
      </p>

      <br />

      {telephone ? <>Telefon: +420 {telephone} </> : null}

      <a href={`mailto:${email}`}>Odpovědět na uvedený email: {email}</a>
    </Layout>
  );
}
