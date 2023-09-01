type VoiceType = {
  text: string;
};

export default function getEnglishVoiceKey(voices: VoiceType[]): number {
  if (!voices) return 0;
  // console.log('getEnglishVoiceKey', voices);
  let index = -1;
  const testVoices = [
    'google us english',
    'aria online',
    'daniel',
    'english (america)',
    'english',
    'alex',
  ];
  for (let i = 0; i < testVoices.length; i += 1) {
    if (index === -1)
      index = voices.findIndex(
        (voice) => voice.text.toLocaleLowerCase().indexOf(testVoices[i]) !== -1
      );
    else break;
  }
  if (index < 0) index = 0;
  // console.log('getEnglishVoiceKey', index);
  return index;
}
