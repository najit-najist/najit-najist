import { loadEnv, defineConfig } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

const appOrigin = process.env.APP_ORIGIN ?? 'https://najitnajist.cz';

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  admin: { path: '/administration', storefrontUrl: appOrigin },
  modules: [
    {
      resolve: './src/modules/blog',
    },
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            resolve: './src/modules/comgate-payment',
            id: 'comgate-payment',
            options: {
              secret: process.env.COMGATE_SECRET ?? '',
              merchantId: process.env.COMGATE_MERCHANT_ID ?? '',
              siteOrigin: appOrigin,
            },
          },
        ],
      },
    },
    {
      resolve: './src/modules/cooking',
    },
    {
         resolve: "@medusajs/medusa/fulfillment",
         options: {
           providers: [
             {
                        resolve: "@medusajs/medusa/fulfillment-manual",
                        id: "manual",
                      },

             {
               resolve: "./src/modules/zasilkovna_fulfillment",
               id: "zasilkovna-fulfillment",
               options: {
                 // provider options...
               },
             },
           ],
         },
       },
    {
      resolve: './src/modules/extended_store',
      definition: {
        isQueryable: true,
      },
    },
    {
      resolve: './src/modules/metric',
    },
    {
      resolve: './src/modules/newsletter',
    },
  ],
});
