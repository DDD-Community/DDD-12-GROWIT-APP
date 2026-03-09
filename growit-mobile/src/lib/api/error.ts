/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API 응답에서 에러 메시지를 추출
 */
export async function extractErrorMessage(
  response: Response,
  fallbackMessage: string
): Promise<string> {
  try {
    const errorBody = await response.json();
    return errorBody.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

/**
 * API 응답 에러 처리
 * - 에러 응답의 message 필드를 추출하여 ApiError로 throw
 */
export async function handleApiError(response: Response, fallbackMessage: string): Promise<never> {
  const message = await extractErrorMessage(response, fallbackMessage);
  throw new ApiError(message, response.status);
}
