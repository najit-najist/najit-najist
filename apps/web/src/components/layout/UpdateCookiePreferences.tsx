'use client';

import { useCookieBannerVisibility } from '@components/common/CookieBanner/cookieBannerVisibilityStore';
import { useCallback } from 'react';

export const UpdateCookiePreferences = () => {
  const toggle = useCookieBannerVisibility((state) => state.toggle);
  const onClickHandle = useCallback(() => toggle(), [toggle]);

  return (
    <a
      onClick={onClickHandle}
      className="text-base text-gray-500 hover:text-gray-900 cursor-pointer hover:underline block"
    >
      Upravit preference cookies
    </a>
  );
};
