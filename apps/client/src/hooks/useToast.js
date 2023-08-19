import { useCallback, } from 'react';
import { useDispatch, } from 'react-redux';

import { notificationActions, } from '@pericles/store';

const { notification, } = notificationActions;
export default function useToast() {
  const dispatch = useDispatch();

  const setInfoToast = useCallback((text) => {
    dispatch(notification.info({ text, }));
  }, []);

  const setErrorToast = useCallback((text) => {
    dispatch(notification.error({ text, }));
  }, []);

  const setSuccessToast = useCallback((text) => {
    dispatch(notification.success({ text, }));
  }, []);

  const setWarningToast = useCallback((text) => {
    dispatch(notification.warning({ text, }));
  }, []);

  const clear = useCallback((text) => {
    dispatch(notification.clear({ text, }));
  }, []);

  return {
    setInfoToast,
    setErrorToast,
    setSuccessToast,
    setWarningToast,
    clear,
  };
}
