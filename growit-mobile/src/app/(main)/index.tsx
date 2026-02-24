import { StyleSheet, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainWebView } from '@/components/MainWebView';
import { WEB_URL } from '@/constants';

export default function MainScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* 상단 safe area */}
      <View style={[styles.topSafeArea, { height: insets.top }]} />
      {/* WebView 콘텐츠 */}
      <MainWebView uri={`${WEB_URL}/home`} />
      {/* 하단 safe area */}
      <View style={[styles.bottomSafeArea, { height: insets.bottom }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f10',
  },
  topSafeArea: {
    backgroundColor: '#0f0f10',
  },
  bottomSafeArea: {
    backgroundColor: '#1b1c1e',
  },
});
