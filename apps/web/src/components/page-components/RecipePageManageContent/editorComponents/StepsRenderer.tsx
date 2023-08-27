import { ClockIcon } from '@heroicons/react/24/outline';
import { Recipe } from '@najit-najist/api';
import HTMLReactParser from 'html-react-parser';
import { FC } from 'react';

export const StepsRenderer: FC<Pick<Recipe, 'steps'>> = ({ steps }) => {
  return (
    <ul className="list-inside grid gap-4">
      {steps.length
        ? steps.map(({ parts, title }) => (
            <li key={title}>
              {steps.length > 1 ? (
                <h4 className="text-xl font-semibold mb-2">
                  <span className="text-green-400">{title}</span>
                </h4>
              ) : null}
              <ul className="space-y-5 list-decimal pl-5">
                {parts.map(({ content, duration }, key) => (
                  <li key={key}>
                    <div className="flex gap-5">
                      <div className="w-full">{HTMLReactParser(content)}</div>
                      <span className="flex-none text-deep-green-300">
                        <ClockIcon className="w-5 h-5 inline-block -mt-1 mr-1" />{' '}
                        <b>{duration}</b> minut
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))
        : null}
    </ul>
  );
};
