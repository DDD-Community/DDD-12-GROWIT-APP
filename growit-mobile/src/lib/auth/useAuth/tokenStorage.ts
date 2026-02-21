import * as SecureStore from 'expo-secure-store';

enum StorageKey {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  UserInfo = 'userInfo',
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

const saveTokens = async (tokens: Tokens): Promise<void> => {
  await Promise.all([
    SecureStore.setItemAsync(StorageKey.AccessToken, tokens.accessToken),
    SecureStore.setItemAsync(StorageKey.RefreshToken, tokens.refreshToken),
  ]);
};

const getAccessToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(StorageKey.AccessToken);
};

const getRefreshToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(StorageKey.RefreshToken);
};

const getTokens = async (): Promise<Tokens | null> => {
  const [accessToken, refreshToken] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
};

const clearTokens = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(StorageKey.AccessToken),
    SecureStore.deleteItemAsync(StorageKey.RefreshToken),
  ]);
};

const saveUserInfo = async (user: UserInfo): Promise<void> => {
  await SecureStore.setItemAsync(StorageKey.UserInfo, JSON.stringify(user));
};

const getUserInfo = async (): Promise<UserInfo | null> => {
  const data = await SecureStore.getItemAsync(StorageKey.UserInfo);
  return data ? JSON.parse(data) : null;
};

const clearUserInfo = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(StorageKey.UserInfo);
};

const clearAll = async (): Promise<void> => {
  await Promise.all([clearTokens(), clearUserInfo()]);
};

export const tokenStorage = {
  saveTokens,
  getTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  saveUserInfo,
  getUserInfo,
  clearUserInfo,
  clearAll,
};
