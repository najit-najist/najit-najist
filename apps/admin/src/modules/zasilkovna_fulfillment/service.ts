import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { FulfillmentOption, Logger } from "@medusajs/framework/types"

type InjectedDependencies = {
  logger: Logger
}

type Options = {
  apiKey: string
}


export class ZasilkovnaFulfilmentProviderService extends AbstractFulfillmentProviderService {
  static identifier = "zasilkovna-fulfillment"

  protected logger_: Logger
   protected options_: Options
   // assuming you're initializing a client
   protected client

   constructor(
     { logger }: InjectedDependencies,
     options: Options
   ) {
     super()

     this.logger_ = logger
     this.options_ = options

     // TODO initialize your client
   }


  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
     return [
       {
         id: "Výdejní Místo",
       },
       {
         id: "Z-Box",
       },
       {
         id: "Na Adresu",
       },
     ]
  }


}

export default ZasilkovnaFulfilmentProviderService
