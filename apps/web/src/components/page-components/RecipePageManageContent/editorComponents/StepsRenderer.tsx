import { Recipe } from '@najit-najist/api';
import HTMLReactParser from 'html-react-parser';
import { FC } from 'react';

export const StepsRenderer: FC<Pick<Recipe, 'steps'>> = ({ steps }) => {
  return (
    <ul className="list-decimal">
      {steps.length
        ? steps.map(({ parts, title }) => (
            <li className="ml-5" key={title}>
              <h4 className="text-xl font-semibold">
                <span className="text-green-400">{title}</span>
              </h4>
              <ul className="list ml-3 space-y-5">
                {parts.map(({ content, duration }) => (
                  <li className="flex gap-5 border-l-4 border-deep-green-400 pl-5">
                    <div className="w-full">{HTMLReactParser(content)}</div>
                    <span className="flex-none">{duration} minut</span>
                  </li>
                ))}
              </ul>
            </li>
          ))
        : null}
    </ul>
  );
};
