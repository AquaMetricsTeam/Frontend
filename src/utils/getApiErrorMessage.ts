// src/utils/getApiErrorMessage.ts

export function getApiErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === "object" && "message" in error) {
        const message = (error as { message?: unknown }).message;

        if (typeof message === "string" && message.trim().length > 0) {
            return message;
        }
    }

    return fallback;
}