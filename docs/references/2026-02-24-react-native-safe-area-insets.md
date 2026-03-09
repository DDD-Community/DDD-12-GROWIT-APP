# React Native Safe Area Insets 가이드

## 개요

React Native에서 safe area를 처리하는 방법과 상단/하단 배경색을 다르게 적용하는 방법을 정리합니다.

## SafeAreaView vs useSafeAreaInsets

### SafeAreaView (Deprecated)

`react-native`의 `SafeAreaView`는 deprecated 되었으며, 상단/하단 배경색을 다르게 설정할 수 없습니다.

```typescript
// 권장하지 않음
import { SafeAreaView } from 'react-native';

<SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
  <Content />
</SafeAreaView>
```

### useSafeAreaInsets (권장)

`react-native-safe-area-context`의 `useSafeAreaInsets` hook을 사용하면 safe area를 직접 제어할 수 있습니다.

```typescript
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* 상단 safe area */}
      <View style={[styles.topSafeArea, { height: insets.top }]} />

      {/* 콘텐츠 */}
      <View style={styles.content}>
        <Content />
      </View>

      {/* 하단 safe area */}
      <View style={[styles.bottomSafeArea, { height: insets.bottom }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSafeArea: {
    backgroundColor: '#0f0f10',  // 상단 배경색
  },
  bottomSafeArea: {
    backgroundColor: '#1b1c1e',  // 하단 배경색 (탭바 영역)
  },
  content: {
    flex: 1,
  },
});
```

## insets 객체

```typescript
const insets = useSafeAreaInsets();

// insets 구조
{
  top: number,     // 상단 safe area 높이 (노치/다이나믹 아일랜드)
  bottom: number,  // 하단 safe area 높이 (홈 인디케이터)
  left: number,    // 좌측 safe area (가로 모드)
  right: number,   // 우측 safe area (가로 모드)
}
```

## 사용 사례

### 1. 상단/하단 배경색 다르게 적용

```typescript
<View style={{ flex: 1 }}>
  <View style={{ height: insets.top, backgroundColor: '#000' }} />
  <Content />
  <View style={{ height: insets.bottom, backgroundColor: '#1b1c1e' }} />
</View>
```

### 2. 콘텐츠에 패딩 적용

```typescript
<View style={{
  flex: 1,
  paddingTop: insets.top,
  paddingBottom: insets.bottom
}}>
  <Content />
</View>
```

### 3. 특정 영역만 safe area 적용

```typescript
<View style={{ flex: 1 }}>
  {/* 상단만 safe area */}
  <View style={{ paddingTop: insets.top }}>
    <Header />
  </View>

  {/* 나머지는 전체 화면 사용 */}
  <FullScreenContent />
</View>
```

## SafeAreaProvider 설정

`useSafeAreaInsets`를 사용하려면 앱 루트에 `SafeAreaProvider`가 필요합니다.

Expo Router를 사용하면 자동으로 설정되어 있으므로 별도 설정이 필요 없습니다.

```typescript
// 수동 설정이 필요한 경우
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}
```

## 주의사항

1. **WebView와 함께 사용 시**: WebView 자체는 safe area를 인식하지 못하므로, 부모 컴포넌트에서 safe area를 처리해야 합니다.

2. **동적 높이**: `insets` 값은 기기마다 다르므로 하드코딩하지 말고 항상 `useSafeAreaInsets`를 사용해야 합니다.

3. **가로 모드**: 가로 모드에서는 `left`와 `right` 값도 고려해야 합니다.

## 참고 링크

- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)
- [Expo - Safe Area Context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)
