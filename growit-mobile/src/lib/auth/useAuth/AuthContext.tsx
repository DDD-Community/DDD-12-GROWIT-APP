import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { tokenStorage, type Tokens } from './tokenStorage';
import { tokenUtils } from './tokenUtils';
import type { OAuthSignupPayload } from '../webviewBridge';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  tokens: Tokens | null;
  oauthSignupData: OAuthSignupPayload | null;
}

export interface AuthActions {
  login: (tokens: Tokens) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setOAuthSignupData: (data: OAuthSignupPayload) => void;
  clearOAuthSignupData: () => void;
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    tokens: null,
    oauthSignupData: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const tokens = await tokenStorage.getTokens();

        if (tokens) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isAuthenticated: true,
            tokens,
          }));
        } else {
          await tokenStorage.clearTokens();
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isAuthenticated: false,
            tokens: null,
          }));
        }
      } catch {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          tokens: null,
        }));
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (tokens: Tokens) => {
    await tokenStorage.saveTokens(tokens);
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isAuthenticated: true,
      tokens,
      oauthSignupData: null,
    }));
  }, []);

  const logout = useCallback(async () => {
    await tokenStorage.clearTokens();
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isAuthenticated: false,
      tokens: null,
      oauthSignupData: null,
    }));
  }, []);

  const refreshAuth = useCallback(async () => {
    const tokens = await tokenStorage.getTokens();
    setState((prev) => ({
      ...prev,
      tokens,
      isAuthenticated: tokens !== null,
    }));
  }, []);

  const setOAuthSignupData = useCallback((data: OAuthSignupPayload) => {
    setState((prev) => ({
      ...prev,
      oauthSignupData: data,
    }));
  }, []);

  const clearOAuthSignupData = useCallback(() => {
    setState((prev) => ({
      ...prev,
      oauthSignupData: null,
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, refreshAuth, setOAuthSignupData, clearOAuthSignupData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState & AuthActions => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
