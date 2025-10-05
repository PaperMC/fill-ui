<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Input from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { API_ENDPOINT } from "$lib/api.svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { AUTH_CTX } from "$lib/auth.svelte";
  import { SvelteURLSearchParams } from "svelte/reactivity";

  let username: string = $state("");
  let password: string = $state("");
  let isSubmitting: boolean = $state(false);
  let errorMessage: string = $state("");

  let expired = $derived(page.url.searchParams.get("expired") === "1");
  let redirect = $derived(page.url.searchParams.get("redirect") || "/projects");

  const auth = AUTH_CTX.get();

  async function submitForm(e: Event) {
    e.preventDefault();

    if (!username || !password) {
      errorMessage = "Please fill in all required fields";
      return;
    }

    isSubmitting = true;
    errorMessage = "";

    try {
      const params = new SvelteURLSearchParams();
      params.append("grant_type", "password");
      params.append("username", username);
      params.append("password", password);

      const response = await fetch(API_ENDPOINT + "/auth/token", {
        method: "POST",
        body: params.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const result = await response.json();

      if (response.ok) {
        auth.login(username, result.access_token, result.refresh_token, result.expires_in);

        // eslint-disable-next-line svelte/no-navigation-without-resolve
        await goto(redirect);
      } else {
        errorMessage = result.message || "Invalid credentials";
      }
    } catch (error) {
      errorMessage = "Network error. Please try again.";
      console.error("Login error:", error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Login - Fill</title>
  <meta name="description" content="Log in to Fill for management access." />
  <meta property="og:title" content="Login - Fill" />
  <meta property="og:description" content="Log in to Fill for management access." />
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6">
  <header>
    <h1 class="text-3xl">Fill</h1>
    <h2 class="text-lg">Login</h2>
  </header>

  <form class="max-w-md space-y-4" onsubmit={submitForm}>
    {#if expired}
      <div class="rounded-md bg-yellow-100 px-3 py-2 text-sm text-yellow-800">Your session has expired. Please log in again.</div>
    {/if}
    {#if errorMessage}
      <div class="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
        {errorMessage}
      </div>
    {/if}

    <div class="space-y-2">
      <Label for="username-input">Username</Label>
      <Input.Root id="username-input" bind:value={username} required disabled={isSubmitting} autocomplete="username" />
    </div>

    <div class="space-y-2">
      <Label for="password-input">Password</Label>
      <Input.Root id="password-input" type="password" bind:value={password} required disabled={isSubmitting} autocomplete="current-password" />
    </div>

    <Button class="w-full" type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Signing in..." : "Sign in"}
    </Button>
  </form>
</div>
