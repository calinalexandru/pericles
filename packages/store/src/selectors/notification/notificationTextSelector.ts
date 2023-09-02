import { createSelector, } from 'reselect';

import { RootState, } from '../../initialState';

import notificationSelector from './notificationSelector';

export default createSelector(
  notificationSelector,
  (notification) => notification.text
) as (state: RootState) => string;
