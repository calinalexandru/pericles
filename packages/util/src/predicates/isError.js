import { PLAYER_STATUS, } from '@pericles/constants';

export default function isError(status) {
  return PLAYER_STATUS.ERROR === status;
}
