import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppleLoginButton } from '@/components/AppleLoginButton';
import { KakaoLoginButton } from '@/components/KakaoLoginButton';
import GrowItLogo from '@assets/icons/growit-logo.svg';
import { useAuth } from '@/lib/auth/useAuth';
import { appleLogin, kakaoSocialLogin } from '@/lib/auth';
import type { AppleLoginResult, KakaoLoginResult, OAuthSignupPayload } from '@/lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login, setOAuthSignupData } = useAuth();

  const handleAppleLoginSuccess = async (result: AppleLoginResult) => {
    try {
      // 1. 백엔드 API 호출
      const authResult = await appleLogin(result.identityToken, result.authorizationCode);
      const { data } = authResult;

      if (data.accessToken && data.refreshToken) {
        // 기존 회원: 토큰 저장 후 메인으로 이동
        await login({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        // AuthProvider가 자동으로 메인 화면으로 라우팅
      } else if (data.registrationToken) {
        // 신규 회원: WebView 회원가입 페이지로 이동
        const signupPayload: OAuthSignupPayload = {
          identityToken: result.identityToken,
          registrationToken: data.registrationToken,
          socialLoginType: 'apple',
        };
        setOAuthSignupData(signupPayload);
        router.push('/(auth)/oauth-signup');
      }
    } catch (error) {
      console.error('Apple 로그인 실패:', error);
      const message = error instanceof Error ? error.message : '다시 시도해주세요.';
      Alert.alert('로그인 실패', message);
    }
  };

  const handleKakaoLoginSuccess = async (result: KakaoLoginResult) => {
    try {
      // 1. 백엔드 API 호출 (idToken, refreshToken, nonce 전달)
      const authResult = await kakaoSocialLogin(result.idToken, result.refreshToken, result.nonce);
      const { data } = authResult;

      if (data.accessToken && data.refreshToken) {
        // 기존 회원: 토큰 저장 후 메인으로 이동
        await login({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        // AuthProvider가 자동으로 메인 화면으로 라우팅
      } else if (data.registrationToken) {
        // 신규 회원: WebView 회원가입 페이지로 이동
        const signupPayload: OAuthSignupPayload = {
          identityToken: result.idToken,
          registrationToken: data.registrationToken,
          socialLoginType: 'kakao',
        };
        setOAuthSignupData(signupPayload);
        router.push('/(auth)/oauth-signup');
      }
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      const message = error instanceof Error ? error.message : '다시 시도해주세요.';
      Alert.alert('로그인 실패', message);
    }
  };

  const handleEmailLogin = () => {
    router.push('/(auth)/email-login');
  };

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 로고 영역 */}
      <View style={styles.logoContainer}>
        <GrowItLogo width={140} height={25} />
        <Text style={styles.subtitle}>
          목표는 쉽게, 성장은 확실하게{'\n'}
          GROWIT과 함께 매일 성장하세요.
        </Text>
      </View>

      {/* 로그인 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <KakaoLoginButton onSuccess={handleKakaoLoginSuccess} />
        <AppleLoginButton onSuccess={handleAppleLoginSuccess} />

        {/* 이메일 로그인 버튼 */}
        <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin}>
          <Text style={styles.emailButtonText}>이메일로 로그인</Text>
        </TouchableOpacity>
      </View>

      {/* 회원가입 링크 */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>계정이 없으신가요?</Text>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.signupLink}>회원가입 바로가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 24,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  emailButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
    gap: 8,
  },
  signupText: {
    color: '#888888',
    fontSize: 14,
  },
  signupLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
