import { ATTRIBUTES, } from '@pericles/constants';

export default function getPremiumVoiceId(voice: number): number {
  return voice - ATTRIBUTES.MISC.AZURE_ID_DECAL;
}
