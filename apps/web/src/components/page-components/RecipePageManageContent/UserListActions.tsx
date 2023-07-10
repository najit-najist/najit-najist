'use client';

import { BookmarkIcon, HeartIcon } from '@heroicons/react/24/solid';
import {
  HeartIcon as HeartIconOutline,
  BookmarkIcon as BookmarkIconOutline,
} from '@heroicons/react/24/outline';
import { Button, ButtonProps } from '@najit-najist/ui';
import { FC } from 'react';
import clsx from 'clsx';
import { trpc } from '@trpc';
import { Recipe } from '@najit-najist/api';

const CustomButton: FC<
  Omit<ButtonProps, 'color' | 'appearance' | 'ref'> & {
    icon: typeof HeartIcon;
    outlinedIcon: typeof HeartIconOutline;
    isSubmitting?: boolean;
    isActive?: boolean;
  }
> = ({
  icon: IconComponent,
  outlinedIcon: OutlinedIconComponent,
  className,
  isSubmitting,
  isActive,
  ...rest
}) => (
  <Button
    color="noColor"
    appearance="spaceless"
    className={clsx(
      'group p-0.5 pb-0 rounded-md bg-white shadow-sm',
      className
    )}
    {...rest}
  >
    <div
      className={clsx(
        'w-8 h-8 relative -mb-1 group-active:scale-75 duration-500',
        isSubmitting ? 'animate-bounce-z' : ''
      )}
    >
      <IconComponent
        className={clsx(
          'w-full h-full duration-100',
          isActive ? '' : 'group-hover:opacity-100 opacity-0'
        )}
      />
      <OutlinedIconComponent
        className={clsx(
          'w-full h-full absolute top-0 left-0 group-hover:animate-ping group-hover:repeat-1',
          isActive ? 'hidden' : ''
        )}
      />
    </div>
  </Button>
);

export const UserListActions: FC<{ recipeId: Recipe['id'] }> = ({
  recipeId,
}) => {
  const {
    data: likedRecipeInfo,
    refetch,
    isRefetching,
  } = trpc.profile.liked.recipes.has.useQuery(recipeId);
  const { mutateAsync: likeRecipe, isLoading } =
    trpc.profile.liked.recipes.add.useMutation({
      async onSuccess() {
        await refetch();
      },
    });
  const { mutateAsync: dislikeRecipe } =
    trpc.profile.liked.recipes.remove.useMutation({
      async onSuccess() {
        await refetch();
      },
    });

  const onHeartClickHandler = async () => {
    if (likedRecipeInfo) {
      await dislikeRecipe({ itemId: recipeId });
    } else {
      await likeRecipe({ id: recipeId });
    }
  };

  return (
    <>
      {/* <CustomButton
        className="text-blue-600"
        icon={BookmarkIcon}
        outlinedIcon={BookmarkIconOutline}
      /> */}
      <CustomButton
        isActive={!!likedRecipeInfo}
        isSubmitting={isLoading || isRefetching}
        className="text-red-600"
        icon={HeartIcon}
        outlinedIcon={HeartIconOutline}
        onClick={onHeartClickHandler}
      />
    </>
  );
};
