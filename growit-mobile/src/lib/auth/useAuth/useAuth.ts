import { useState, useEffect, useCallback } from 'react';
import { tokenStorage, type Tokens } from './tokenStorage';
import { tokenUtils } from './tokenUtils';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  tokens: Tokens | null;
}

export interface AuthActions {
  login: (tokens: Tokens) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    tokens: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const tokens = await tokenStorage.getTokens();

        if (tokens && !tokenUtils.isTokenExpired(tokens.accessToken)) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            tokens,
          });
        } else {
          await tokenStorage.clearTokens();
          setState({
            isLoading: false,
            isAuthenticated: false,
            tokens: null,
          });
        }
      } catch {
        setState({
          isLoading: false,
          isAuthenticated: false,
          tokens: null,
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (tokens: Tokens) => {
    await tokenStorage.saveTokens(tokens);
    setState({
      isLoading: false,
      isAuthenticated: true,
      tokens,
    });
  }, []);

  const logout = useCallback(async () => {
    await tokenStorage.clearTokens();
    setState({
      isLoading: false,
      isAuthenticated: false,
      tokens: null,
    });
  }, []);

  const refreshAuth = useCallback(async () => {
    const tokens = await tokenStorage.getTokens();
    setState((prev) => ({
      ...prev,
      tokens,
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
