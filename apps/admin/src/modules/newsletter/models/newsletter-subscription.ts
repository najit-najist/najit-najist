import { model } from '@medusajs/framework/utils';

export const NewsletterSubscription = model.define('newsletter_subscription', {
  id: model.id().primaryKey(),
  email: model.text().unique(),
  subscribed: model.boolean().default(true),
});
