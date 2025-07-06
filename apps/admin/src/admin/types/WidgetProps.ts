import { ComponentType } from 'react';

export interface WidgetProps {
  before: ComponentType<any>[];
  after: ComponentType<any>[];
}
