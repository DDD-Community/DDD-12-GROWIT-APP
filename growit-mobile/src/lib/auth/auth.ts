import { API_URL } from '@/constants';
import { AuthToken, KakaoAuthToken, SignupFormData, KakaoSignupFormData } from '@/types/auth';

// 웹의 postLoginApi 와 동일
// 응답 구조: { data: { accessToken, refreshToken } }
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

// 웹의 postSignUp 과 동일
// privacyPolicy, termsOfService → requiredConsent 로 래핑
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

// 웹의 postKakaoSignUp 과 동일
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

// 토큰 갱신
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

// 카카오 로그인 (SDK 연동 후 registrationToken 또는 AuthToken 반환)
// TODO: @react-native-kakao/user SDK 연동
export async function kakaoLogin(): Promise<KakaoAuthToken> {
  throw new Error('카카오 로그인 SDK 미연동');
}
