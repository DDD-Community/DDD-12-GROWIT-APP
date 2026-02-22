import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppleLoginButton } from '@/components/AppleLoginButton';
import { KakaoLoginButton } from '@/components/KakaoLoginButton';
import GrowItLogo from '@assets/icons/growit-logo.svg';
import type { AppleLoginResult, KakaoLoginResult } from '@/lib/auth';

export default function LoginScreen() {
  const router = useRouter();

  const handleAppleLoginSuccess = (result: AppleLoginResult) => {
    console.log('Apple 로그인 성공!', result.user);

    Alert.alert(
      '로그인 성공',
      `환영합니다${result.fullName?.givenName ? `, ${result.fullName.givenName}님` : ''}!`
    );
  };

  const handleKakaoLoginSuccess = (result: KakaoLoginResult) => {
    console.log('카카오 로그인 성공!', result.nickname);

    const name = result.nickname;
    const message = name ? `환영합니다, ${name}님!` : '환영합니다!';
    Alert.alert('로그인 성공', message);
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
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => router.push('/(auth)/email-login')}
        >
          <Text style={styles.emailButtonText}>이메일로 로그인</Text>
        </TouchableOpacity>
      </View>

      {/* 회원가입 링크 */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>계정이 없으신가요?  </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
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
