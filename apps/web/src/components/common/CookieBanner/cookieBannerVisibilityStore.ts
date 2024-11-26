import { create } from 'zustand';

type CookieBannerVisibility = {
  visible: boolean;
  toggle(nextValue?: boolean): void;
};

export const useCookieBannerVisibility = create<CookieBannerVisibility>(
  (set, get) => ({
    visible: false,
    toggle(nextValue?: boolean) {
      set({
        visible: nextValue ?? !get().visible,
      });
    },
  }),
);
