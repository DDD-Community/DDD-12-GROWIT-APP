import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { MainWebView } from '@/components/MainWebView';
import { WEB_URL } from '@/constants';

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MainWebView uri={`${WEB_URL}/home`} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f10',
  },
});
