import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { AuthenticatedWebView } from '@/components/AuthenticatedWebView';
import { WEB_URL } from '@/constants';

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AuthenticatedWebView uri={WEB_URL} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
