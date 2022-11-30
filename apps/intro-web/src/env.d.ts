/// <reference types="@astrojs/image/client" />

interface Window {
  dataLayer: any[];
  expandGtag(type: 'js', date: Date): void;
  expandGtag(type: 'config', id: string): void;
}
