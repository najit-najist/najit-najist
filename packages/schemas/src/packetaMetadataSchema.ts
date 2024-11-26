import { PacketaPickupPointType } from '@najit-najist/packeta';
import { PacketaPointError } from '@najit-najist/packeta';
import { z } from 'zod';

export const packetaMetadataSchema = z.object(
  {
    id: z.string(),
    pickupPointType: z.literal(PacketaPickupPointType.INTERNAL, {
      invalid_type_error: 'Tento typ odběrného místa nepodporujeme',
    }),
    error: z
      .nativeEnum(PacketaPointError)
      .nullish()
      .refine(
        (error) => !error,
        'Vybrané místo není dostupné. Vyberete prosím jiné',
      ),
    // carrierId: z.string().nullish(),
    // carrierPickupPointId: z.string().nullish(),
  },
  {
    required_error: 'Dokončete výber odběrného místa',
    invalid_type_error: 'Dokončete výber odběrného místa',
  },
);
