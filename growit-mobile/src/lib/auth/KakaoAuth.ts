import {
  login,
  logout,
  getProfile,
  KakaoOAuthToken,
  KakaoProfile,
} from '@react-native-seoul/kakao-login';
import * as Crypto from 'expo-crypto';

export interface KakaoLoginResult {
  idToken: string;
  refreshToken: string;
  nonce: string;
  accessToken: string;
  email: string | null;
  nickname: string | null;
  profileImageUrl: string | null;
}

/**
 * nonce 생성 함수
 * - OpenID Connect에서 Replay Attack 방지를 위해 사용
 * - 로그인 요청 시 생성하여 idToken 검증에 사용
 */
const generateNonce = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const signInWithKakao = async (): Promise<KakaoLoginResult> => {
  // 1. nonce 생성 (idToken 검증용)
  // Note: @react-native-seoul/kakao-login SDK는 nonce 파라미터를 직접 지원하지 않음
  // 백엔드에서 별도 검증 로직이 필요할 수 있음
  const nonce = await generateNonce();

  // 2. 카카오 로그인
  const token: KakaoOAuthToken = await login();

  if (!token.idToken) {
    throw new Error('ID Token이 없습니다. OpenID Connect 활성화를 확인하세요.');
  }

  if (!token.refreshToken) {
    throw new Error('Refresh Token이 없습니다.');
  }

  // 3. 프로필 정보 조회
  const profile: KakaoProfile = await getProfile();

  return {
    idToken: token.idToken,
    refreshToken: token.refreshToken,
    nonce,
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
