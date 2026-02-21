import { View, Text, StyleSheet, Alert } from 'react-native';
import { AppleLoginButton } from '@/components/AppleLoginButton';
import { KakaoLoginButton } from '@/components/KakaoLoginButton';
import type { AppleLoginResult, KakaoLoginResult } from '@/lib/auth';

export default function LoginScreen() {
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
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <View style={styles.loginButtons}>
        <AppleLoginButton onSuccess={handleAppleLoginSuccess} />
        <KakaoLoginButton onSuccess={handleKakaoLoginSuccess} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  loginButtons: {
    width: '100%',
    gap: 16,
  },
});
