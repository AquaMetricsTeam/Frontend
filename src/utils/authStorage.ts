const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

// ── Access Token ──────────────────────────────────────────
export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string, rememberMe = true) {
  clearStoredToken();
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

// ── Refresh Token ─────────────────────────────────────────
export function getStoredRefreshToken() {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ??
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
}

export function saveRefreshToken(token: string, rememberMe = true) {
  clearStoredRefreshToken();
  if (rememberMe) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

export function clearStoredRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ── Convenience: clear both ───────────────────────────────
export function clearAllTokens() {
  clearStoredToken();
  clearStoredRefreshToken();
}

// ── Persist both tokens at once ───────────────────────────
export function saveTokenPair(
  accessToken: string,
  refreshToken: string,
  rememberMe = true,
) {
  saveToken(accessToken, rememberMe);
  saveRefreshToken(refreshToken, rememberMe);
}