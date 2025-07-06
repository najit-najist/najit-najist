import { ReactNode } from 'react';

import { WidgetProps } from './WidgetProps';

export interface PageProps<TData> {
  children: ReactNode;
  widgets: WidgetProps;
  data?: TData;
  showJSON?: boolean;
  showMetadata?: boolean;
  hasOutlet?: boolean;
}
