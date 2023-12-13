import { Column } from '@react-email/column';
import { Row } from '@react-email/components';
import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

import { PaperColumn } from './PaperColumn';

export const PaperCenteredRow: FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  return (
    <Row>
      <Column className="w-1 sm:w-auto" />
      <PaperColumn className={clsx('sm:w-[450px] w-full', className)}>
        {children}
      </PaperColumn>
      <Column className="w-1 sm:w-auto" />
    </Row>
  );
};
