import { refreshTokenService } from "../services/refresh.service";
import { getStoredRefreshToken, saveTokenPair } from "@/utils/authStorage";

export async function attemptTokenRefresh(): Promise<string> {
  const storedRefreshToken = getStoredRefreshToken();

  if (!storedRefreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await refreshTokenService({ refreshToken: storedRefreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data;

  const rememberMe = !!localStorage.getItem("refreshToken");
  saveTokenPair(accessToken, newRefreshToken, rememberMe);

  return accessToken;
}

