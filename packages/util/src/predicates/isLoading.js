import { PLAYER_STATUS, } from '@pericles/constants';

export default function isLoading(status) {
  return PLAYER_STATUS.LOADING === status;
}
