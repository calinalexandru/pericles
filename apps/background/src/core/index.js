import controller from './controller';
import speech from './speech';
import voices from './voices';

export default async () => {
  speech();
  controller();
  await voices();
};
