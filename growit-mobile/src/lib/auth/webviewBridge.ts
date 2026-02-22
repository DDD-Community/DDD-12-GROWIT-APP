// 메시지 타입
export const MESSAGE_TYPES = {
  // 웹 → 앱
  READY: 'READY',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',

  // 앱 → 웹
  AUTH_TOKEN: 'AUTH_TOKEN',
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export interface WebViewMessage<T = unknown> {
  type: MessageType;
  payload?: T;
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

export interface LoginSuccessPayload {
  accessToken: string;
  refreshToken: string;
  user: {
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
