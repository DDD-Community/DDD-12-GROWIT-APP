import {
  login,
  logout,
  getProfile,
  KakaoOAuthToken,
  KakaoProfile,
} from '@react-native-seoul/kakao-login';

export interface KakaoLoginResult {
  idToken: string;
  accessToken: string;
  email: string | null;
  nickname: string | null;
  profileImageUrl: string | null;
}

export const signInWithKakao = async (): Promise<KakaoLoginResult> => {
  const token: KakaoOAuthToken = await login();

  if (!token.idToken) {
    throw new Error('ID Token이 없습니다. OpenID Connect 활성화를 확인하세요.');
  }

  const profile: KakaoProfile = await getProfile();

  return {
    idToken: token.idToken,
    accessToken: token.accessToken,
    email: profile.email ?? null,
    nickname: profile.nickname ?? null,
    profileImageUrl: profile.profileImageUrl ?? null,
  };
};

export const signOutFromKakao = async (): Promise<void> => {
  try {
    await logout();
  } catch (error) {
    console.warn('카카오 로그아웃:', error);
  }
};
