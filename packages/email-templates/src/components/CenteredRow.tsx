import { Column, Row } from '@react-email/components';
import { FC, PropsWithChildren } from 'react';

export const CenteredRow: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <Row>
      <Column className="w-auto px-0.5" />
      <Column width={450} className={className}>
        {children}
      </Column>
      <Column className="w-auto px-0.5" />
    </Row>
  );
};
