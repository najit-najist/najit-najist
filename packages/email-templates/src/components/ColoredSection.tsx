import { Column, Row } from '@react-email/components';
import { Section } from '@react-email/section';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function ColoredSection({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <Section className={clsx('rounded-md bg-gray-50', className)}>
      {children}
    </Section>
  );
}

ColoredSection.Row = Row;
ColoredSection.Column = Column;
