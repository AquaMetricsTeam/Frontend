import { t } from "i18next";
import { BACKEND_BASE_URL } from "@/constants/backendAPIsConfig";
import { DEFAULT_LOCALE } from "@/constants/i18nConfig";
import { clearAllTokens, getStoredToken, saveToken } from "@/utils/authStorage";
import { generateIdempotencyKey } from "@/lib/utils";

export interface CustomFetchOptions extends RequestInit {
  idempotencyKey?: string;
  autoIdempotent?: boolean;
  timeoutMs?: number;
}

let refreshAttemptInProgress: Promise<string> | null = null;

// Global in-memory cache for tracking active/failed mutation request idempotency keys
const activeIdempotencyKeys = new Map<
  string,
  { key: string; timestamp: number }
>();
const KEY_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

function getPayloadHash(
  method: string,
  endpoint: string,
  body?: BodyInit | null,
): string {
  const bodyString = typeof body === "string" ? body : "";
  return `${method}:${endpoint}:${bodyString}`;
}

const AUTH_SKIP_REFRESH_PATHS = [
  "/Auth/login",
  "/Auth/refresh",
  "/Auth/logout",
];

async function getRefreshedToken(): Promise<string> {
  if (!refreshAttemptInProgress) {
    refreshAttemptInProgress =
      import("@/features/auth/hooks/useRefreshToken").then(
        ({ attemptTokenRefresh }) =>
          attemptTokenRefresh().finally(() => {
            refreshAttemptInProgress = null;
          }),
      );
  }
  return refreshAttemptInProgress;
}

function buildHeaders(
  options: CustomFetchOptions,
  token: string | null,
  idempotencyKey?: string,
): HeadersInit {
  const isFormData = options.body instanceof FormData;

  return {
    ...(isFormData
      ? { Accept: "application/json" }
      : { "Content-Type": "application/json", Accept: "application/json" }),
    "accept-language":
      localStorage.getItem("aqua-metrics-lang") || DEFAULT_LOCALE,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    ...(options.headers || {}),
  };
}

export async function customFetch<T>(
  endpoint: string,
  options: CustomFetchOptions = {},
  isJsonResponse = true,
): Promise<T> {
  // Immediate offline check
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw {
      message:
        "You are currently offline. Please check your network connection.",
      status: 0,
    };
  }

  const token = getStoredToken();
  const url = `${BACKEND_BASE_URL}${endpoint}`;
  const skipRefresh = AUTH_SKIP_REFRESH_PATHS.some((p) =>
    endpoint.startsWith(p),
  );

  const method = (options.method || "GET").toUpperCase();
  const isMutationMethod = ["POST", "PUT", "PATCH"].includes(method);

  // Extract explicit idempotency key if passed
  let idempotencyKey = options.idempotencyKey;
  if (!idempotencyKey && options.headers) {
    const headersObj = options.headers as Record<string, string>;
    idempotencyKey =
      headersObj["Idempotency-Key"] || headersObj["idempotency-key"];
  }

  // Payload-aware global idempotency key lookup & generation
  let requestHash: string | null = null;
  if (!idempotencyKey && (options.autoIdempotent || isMutationMethod)) {
    requestHash = getPayloadHash(method, endpoint, options.body);

    // Clean up expired keys (> 5 min)
    const now = Date.now();
    for (const [h, item] of activeIdempotencyKeys.entries()) {
      if (now - item.timestamp > KEY_TTL_MS) {
        activeIdempotencyKeys.delete(h);
      }
    }

    // Reuse existing key if previous attempt for identical payload failed/pending
    if (activeIdempotencyKeys.has(requestHash)) {
      idempotencyKey = activeIdempotencyKeys.get(requestHash)!.key;
    } else {
      idempotencyKey = generateIdempotencyKey();
      activeIdempotencyKeys.set(requestHash, {
        key: idempotencyKey,
        timestamp: Date.now(),
      });
    }
  }

  const timeoutMs = options.timeoutMs ?? 10000; // Default 10s timeout

  const makeRequest = async (accessToken: string | null) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        method,
        signal: options.signal || controller.signal,
        headers: buildHeaders(options, accessToken, idempotencyKey),
      });
      clearTimeout(timer);
      return res;
    } catch (err: unknown) {
      clearTimeout(timer);
      const errObj = err as { name?: string };
      if (errObj?.name === "AbortError") {
        throw {
          message: "Request timed out. Please try again.",
          status: 408,
        };
      }
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        throw {
          message:
            "You are currently offline. Please check your network connection.",
          status: 0,
        };
      }
      throw err;
    }
  };

  try {
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
        errors?: string[] | null;
      }

      let errorBody: CustomErrorBody;
      try {
        const parsed = await response.json();
        // Some endpoints (e.g. knowledge-documents) return raw JSON-string bodies
        // like "No file was uploaded." — normalize them to { message }.
        errorBody = typeof parsed === "string" ? { message: parsed } : parsed;
      } catch {
        errorBody = {};
      }

      throw {
        message: errorBody.message || t("common:error.default"),
        errorBody: errorBody.data || null,
        errors: errorBody.errors || null,
        status: response.status,
      };
    }

    // Success! Clear key from global map so subsequent requests get a new key
    if (requestHash) {
      activeIdempotencyKeys.delete(requestHash);
    }

    if (!isJsonResponse) {
      return response as unknown as T;
    }

    return response.json();
  } catch (error: unknown) {
    // Note: On error, requestHash remains in activeIdempotencyKeys map
    // so if user/app retries the exact same payload, the same Idempotency-Key is reused.
    const err = error as { name?: string; message?: string };
    if (err?.name === "TypeError" && err?.message?.includes("fetch")) {
      throw {
        message: "Network error. Please check your connection and retry.",
        status: 0,
      };
    }
    throw error;
  }
}
