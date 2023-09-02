import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import notificationSelector from './notificationSelector';

export default createSelector(
  notificationSelector,
  (notification) => notification.type
) as (state: RootState) => string;
