import { PLAYER_STATUS, } from '@pericles/constants';

export default function isOverloaded(status) {
  return PLAYER_STATUS.OVERLOAD === status;
}
