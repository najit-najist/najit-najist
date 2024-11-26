import { useQuery } from '@tanstack/react-query';

export const useUserCartQueryKey = ['user-cart-items'] as const;

export const useUserCart = () =>
  useQuery({
    enabled: typeof window !== 'undefined',
    queryKey: useUserCartQueryKey,
    async queryFn({ signal }) {
      const response = await fetch('/api/muj-ucet/kosik', {
        credentials: 'same-origin',
        method: 'GET',
        signal,
      });

      if (!response.ok || response.status !== 200) {
        throw new Error(
          'Uživatel není přihlášen nebo se stala jiná neočekávaná chyba',
        );
      }

      return await response.json();
    },
  });
