import React, { createContext, FC, useCallback, useContext, useEffect } from 'react';
import { LINKS } from 'config/constants';
// store
import { currentUserMetaSelector, currentUserSelector, UserActions } from '@pma/store';

// config
import User from 'config/entities/User';

// hooks
import useDispatch from 'hooks/useDispatch';
import { useSelector } from 'react-redux';

type LoginAction = (payload: { email: string; password: string }) => void;
type LogoutAction = () => void;

type AuthData = {
  authenticated: boolean;
  user?: User;
  accessToken?: string;
  login: LoginAction;
  logout: LogoutAction;
  roles: Array<string>;
  userWorkLevel: Array<string>;
  error: any;
};

const defaultData = {
  authenticated: false, // to check if authenticated or not
  login: () => undefined, // to start the login process
  logout: () => undefined, // logout the user
  roles: [],
  error: null,
  userWorkLevel: [],
};

const AuthContext = createContext<AuthData>(defaultData);

export const AuthProvider: FC = ({ children }) => {
  const { info, authenticated } = useSelector(currentUserSelector) || {};
  const { loaded, error } = useSelector(currentUserMetaSelector) || {};

  const dispatch = useDispatch();

  useEffect(() => {
    if (!loaded) dispatch(UserActions.getCurrentUser());
  }, [loaded]);

  const loginAction: LoginAction = useCallback((payload) => dispatch(UserActions.login(payload)), []);

  const logoutAction: LogoutAction = useCallback(() => dispatch(UserActions.logout()), []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        error,
        user: info,
        login: loginAction,
        logout: logoutAction,
        roles: info?.data?.roles || [],
        userWorkLevel: info?.data?.colleague?.workRelationships?.[0]?.workLevel || [],
      }}
    >
      {loaded ? children : null}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
export const useAuthContainer = () => useContext(AuthContext);

export default AuthContext;
