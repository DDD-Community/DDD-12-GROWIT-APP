import * as AppleAuthentication from 'expo-apple-authentication';
import { StyleSheet, View, Alert } from 'react-native';
import { isAppleLoginAvailable, signInWithApple } from '@/lib/auth';
import { useEffect, useState } from 'react';
import type { AppleLoginResult } from '@/lib/auth';

interface Props {
  onSuccess: (result: AppleLoginResult) => void;
  onError?: (error: Error) => void;
}

export const AppleLoginButton = ({ onSuccess, onError }: Props) => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    isAppleLoginAvailable().then(setIsAvailable);
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithApple();

      // TODO: 백엔드 API 연동 후 토큰 전송
      console.log('Apple 로그인 성공:', {
        user: result.user,
        email: result.email,
        fullName: result.fullName,
        // identityToken은 길어서 일부만 출력
        identityToken: result.identityToken.substring(0, 50) + '...',
      });

      onSuccess(result);
    } catch (error) {
      if (error instanceof Error) {
        // 사용자가 취소한 경우
        if (error.message.includes('canceled')) {
          return;
        }
        onError?.(error);
        Alert.alert('로그인 실패', error.message);
      }
    }
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={styles.button}
        onPress={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 50,
  },
});
