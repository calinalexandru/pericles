import { ATTRIBUTES, } from '@pericles/constants';

export default function isPremiumVoice(voice) {
  return voice >= ATTRIBUTES.MISC.AZURE_ID_DECAL;
}
