import {
  RecipeResource,
  RecipeResourceMetric,
} from '@najit-najist/database/models';
import { FC } from 'react';

export const ResourcesRenderer: FC<{
  metrics: RecipeResourceMetric[];
  resources: RecipeResource[];
}> = ({ resources, metrics }) => {
  const metricsMap = new Map(metrics.map((item) => [item.id, item]));

  return (
    <ul className="list-decimal pl-5 text-lg marker:text-project-accent">
      {resources.map(({ title, description, count, optional, metricId }) => (
        <li key={title}>
          <>
            {title}
            {count ? (
              <>
                - {count} {metricsMap.get(metricId)?.name}
              </>
            ) : null}
          </>
        </li>
      ))}
    </ul>
  );
};
