import { Epic, } from 'redux-observable';
import { merge, } from 'rxjs';

export default function combineAnyEpics(
  ...epics: Epic<any, any, any, any>[]
): Epic<any, any, any, any> {
  return (...args) => merge(...epics.map((epic) => epic(...args)));
}
