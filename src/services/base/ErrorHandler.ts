/**
 * 서비스 에러 클래스
 *
 * HttpClient에서 발생한 에러를 Service 계층에서 처리하기 위한 표준 에러 클래스
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'ServiceError';
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}

/**
 * HttpClient 에러 인터페이스
 */
interface HttpClientError {
  message: string;
  code?: string;
  statusCode?: number;
  isRetryable?: boolean;
}

/**
 * 에러 처리 유틸리티
 *
 * HttpClient 및 일반 에러를 ServiceError로 변환
 */
export class ErrorHandler {
  /**
   * 에러를 ServiceError로 변환
   */
  static handleError(error: unknown): ServiceError {
    // HttpClient에서 발생한 에러 처리
    if (this.isHttpClientError(error)) {
      const httpError = error as HttpClientError;
      return new ServiceError(
        httpError.message,
        httpError.code,
        httpError.statusCode,
        httpError.isRetryable ?? false
      );
    }

    // Axios 에러 처리
    if (this.isAxiosError(error)) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; code?: string };
          status?: number;
        };
        message?: string;
      };

      const message = axiosError.response?.data?.message || axiosError.message || '알 수 없는 오류가 발생했습니다.';
      const code = axiosError.response?.data?.code;
      const statusCode = axiosError.response?.status;
      const isRetryable = this.isRetryableStatusCode(statusCode);

      return new ServiceError(message, code, statusCode, isRetryable);
    }

    // 일반 Error 처리
    if (error instanceof Error) {
      return new ServiceError(error.message, 'UNKNOWN_ERROR', 500, false);
    }

    // 기타 에러 처리
    return new ServiceError('알 수 없는 오류가 발생했습니다.', 'UNKNOWN_ERROR', 500, false);
  }

  /**
   * 네트워크 에러 확인
   */
  static isNetworkError(error: unknown): boolean {
    if (error instanceof ServiceError) {
      return error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR';
    }
    return false;
  }

  /**
   * 인증 에러 확인
   */
  static isAuthError(error: unknown): boolean {
    if (error instanceof ServiceError) {
      return (
        error.statusCode === 401 ||
        error.code === 'AUTH_TOKEN_EXPIRED' ||
        error.code === 'JWT_EXPIRED' ||
        (error.code?.startsWith('AUTH_') ?? false)
      );
    }
    return false;
  }

  /**
   * HttpClient 에러 확인
   */
  private static isHttpClientError(error: unknown): boolean {
    return (
      error !== null &&
      typeof error === 'object' &&
      'code' in error &&
      'statusCode' in error &&
      'message' in error
    );
  }

  /**
   * Axios 에러 확인
   */
  private static isAxiosError(error: unknown): boolean {
    return (
      error !== null &&
      typeof error === 'object' &&
      'isAxiosError' in error &&
      error.isAxiosError === true
    );
  }

  /**
   * 재시도 가능한 상태 코드 확인
   */
  private static isRetryableStatusCode(statusCode?: number): boolean {
    if (!statusCode) return true; // 네트워크 오류

    // 5xx 서버 오류는 재시도 가능
    if (statusCode >= 500) return true;

    // 429 Too Many Requests는 재시도 가능
    if (statusCode === 429) return true;

    return false;
  }
}
