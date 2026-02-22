import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { AuthWebView } from '@/components/AuthWebView';
import { WEB_URL } from '@/constants';

export default function SignupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AuthWebView uri={`${WEB_URL}/signup`} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f10',
  },
});
