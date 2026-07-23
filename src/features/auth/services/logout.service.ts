import { customFetch } from "@/services/customFetch";
import type { LogoutPayload } from "../types";

export async function logoutService(payload: LogoutPayload): Promise<void> {
  await customFetch<void>(
    "/Auth/logout",
    { method: "POST", body: JSON.stringify(payload) },
    false,
  );
}
