import { dayjs } from '@dayjs';
import { database } from '@najit-najist/database';
import type { MetadataRoute } from 'next';
import { cookies } from 'next/headers';

const { BUILD_TIMESTAMP } = process.env;
const buildTimestamp = BUILD_TIMESTAMP ? Number(BUILD_TIMESTAMP) : undefined;

const todayAsString = dayjs(buildTimestamp).toDate();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = 'https://najitnajist.cz';
  // To make this file build when production started
  cookies();

  return (
    [
      {
        url: '/',
        lastModified: todayAsString,
        changeFrequency: 'weekly',
        priority: 1,
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
      {
        url: '/clanky',
        lastModified: todayAsString,
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      ...(
        await database.query.products.findMany({
          where: (schema, { isNotNull }) => isNotNull(schema.publishedAt),
        })
      ).map((product) => ({
        url: `/produkty/${encodeURIComponent(product.slug)}`,
        lastModified: dayjs(product.updatedAt ?? product.publishedAt).toDate(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
      ...(
        await database.query.posts.findMany({
          where: (schema, { isNotNull }) => isNotNull(schema.publishedAt),
        })
      ).map((post) => ({
        url: `/clanky/${encodeURIComponent(post.slug)}`,
        lastModified: dayjs(post.updatedAt ?? post.publishedAt).toDate(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
    ] as MetadataRoute.Sitemap
  ).map((option) => ({
    ...option,
    url: new URL(option.url, origin).toString(),
  }));
}
