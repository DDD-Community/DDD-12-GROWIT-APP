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

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<AuthToken> {
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
  registrationToken: string,
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

export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthToken> {
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
