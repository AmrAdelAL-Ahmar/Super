/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Standard error handler for API calls
 * Logs errors and returns a default value or rethrows
 * 
 * @param error Error object
 * @param fallbackMessage Fallback error message
 * @param defaultValue Default value to return
 * @returns Default value or throws error
 */
export function handleApiError<T>(error: unknown, fallbackMessage: string, defaultValue?: T): T {
  // Log the error
  console.error('API Error:', error);
  
  // Format the error message
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message || fallbackMessage;
  }
  
  // If default value provided, return it (silent failure)
  if (arguments.length >= 3) {
    return defaultValue as T;
  }
  
  // Otherwise throw API error
  throw new ApiError(errorMessage);
}

/**
 * Format API response for consistent error handling
 * 
 * @param response Fetch response object
 * @returns Promise resolving to response data
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `API Error: ${response.status} ${response.statusText}`;
    throw new ApiError(errorMessage, response.status);
  }
  
  return await response.json() as T;
}

/**
 * Parse and handle error message from various error types
 * 
 * @param error Error object
 * @param fallback Fallback error message
 * @returns Human-readable error message
 */
export function getErrorMessage(error: unknown, fallback = 'An unknown error occurred'): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  
  return fallback;
} 