import { createAuthClient } from "better-auth/react"
import { toast } from "sonner"

// Define error response interface
interface ErrorResponse {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
}

// Define common error messages
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Invalid credentials. Please check your email and password.",
  FORBIDDEN: "Access denied. Please verify your email first.",
  NOT_FOUND: "Resource not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  DEFAULT: "An unexpected error occurred. Please try again."
} as const;

// Helper function to get appropriate error message
const getErrorMessage = (error: ErrorResponse | null): string => {
  if (!error) return ERROR_MESSAGES.DEFAULT;

  // Network errors
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const status = error.response?.status;
  const message = error.response?.data?.message;

  switch (status) {
    case 400:
      return message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return message || ERROR_MESSAGES.DEFAULT;
  }
};

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL || '',
  onError: (error: ErrorResponse) => {
    // Log error for debugging
    console.error('Auth error:', error);

    // Get appropriate error message
    const errorMessage = getErrorMessage(error);

    // Show error toast
    toast.error(errorMessage, {
      duration: 5000,
      position: "top-center",
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Clear any stored auth data
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }

    // You can add more specific error handling here
    if (error.response?.status === 403) {
      // Handle email verification required
      // You might want to redirect to verification page
    }
  },
  onRequest: () => {
    // Show loading state if needed
    // You can use a global loading state here
  },
  onResponse: () => {
    // Hide loading state if needed
  },
  onSuccess: (response: { message?: string }) => {
    // Handle successful responses
    if (response?.message) {
      toast.success(response.message, {
        duration: 3000,
        position: "top-center",
      });
    }
  }
})

export const { signIn, signUp, useSession, signOut, forgetPassword, resetPassword } = authClient