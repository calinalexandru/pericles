import { ATTRIBUTES, } from '@pericles/constants';

export default function setPremiumVoiceId(voice) {
  return voice + ATTRIBUTES.MISC.AZURE_ID_DECAL;
}
