import { cva } from 'class-variance-authority';
import HTMLReactParser from 'html-react-parser';
import { FC } from 'react';

export interface HeaderBlockData {
  text: string;
  level: number;
}

type AvailableLevel = (typeof AVAILABLE_LEVELS)[number];
export const AVAILABLE_LEVELS = [2, 3, 4] as const;
export const DEFAULT_LEVEL = AVAILABLE_LEVELS[0];

const styles = cva('font-semibold mb-5 mt-10 font-suez', {
  variants: {
    level: {
      2: 'text-5xl',
      3: 'text-3xl',
      4: 'text-xl',
    },
  },
  defaultVariants: {
    level: DEFAULT_LEVEL,
  },
});

export const HeaderRenderer: FC<{ data: HeaderBlockData }> = ({ data }) => {
  const level = (data?.level || DEFAULT_LEVEL) as AvailableLevel;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={styles({ level })}>
      {data?.text && HTMLReactParser(data.text)}
    </Tag>
  );
};
