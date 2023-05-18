export const isBase64 = (input: string): boolean => {
  if (input === '' || input.trim() === '') {
    return false;
  }
  try {
    return btoa(atob(input)) == input;
  } catch (err) {
    return false;
  }
};
