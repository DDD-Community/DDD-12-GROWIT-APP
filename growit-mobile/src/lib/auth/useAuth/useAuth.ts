import { useState, useEffect, useCallback } from 'react';
import { tokenStorage, type Tokens, type UserInfo } from './tokenStorage';
import { tokenUtils } from './tokenUtils';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
  tokens: Tokens | null;
}

export interface AuthActions {
  login: (tokens: Tokens, user: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    tokens: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const [tokens, user] = await Promise.all([
          tokenStorage.getTokens(),
          tokenStorage.getUserInfo(),
        ]);

        if (tokens && !tokenUtils.isTokenExpired(tokens.accessToken)) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            user,
            tokens,
          });
        } else {
          await tokenStorage.clearAll();
          setState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            tokens: null,
          });
        }
      } catch {
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          tokens: null,
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (tokens: Tokens, user: UserInfo) => {
    await Promise.all([
      tokenStorage.saveTokens(tokens),
      tokenStorage.saveUserInfo(user),
    ]);
    setState({
      isLoading: false,
      isAuthenticated: true,
      user,
      tokens,
    });
  }, []);

  const logout = useCallback(async () => {
    await tokenStorage.clearAll();
    setState({
      isLoading: false,
      isAuthenticated: false,
      user: null,
      tokens: null,
    });
  }, []);

  const refreshAuth = useCallback(async () => {
    const [tokens, user] = await Promise.all([
      tokenStorage.getTokens(),
      tokenStorage.getUserInfo(),
    ]);
    setState((prev) => ({
      ...prev,
      tokens,
      user,
      isAuthenticated: tokens !== null,
    }));
  }, []);

  return {
    ...state,
    login,
    logout,
    refreshAuth,
  };
};
