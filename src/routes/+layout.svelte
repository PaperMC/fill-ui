<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.ico";
  import favicon32x from "$lib/assets/favicon-32x32.png";
  import favicon16x from "$lib/assets/favicon-16x16.png";
  import { Client, cacheExchange, fetchExchange, setContextClient } from "@urql/svelte";
  import { API_ENDPOINT } from "$lib/api.svelte";
  import { AUTH_CTX, AuthHolder } from "$lib/auth.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { ModeWatcher } from "mode-watcher";

  let { children } = $props();

  const auth = new AuthHolder();
  AUTH_CTX.set(auth);

  const client = new Client({
    url: API_ENDPOINT + "/graphql",
    exchanges: [cacheExchange, fetchExchange],
    preferGetMethod: false,
    fetchOptions: () => {
      return {
        headers: auth.getAuthHeaders(),
      };
    },
  });
  setContextClient(client);

  function forceLogin() {
    if (auth.getUsername() === null && !page.url.pathname.startsWith("/login")) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      goto(`/login?redirect=${encodeURIComponent(page.url.pathname + page.url.search)}`);
      return true;
    }
    return false;
  }

  onMount(() => {
    forceLogin();
    auth.tryRefreshToken();
    const intervalId = setInterval(() => {
      auth.tryRefreshToken();
    }, 45 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="icon" type="image/png" sizes="32x32" href={favicon32x} />
  <link rel="icon" type="image/png" sizes="16x16" href={favicon16x} />
</svelte:head>

<ModeWatcher />
{@render children?.()}
