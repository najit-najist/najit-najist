import { Column, Row } from '@react-email/components';
import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

export const CenteredRow: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <Row>
      <Column className="w-1 sm:w-auto" />
      <Column className={clsx('sm:w-[450px] w-full', className)}>
        {children}
      </Column>
      <Column className="w-1 sm:w-auto" />
    </Row>
  );
};
