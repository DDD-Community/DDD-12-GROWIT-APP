import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
import { isAppleLoginAvailable, signInWithApple } from '@/lib/auth';
import { useEffect, useState } from 'react';
import type { AppleLoginResult } from '@/lib/auth';
import AppleLogo from '@assets/icons/apple-logo.svg';

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
    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <View style={styles.content}>
        <AppleLogo width={18} height={18} />
        <Text style={styles.text}>Apple로 로그인</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
