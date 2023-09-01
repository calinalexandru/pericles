import { PLAYER_STATUS, } from '@pericles/constants';

export default function isLoading(status: number): boolean {
  return PLAYER_STATUS.LOADING === status;
}
