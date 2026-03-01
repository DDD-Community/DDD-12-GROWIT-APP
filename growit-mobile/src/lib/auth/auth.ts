import { API_URL } from '@/constants';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface KakaoAuthToken {
  registrationToken?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  nickname: string;
  privacyPolicy: boolean;
  termsOfService: boolean;
}

export interface KakaoSignupFormData {
  nickname: string;
  privacyPolicy: boolean;
  termsOfService: boolean;
}

export async function loginWithEmail(email: string, password: string): Promise<AuthToken> {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('로그인에 실패했습니다.');

  const json = await res.json();
  return json.data;
}

export async function signUp(form: SignupFormData): Promise<void> {
  const { privacyPolicy, termsOfService, ...rest } = form;

  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...rest,
      requiredConsent: {
        isPrivacyPolicyAgreed: privacyPolicy,
        isServiceTermsAgreed: termsOfService,
      },
    }),
  });

  if (!res.ok) throw new Error('회원가입에 실패했습니다.');
}

export async function kakaoSignUp(
  form: KakaoSignupFormData,
  registrationToken: string
): Promise<void> {
  const { privacyPolicy, termsOfService, ...rest } = form;

  const res = await fetch(`${API_URL}/auth/signup/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      registrationToken,
      ...rest,
      requiredConsent: {
        isPrivacyPolicyAgreed: privacyPolicy,
        isServiceTermsAgreed: termsOfService,
      },
    }),
  });

  if (!res.ok) throw new Error('카카오 회원가입에 실패했습니다.');
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthToken> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error('토큰 갱신에 실패했습니다.');

  const json = await res.json();
  return json.data;
}

export async function kakaoLogin(): Promise<KakaoAuthToken> {
  throw new Error('카카오 로그인 SDK 미연동');
}

/**
 * 소셜 로그인 API 응답
 * - 기존 회원: accessToken, refreshToken 반환
 * - 신규 회원: registrationToken 반환
 */
export interface SocialLoginResponse {
  data: {
    // 기존 회원인 경우
    accessToken?: string;
    refreshToken?: string;
    // 신규 회원인 경우
    registrationToken?: string;
  };
}

/**
 * Apple 소셜 로그인 API 호출
 * - Apple SDK에서 받은 idToken, authorizationCode를 백엔드로 전송
 * - 백엔드에서 토큰 검증 후 JWT 발급
 */
export async function appleLogin(
  idToken: string,
  authorizationCode: string
): Promise<SocialLoginResponse> {
  const res = await fetch(`${API_URL}/auth/signin/apple`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, authorizationCode }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Apple 로그인에 실패했습니다.');
  }

  return res.json();
}

/**
 * Kakao 소셜 로그인 API 호출
 * - Kakao SDK에서 받은 idToken, refreshToken, nonce를 백엔드로 전송
 * - 백엔드에서 idToken + nonce 검증 후 JWT 발급
 */
export async function kakaoSocialLogin(
  idToken: string,
  refreshToken: string,
  nonce: string
): Promise<SocialLoginResponse> {
  const res = await fetch(`${API_URL}/auth/signin/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, refreshToken, nonce }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || '카카오 로그인에 실패했습니다.');
  }

  return res.json();
}
