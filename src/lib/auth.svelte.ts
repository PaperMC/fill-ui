import { Context } from "runed";
import { API_ENDPOINT } from "./api.svelte";
import { goto } from "$app/navigation";
import { page } from "$app/state";
import { SvelteURLSearchParams } from "svelte/reactivity";
import { browser } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import type { ServerLoad } from "@sveltejs/kit";

export const AUTH_CTX = new Context<AuthHolder>("fill-auth");

export class AuthHolder {
  username: string | null = $state(null);
  token: string | null = $state(null);
  refreshToken: string | null = $state(null);
  expiresAt: number | null = $state(null);
  private currentRefresh: Promise<boolean> | null = null;

  constructor() {
    if (browser) {
      this.username = localStorage.getItem("username");
      this.token = localStorage.getItem("authToken");
      this.refreshToken = localStorage.getItem("authRefreshToken");
      const exp = localStorage.getItem("authTokenExpiresAt");
      this.expiresAt = exp ? parseInt(exp) : null;
    }
  }

  getUsername(): string | null {
    return this.username;
  }

  getAuthToken(): string | null {
    return this.token;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  async tryRefreshToken(): Promise<boolean> {
    if (this.currentRefresh) return this.currentRefresh;

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    const now = Date.now();
    if (this.expiresAt && this.expiresAt - now > 5 * 60 * 1000) {
      // More than 5 minutes left; no refresh needed.
      return false;
    }

    const task = (async () => {
      try {
        const params = new SvelteURLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);

        const response = await fetch(API_ENDPOINT + "/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          console.warn("Token refresh failed", response.status, result);
          // If unauthorized / invalid_grant -> logout to clear state
          if (response.status === 400 || response.status === 401) {
            this.logout();
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            await goto("/login?expired=1&redirect=" + encodeURIComponent(page.url.pathname + page.url.search));
          }
          return false;
        }

        if (result?.access_token && result?.refresh_token && typeof result?.expires_in === "number") {
          this.login(null, result.access_token, result.refresh_token, result.expires_in);
          return true;
        }

        console.warn("Unexpected refresh response shape", result);
        return false;
      } catch (e) {
        console.error("Token refresh error", e);
        return false;
      } finally {
        this.currentRefresh = null;
      }
    })();

    this.currentRefresh = task;
    return task;
  }

  login(username: string | null, token: string, refreshToken: string, expiresIn: number): void {
    this.username = username || this.username; // keep prior username if blank provided
    this.token = token;
    this.refreshToken = refreshToken;
    this.expiresAt = Date.now() + expiresIn * 1000; // expiresIn is in seconds
    if (browser) {
      if (this.username) localStorage.setItem("username", this.username);
      localStorage.setItem("authToken", token);
      localStorage.setItem("authRefreshToken", refreshToken);
      localStorage.setItem("authTokenExpiresAt", this.expiresAt.toString());
      // also set as cookie for SSR requests
      document.cookie = "authToken=" + encodeURIComponent(token) + "; path=/; max-age=" + expiresIn;
    }
  }

  logout(): void {
    this.username = null;
    this.token = null;
    this.refreshToken = null;
    this.expiresAt = null;
    if (browser) {
      localStorage.removeItem("username");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authRefreshToken");
      localStorage.removeItem("authTokenExpiresAt");
      // clear cookie too
      document.cookie = "authToken=; path=/; max-age=0";
    }
  }

  getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authenticatedRoute: ServerLoad = async ({ cookies, url }) => {
  const authToken = cookies.get("authToken");

  if (!authToken) {
    const redirectPath = encodeURIComponent(url.pathname + url.search);
    redirect(303, `/login?redirect=${redirectPath}`);
  }

  return {};
};
