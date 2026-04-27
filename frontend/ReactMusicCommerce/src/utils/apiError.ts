import axios from "axios";

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  status?: number;
  path?: string;
  timestamp?: string;
  fieldErrors?: Record<string, string>;
}

export interface ParsedApiError {
  message: string;
  status?: number;
  fieldErrors: Record<string, string>;
}

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

const isGenericValidationMessage = (message?: string) => {
  if (!isNonEmptyString(message)) {
    return false;
  }

  const normalized = message.toLowerCase();
  return normalized.includes("validation failed for one or more");
};

export const parseApiError = (
  error: unknown,
  fallbackMessage: string,
): ParsedApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as ApiErrorResponse | string | undefined;

    if (isNonEmptyString(data)) {
      return {
        message: data,
        status,
        fieldErrors: {},
      };
    }

    if (data && typeof data === "object") {
      const fieldErrors =
        data.fieldErrors && typeof data.fieldErrors === "object"
          ? data.fieldErrors
          : {};

      const firstFieldError = Object.values(fieldErrors).find(isNonEmptyString);

      const preferredMessage =
        (isNonEmptyString(data.message) && data.message)
        || (isNonEmptyString(data.error) && data.error)
        || fallbackMessage;

      const message = isGenericValidationMessage(preferredMessage) && firstFieldError
        ? firstFieldError
        : preferredMessage;

      return {
        message,
        status,
        fieldErrors,
      };
    }

    return {
      message: fallbackMessage,
      status,
      fieldErrors: {},
    };
  }

  if (error instanceof Error && isNonEmptyString(error.message)) {
    return {
      message: error.message,
      fieldErrors: {},
    };
  }

  return {
    message: fallbackMessage,
    fieldErrors: {},
  };
};