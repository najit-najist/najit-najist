import { CouponPageContent } from '@components/page-components/CouponPageContent';
import { database } from '@najit-najist/database';
import { notFound } from 'next/navigation';

type Params = { params: Promise<{ couponId: string }> };

export default async function Page({ params }: Params) {
  const { couponId } = await params;
  const coupon = await database.query.coupons.findFirst({
    where: (s, { eq }) => eq(s.id, Number(couponId)),
    with: {
      patches: {
        orderBy: (s, { desc }) => desc(s.createdAt),
        with: {
          orders: true,
        },
      },
      onlyForProductCategories: {
        with: {
          category: true,
        },
      },
      onlyForProducts: {
        with: {
          product: {
            with: {
              category: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!coupon) {
    notFound();
  }

  return <CouponPageContent initialCoupon={coupon} />;
}
