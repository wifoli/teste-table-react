const TOKEN_KEY = "auth_token";
// const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenManager = {
    getToken(): string | null {
        if (typeof window === "undefined") return null;
        return sessionStorage.getItem(TOKEN_KEY);
    },

    setToken(token: string): void {
        if (typeof window === "undefined") return;
        sessionStorage.setItem(TOKEN_KEY, token);
    },

    /**
     * No momento não usarrá refresh token
     * 
    getRefreshToken(): string | null {
        if (typeof window === "undefined") return null;
        return sessionStorage.getItem(REFRESH_TOKEN_KEY);
    },

    setRefreshToken(token: string): void {
        if (typeof window === "undefined") return;
        sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
    },
     */

    clearTokens(): void {
        if (typeof window === "undefined") return;
        sessionStorage.removeItem(TOKEN_KEY);
        // sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    hasToken(): boolean {
        return !!this.getToken();
    },
};
