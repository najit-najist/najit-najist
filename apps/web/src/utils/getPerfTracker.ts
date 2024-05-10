export const getPerfTracker = () => {
  const perf = new Map<string, { stopped: boolean; value: number }>();
  const startValue = performance.now();

  return {
    track(name: string) {
      const value = {
        stopped: false,
        value: performance.now(),
      };
      perf.set(name, value);

      return {
        stop: () => {
          value.stopped = true;
          value.value = performance.now() - value.value;
        },
      };
    },

    summarize() {
      perf.set('__overall', {
        value: performance.now() - startValue,
        stopped: true,
      });

      const result: Record<string, number> = {};
      for (const [key, { value }] of perf) {
        result[key] = value;
      }

      return result;
    },
  };
};
