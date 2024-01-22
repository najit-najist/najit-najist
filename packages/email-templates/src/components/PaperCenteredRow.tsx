import { Column } from '@react-email/column';
import { Row } from '@react-email/components';
import { FC, PropsWithChildren } from 'react';

import { PaperColumn } from './PaperColumn';

export const PaperCenteredRow: FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  return (
    <Row>
      <Column className="w-auto px-0.5" />
      <PaperColumn width={450} className={className}>
        {children}
      </PaperColumn>
      <Column className="w-auto px-0.5" />
    </Row>
  );
};
