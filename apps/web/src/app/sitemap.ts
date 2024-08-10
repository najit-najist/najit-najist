import { dayjs } from '@dayjs';
import { database } from '@najit-najist/database';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = 'https://najitnajist.cz';
  const todayAsString = dayjs().format('YYYY-MM-DD');

  return (
    [
      {
        url: '/',
        lastModified: todayAsString,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: '/login',
        lastModified: todayAsString,
        changeFrequency: 'weekly',
        priority: 0.1,
      },
      {
        url: '/registrace',
        lastModified: todayAsString,
        changeFrequency: 'weekly',
        priority: 0.1,
      },
      {
        url: '/kontakt',
        lastModified: todayAsString,
        changeFrequency: 'weekly',
        priority: 0.1,
      },
      {
        url: '/produkty',
        lastModified: todayAsString,
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      (
        await database.query.products.findMany({
          where: (schema, { isNotNull }) => isNotNull(schema.publishedAt),
        })
      ).map((product) => ({
        url: `/produkty/${encodeURIComponent(product.slug)}`,
        lastModified: dayjs(product.updatedAt).format('YYYY-MM-DD'),
        changeFrequency: 'monthly',
        priority: 0.5,
      })),
    ] as MetadataRoute.Sitemap
  ).map((option) => ({
    ...option,
    url: new URL(option.url, origin).toString(),
  }));
}
