import { ATTRIBUTES, } from '@pericles/constants';

export default function isPremiumVoice(voice: number): boolean {
  return voice >= ATTRIBUTES.MISC.AZURE_ID_DECAL;
}
