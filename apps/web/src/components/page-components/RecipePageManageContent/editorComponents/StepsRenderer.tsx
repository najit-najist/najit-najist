import { ClockIcon } from '@heroicons/react/24/outline';
import { RecipeStep } from '@najit-najist/database/models';
import HTMLReactParser from 'html-react-parser';
import { FC } from 'react';

export const StepsRenderer: FC<{ steps: RecipeStep[] }> = ({ steps }) => {
  return (
    <ul className="list-inside grid gap-4">
      {steps.length
        ? steps.map(({ parts, title }) => (
            <li key={title} className="sm:flex gap-5">
              {steps.length > 1 ? (
                <h4 className="text-xl font-semibold flex-none max-w-[150px] w-full">
                  <span className="text-green-400">{title}</span>
                </h4>
              ) : null}
              <ul className="space-y-5 sm:pl-5 w-full">
                {parts.map(({ content, duration }, key) => (
                  <li key={key}>
                    <div className="flex w-full gap-5">
                      <div className="text-project-accent flex-none">
                        {key + 1}.
                      </div>
                      <div className="w-full">{HTMLReactParser(content)}</div>
                      <span className="flex-none text-project-primary">
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
