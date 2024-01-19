import { cx } from 'class-variance-authority';
import HTMLReactParser from 'html-react-parser';
import { FC, PropsWithChildren } from 'react';

export interface ListBlockData {
  style: 'ordered' | 'unordered';
  items: NestedListItem[];
}

export type NestedListItem =
  | {
      content: string;
      items: NestedListItem[];
    }
  | string;

const Bullet: FC<PropsWithChildren> = ({ children }) => <li>{children}</li>;

const Group: FC<{
  Tag: keyof JSX.IntrinsicElements;
  items: NestedListItem[];
  className?: string;
}> = ({ Tag, items, ...props }) => (
  <Tag {...props}>
    {items
      .filter(
        (item) => !!(typeof item === 'string' ? item : item.content).length
      )
      .map((item, i) => (
        <Bullet key={i}>
          {typeof item === 'string' ? (
            HTMLReactParser.default(item)
          ) : (
            <>
              {HTMLReactParser.default(item?.content)}
              {item?.items?.length > 0 && (
                <Group Tag={Tag} items={item.items} {...props} />
              )}
            </>
          )}
        </Bullet>
      ))}
  </Tag>
);

export const ListRenderer: FC<{ data: ListBlockData }> = ({ data }) => {
  const isOrdered = data?.style === 'ordered';
  const Tag = (isOrdered ? `ol` : `ul`) as keyof JSX.IntrinsicElements;

  return (
    data && (
      <Group
        Tag={Tag}
        items={data.items}
        className={cx([isOrdered ? 'list-decimal' : 'list-disc', 'mb-5'])}
      />
    )
  );
};
