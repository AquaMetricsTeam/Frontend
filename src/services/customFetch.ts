import { t } from "i18next";
import { BACKEND_BASE_URL } from "@/constants/backendAPIsConfig";
import { DEFAULT_LOCALE } from "@/constants/i18nConfig";
import { clearAllTokens, getStoredToken, saveToken } from "@/utils/authStorage";

let refreshAttemptInProgress: Promise<string> | null = null;

const AUTH_SKIP_REFRESH_PATHS = ["/Auth/login", "/Auth/refresh", "/Auth/logout"];

async function getRefreshedToken(): Promise<string> {
  if (!refreshAttemptInProgress) {
    refreshAttemptInProgress = import(
      "@/features/auth/hooks/useRefreshToken"
    ).then(({ attemptTokenRefresh }) =>
      attemptTokenRefresh().finally(() => {
        refreshAttemptInProgress = null;
      }),
    );
  }
  return refreshAttemptInProgress;
}

function buildHeaders(options: RequestInit, token: string | null): HeadersInit {
  const isFormData = options.body instanceof FormData;

  return {
    ...(isFormData
      ? { Accept: "application/json" }
      : { "Content-Type": "application/json", Accept: "application/json" }),
    "accept-language": localStorage.getItem("i18nextLng") || DEFAULT_LOCALE,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
}

export async function customFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isJsonResponse = true,
): Promise<T> {
  const token = getStoredToken();
  const url = `${BACKEND_BASE_URL}${endpoint}`;
  const skipRefresh = AUTH_SKIP_REFRESH_PATHS.some((p) => endpoint.startsWith(p));

  const makeRequest = async (accessToken: string | null) =>
    fetch(url, {
      ...options,
      method: options.method || "GET",
      headers: buildHeaders(options, accessToken),
    });

  let response = await makeRequest(token);

  if (response.status === 401 && !skipRefresh) {
    try {
      const newAccessToken = await getRefreshedToken();
      saveToken(newAccessToken, !!localStorage.getItem("token"));
      response = await makeRequest(newAccessToken);
    } catch {
      clearAllTokens();
      window.location.replace("/login");
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    interface CustomErrorBody {
      message?: string;
      data?: unknown;
    }

    let errorBody: CustomErrorBody;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = {};
    }

    throw {
      message: errorBody.message || t("common:error.default"),
      errorBody: errorBody.data || null,
      status: response.status,
    };
  }

  if (!isJsonResponse) {
    return response as unknown as T;
  }

  return response.json();
}
