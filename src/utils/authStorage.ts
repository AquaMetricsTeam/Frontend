const TOKEN_KEY = "token";

export function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string, rememberMe = true) {
    clearStoredToken();

    if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, token);
        return;
    }

    sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}