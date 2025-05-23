'use client';

import { ButtonProps } from '@components/common/Button';
import { Button } from '@headlessui/react';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { usePlausible } from '@hooks/usePlausible';
import { Recipe } from '@najit-najist/database/models';
import { trpc } from '@trpc/web';
import clsx from 'clsx';
import { FC } from 'react';

const CustomButton: FC<
  Omit<ButtonProps, 'color' | 'appearance' | 'ref' | 'icon'> & {
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
    className={clsx(
      'group p-1.5 pb-2.5 rounded-project bg-white shadow-sm cursor-pointer',
      className,
    )}
    {...rest}
  >
    <div
      className={clsx(
        'w-6 h-6 relative -mb-1 group-active:scale-75 duration-500',
        isSubmitting ? 'animate-bounce-z' : '',
      )}
    >
      <IconComponent
        className={clsx(
          'w-full h-full duration-100',
          isActive ? '' : 'group-hover:opacity-40 opacity-0',
        )}
      />
      <OutlinedIconComponent
        className={clsx(
          'w-full h-full absolute top-0 left-0 group-hover:animate-ping group-hover:repeat-1',
          isActive ? 'hidden' : '',
        )}
      />
      <OutlinedIconComponent
        className={clsx(
          'w-full h-full absolute top-0 left-0',
          isActive ? 'hidden' : '',
        )}
      />
    </div>
  </Button>
);

export const UserListActions: FC<{ recipeId: Recipe['id'] }> = ({
  recipeId,
}) => {
  const { trackEvent } = usePlausible();
  const {
    data: likedRecipeInfo,
    refetch,
    isRefetching,
  } = trpc.profile.liked.recipes.has.useQuery(
    { id: recipeId },
    {
      suspense: true,
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );
  const { mutateAsync: likeRecipe, isPending: isLoading } =
    trpc.profile.liked.recipes.add.useMutation({
      async onSuccess() {
        await refetch();
        trackEvent('Like recipe', {
          props: { entityId: String(recipeId) },
        });
      },
    });
  const { mutateAsync: dislikeRecipe } =
    trpc.profile.liked.recipes.remove.useMutation({
      async onSuccess() {
        await refetch();
        trackEvent('Dislike recipe', {
          props: { entityId: String(recipeId) },
        });
      },
    });

  const onHeartClickHandler = async () => {
    if (likedRecipeInfo) {
      await dislikeRecipe({ id: recipeId });
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
