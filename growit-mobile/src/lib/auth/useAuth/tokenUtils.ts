interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * // TODO: 토큰의 만료여부의 기준이, 내부토큰정책과 맞지 않는 것으로 보임
 * @error 현재 사용하지 말것
 */
const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now + 10;
};

const getTokenRemainingTime = (token: string): number => {
  const payload = decodeJWT(token);
  if (!payload || typeof payload.exp !== 'number') {
    return 0;
  }

  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
};

export const tokenUtils = {
  decodeJWT,
  isTokenExpired,
  getTokenRemainingTime,
};
