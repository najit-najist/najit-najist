import { Recipe, RecipeResourceMetric } from '@najit-najist/api';
import { FC } from 'react';

export const ResourcesRenderer: FC<
  Pick<Recipe, 'resources'> & { metrics: RecipeResourceMetric[] }
> = ({ resources, metrics }) => {
  const metricsMap = new Map(metrics.map((item) => [item.id, item]));

  return (
    <ul className="list-decimal pl-5 text-lg">
      {resources.map(({ title, description, count, isOptional, metric }) => (
        <li key={title}>
          <>
            {title} - {count} {metricsMap.get(metric)?.name}
          </>
        </li>
      ))}
    </ul>
  );
};
