import zxcvbn from 'zxcvbn';

export enum PasswordStrength {
  BAD = 'bad',
  NORMAL = 'normal',
  GOOD = 'good',
  BEST = 'best',
}

const getScore = (input: zxcvbn.ZXCVBNScore): PasswordStrength => {
  let result = PasswordStrength.BAD;

  switch (input) {
    case 4:
      result = PasswordStrength.BEST;
      break;
    case 3:
      result = PasswordStrength.GOOD;
      break;
    case 2:
      result = PasswordStrength.NORMAL;
      break;
    default:
      break;
  }

  return result;
};

export const getPasswordStrength = (password: string) => {
  const result = zxcvbn(password);

  return {
    ...result,
    score: getScore(result.score),
  };
};
