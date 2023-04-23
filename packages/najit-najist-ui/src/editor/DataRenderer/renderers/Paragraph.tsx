import HTMLReactParser from 'html-react-parser';
import { FC } from 'react';

export interface ParagraphBlockData {
  text: string;
}

export const ParagraphRenderer: FC<{ data: ParagraphBlockData }> = ({
  data,
}) => {
  return (
    <p className="text-md text-gray-700 mb-5">
      {data?.text && HTMLReactParser(data.text)}
    </p>
  );
};
