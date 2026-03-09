export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL!.replace(/\/$/, '');

export const API_URL = process.env.EXPO_PUBLIC_API_URL!.replace(/\/$/, '');

export const AUTH_PROVIDERS = {
  KAKAO: 'kakao',
} as const;
