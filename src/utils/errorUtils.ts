import { APIError, ErrorType } from '@types/api';

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
};

export const formatApiError = (error: APIError): string => {
  return error.suggestedAction || error.message;
};

export const isNetworkError = (error: APIError): boolean => {
  return error.type === ErrorType.NETWORK_ERROR || error.type === ErrorType.TIMEOUT_ERROR;
};
