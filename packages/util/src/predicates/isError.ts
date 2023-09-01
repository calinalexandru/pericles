import { PLAYER_STATUS, } from '@pericles/constants';

export default function isError(status: number): boolean {
  return PLAYER_STATUS.ERROR === status;
}
