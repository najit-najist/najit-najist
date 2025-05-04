import { MedusaService } from '@medusajs/framework/utils';

import { NewsletterSubscription } from './models/newsletter-subscription';

export class NewsletterService extends MedusaService({
  NewsletterSubscription,
}) {}
