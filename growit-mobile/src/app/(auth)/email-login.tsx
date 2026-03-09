import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { AuthWebView } from '@/components/AuthWebView';
import { WEB_URL } from '@/constants';

export default function EmailLoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AuthWebView uri={`${WEB_URL}/login/email`} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f10',
  },
});
