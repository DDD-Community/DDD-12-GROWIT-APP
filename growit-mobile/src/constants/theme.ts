import { Platform } from 'react-native';

// 웹 앱 Tailwind 커스텀 토큰과 대응되는 색상
export const AppColors = {
  // 배경
  background: '#121212',        // 앱 전체 배경
  surface: '#1e1e1e',           // 카드, 입력창 배경
  surfaceAlt: '#1a1a1a',        // bg-normal-alternative (fixed footer 등)

  // 텍스트
  textStrong: '#ffffff',        // text-text-strong (헤딩)
  textPrimary: '#e0e0e0',       // text-text-primary (본문)
  textSecondary: '#9ca3af',     // text-gray-400
  textMuted: '#d1d5db',         // text-gray-300 (라벨)
  textInverse: '#000000',       // text-text-inverse (카카오 버튼 텍스트)

  // 채우기
  fillInverse: '#f5f5f5',       // bg-fill-inverse (이메일 버튼 - 밝은 색)

  // 선
  lineNormal: '#2a2a2a',        // border-line-normal

  // 상태
  negative: '#ff6363',          // text-status-negative (에러)

  // 브랜드
  kakao: '#FEE500',             // 카카오 노란색
} as const;

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
