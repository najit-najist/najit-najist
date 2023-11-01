const mapper: Record<string, string> = {
  'user_addresses(owner)': 'address',
};

export const expandPocketFields = <R extends Record<string, any>>(
  input: Record<string, any> & { expand?: Record<string, any> }
): R => {
  const { expand } = input;
  const result = { ...input, expand: undefined };
  const expandWithDefaults = {
    address: undefined,
    ...expand,
  };

  for (const [key, value] of Object.entries(expandWithDefaults)) {
    const finalKey = (mapper ?? {})[key] ?? key;

    (result as any)[finalKey] =
      'expand' in (value ?? {}) ? expandPocketFields(value!) : value;
  }

  return result as unknown as R;
};
