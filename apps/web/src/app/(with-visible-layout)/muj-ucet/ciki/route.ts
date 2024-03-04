import { Comgate } from '@najit-najist/api/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const comgatePayment = await Comgate.createPayment({
    order: {
      delivery_method_price: 100,
      email: 'hi@ondrejlangr.cz',
      id: '1232',
      payment_method_price: 200,
      subtotal: 400,
    },
  });

  console.log({ comgatePayment });

  return new NextResponse();
};
