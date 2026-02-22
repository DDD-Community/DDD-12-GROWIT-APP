import { TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native';
import { signInWithKakao } from '@/lib/auth';
import type { KakaoLoginResult } from '@/lib/auth';
import KakaoLogo from '@assets/icons/kakao-logo.svg';

interface Props {
  onSuccess: (result: KakaoLoginResult) => void;
  onError?: (error: Error) => void;
}

export const KakaoLoginButton = ({ onSuccess, onError }: Props) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithKakao();

      console.log('카카오 로그인 성공:', {
        email: result.email,
        nickname: result.nickname,
        idToken: result.idToken.substring(0, 50) + '...',
      });

      onSuccess(result);
    } catch (error) {
      if (error instanceof Error) {
        const msg = error.message;
        if (msg.includes('cancelled') || msg.includes('cancel')) return;

        onError?.(error);
        Alert.alert('로그인 실패', error.message);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <View style={styles.content}>
        <KakaoLogo width={18} height={18} />
        <Text style={styles.text}>카카오 로그인</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#FEE500',
    borderRadius: 12,
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
    color: '#000000',
  },
});
