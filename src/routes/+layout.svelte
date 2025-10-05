<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.ico";
  import favicon32x from "$lib/assets/favicon-32x32.png";
  import favicon16x from "$lib/assets/favicon-16x16.png";
  import snifferWalk from "$lib/assets/Sniffer_walk_pixel_art.gif";
  import { Client, cacheExchange, fetchExchange, setContextClient } from "@urql/svelte";
  import { API_ENDPOINT, SHARED_QUERIES_CTX, SharedQueries } from "$lib/api.svelte";
  import { AUTH_CTX, AuthHolder } from "$lib/auth.svelte";
  import { onMount } from "svelte";
  import { ModeWatcher } from "mode-watcher";
  import { page } from "$app/state";
  import { type LayoutProps } from "./$types";

  let { children, data }: LayoutProps = $props();

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

  SHARED_QUERIES_CTX.set(new SharedQueries());

  onMount(() => {
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
  <title>Fill</title>
  <link rel="icon" href={favicon} />
  <link rel="icon" type="image/png" sizes="32x32" href={favicon32x} />
  <link rel="icon" type="image/png" sizes="16x16" href={favicon16x} />
  {#if data.shouldSSROpenGraph}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={page.url.href} />
    <meta property="og:image" content={snifferWalk} />
  {/if}
</svelte:head>

<ModeWatcher />
{@render children?.()}
