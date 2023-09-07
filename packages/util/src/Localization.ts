import { MESSAGES, } from '@pericles/constants';

export const t = (str: TemplateStringsArray | string): string => {
  let realKey: string = '';
  if (Array.isArray(str) && str[0]) {
    [ realKey as string, ] = str;
  } else {
    realKey = str as string;
  }

  const findTranslationKey: string | undefined = Object.keys(MESSAGES.en).find(
    (val: string) => val === realKey
  );

  if (findTranslationKey !== undefined) return (MESSAGES.en as any)?.[realKey];
  return realKey;
};
