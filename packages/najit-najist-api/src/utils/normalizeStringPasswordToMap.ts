type passwordsMap = { [id: string]: string };
type password = string | passwordsMap;
export function normalizeStringPasswordToMap(password: password) {
  return typeof password === 'string' ? { 1: password } : password;
}
