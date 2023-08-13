import { redirect } from 'next/navigation';

export const metadata = {
  title: 'GDPR',
};

export default function Page() {
  redirect('/documents/gdpr.pdf');
}
