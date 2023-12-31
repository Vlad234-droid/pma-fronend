import React, { createContext, FC, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ToastPayload } from '../config/types';
import ToastContainer from '../components/ToastContainer';

import { ToastActions, toastsSelector } from '@pma/store';

type Props = {
  addToast: (payload: ToastPayload) => void;
  checkIsToastExist: (toastId: string) => boolean;
};

const defaultData = {
  addToast: () => null,
  checkIsToastExist: () => true,
};

const ToastContext = createContext<Props>(defaultData);

const ToastProvider: FC = ({ children }) => {
  const dispatch = useDispatch();
  const toasts: ToastPayload[] = useSelector(toastsSelector);

  const addToast = useCallback((payload: ToastPayload) => dispatch(ToastActions.addToast(payload)), []);

  const checkIsToastExist = useCallback(
    (toastId) => toasts.some((toast) => toast.id === toastId),
    [JSON.stringify(toasts)],
  );

  return (
    <ToastContext.Provider value={{ addToast, checkIsToastExist }}>
      <ToastContainer items={toasts} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;
