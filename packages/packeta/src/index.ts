import { PacketaPoint } from './PacketaPoint';

declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick(
          apiKey: string,
          callback: (point: PacketaPoint | null) => void,
          options?: { language?: 'cs' | 'en' }
        ): void;
      };
    };
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PACKETA_KEY?: string;
      PACKETA_SECRET?: string;
    }
  }
}

export * from './errors/PacketaValidationFailed';

export * from './getPacketaScriptUrl';
export * from './PacketaAllowTrackingForUsers';
export * from './PacketaAttribute';
export * from './PacketaCurrency';
export * from './PacketaCurrentStatusRecord';
export * from './PacketaExceptionDay';
export * from './PacketaGpsCoordinates';
export * from './PacketaPacketAttributes';
export * from './PacketaPacketPDFLabelFormat';
export * from './PacketaPacketSize';
export * from './PacketaPacketStatusCode';
export * from './PacketaPhoto';
export * from './PacketaPickupPointType';
export * from './PacketaPoint';
export * from './PacketaPointError';
export * from './PacketaPointHours';
export * from './PacketaPointRecommendedState';
export * from './PacketaPointWarning';
export * from './PacketaSecurity';
export * from './PacketaTime';
export * from './PacketaWeekHours';
export * from './validatePoint';
