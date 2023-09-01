import { PLAYER_STATUS, } from '@pericles/constants';

export default function isOverloaded(status: number): boolean {
  return PLAYER_STATUS.OVERLOAD === status;
}
