import controller from './controller';
import speech from './speech';
import storage from './storage';
import voices from './voices';

export default async () => {
  speech();
  controller();
  await voices();
  await storage();
};
