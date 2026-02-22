// 메시지 타입
export const MESSAGE_TYPES = {
  // 웹 → 앱
  READY: 'READY',
  SYNC_TOKEN_TO_APP: 'SYNC_TOKEN_TO_APP',
  LOGOUT: 'LOGOUT',
  NAVIGATE_TO_NATIVE_LOGIN: 'NAVIGATE_TO_NATIVE_LOGIN',

  // 앱 → 웹
  SYNC_TOKEN_TO_WEB: 'SYNC_TOKEN_TO_WEB',
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export interface WebViewMessage<T = unknown> {
  type: MessageType;
  payload?: T;
}

// 토큰 동기화 페이로드 (앱 → 웹)
export interface SyncTokenToWebPayload {
  accessToken: string;
  refreshToken: string;
}

// 토큰 동기화 페이로드 (웹 → 앱)
export interface SyncTokenToAppPayload {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    email: string;
    name: string;
    profileImage?: string;
  };
}

// 메시지 생성 헬퍼
export const createMessage = <T>(type: MessageType, payload?: T): string => {
  return JSON.stringify({ type, payload });
};

// 메시지 파싱 헬퍼
export const parseMessage = (data: string): WebViewMessage | null => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
