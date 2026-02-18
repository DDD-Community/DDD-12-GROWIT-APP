import * as AppleAuthentication from 'expo-apple-authentication';

/**
 * Apple 로그인 결과 타입
 */
export interface AppleLoginResult {
  identityToken: string;
  user: string;
  email: string | null;
  fullName: {
    givenName: string | null;
    familyName: string | null;
  } | null;
}

/**
 * Apple 로그인 가능 여부 확인
 */
export const isAppleLoginAvailable = (): Promise<boolean> => {
  return AppleAuthentication.isAvailableAsync();
};

/**
 * Apple 로그인 실행
 */
export const signInWithApple = async (): Promise<AppleLoginResult> => {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error('Apple 로그인 실패: Identity Token이 없습니다.');
  }

  return {
    identityToken: credential.identityToken,
    user: credential.user,
    email: credential.email,
    fullName: credential.fullName
      ? {
          givenName: credential.fullName.givenName,
          familyName: credential.fullName.familyName,
        }
      : null,
  };
};
