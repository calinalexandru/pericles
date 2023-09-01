import { ATTRIBUTES, } from '@pericles/constants';

export default function setPremiumVoiceId(voice: number): number {
  return voice + ATTRIBUTES.MISC.AZURE_ID_DECAL;
}
