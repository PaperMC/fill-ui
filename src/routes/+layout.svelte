<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.ico";
  import favicon32x from "$lib/assets/favicon-32x32.png";
  import favicon16x from "$lib/assets/favicon-16x16.png";
  import snifferWalk from "$lib/assets/Sniffer_walk_pixel_art.gif";
  import { Client, fetchExchange, setContextClient } from "@urql/svelte";
  import { cacheExchange, type Cache } from "@urql/exchange-graphcache";
  import { relayPagination } from "@urql/exchange-graphcache/extras";
  import { API_ENDPOINT } from "$lib/api-endpoint";
  import { SHARED_QUERIES_CTX, SharedQueries } from "$lib/api.svelte";
  import { AUTH_CTX, AuthHolder } from "$lib/auth.svelte";
  import { onMount } from "svelte";
  import { ModeWatcher } from "mode-watcher";
  import { page } from "$app/state";
  import { type LayoutProps } from "./$types";
  import Footer from "./Footer.svelte";
  import { createAppHydrationScope } from "$lib/hydration-scope";
  import { Toaster } from "$lib/components/ui/sonner";

  let { children, data }: LayoutProps = $props();

  createAppHydrationScope();

  type DeleteInput = { input: { project: string; key: string } };

  // Graphcache doesn't remove deleted entities, so drop them and any project-level lists that may reference them.
  function invalidateDeleted(cache: Cache, projectKey: string, field: "family" | "version", key: string, listField: "families" | "versions") {
    const project = cache.resolve("Query", "project", { key: projectKey }) as string | null;
    if (!project) return;
    const entity = cache.resolve(project, field, { key }) as string | null;
    if (entity) cache.invalidate(entity);
    for (const f of cache.inspectFields(project)) {
      if (f.fieldName === listField) cache.invalidate(project, f.fieldName, f.arguments);
    }
  }

  const auth = new AuthHolder();
  AUTH_CTX.set(auth);

  const client = new Client({
    url: API_ENDPOINT + "/graphql",
    exchanges: [
      cacheExchange({
        directives: {
          relayPagination: (options) => relayPagination({ ...options }),
        },
        keys: {
          Commit: () => null,
          Checksums: () => null,
          Download: () => null,
          Java: () => null,
          JavaFlags: () => null,
          JavaVersion: () => null,
          Support: () => null,
        },
        updates: {
          Mutation: {
            deleteFamily: (result, args, cache) => {
              const { input } = args as DeleteInput;
              if ((result.deleteFamily as { ok?: boolean } | null)?.ok) invalidateDeleted(cache, input.project, "family", input.key, "families");
            },
            deleteVersion: (result, args, cache) => {
              const { input } = args as DeleteInput;
              if ((result.deleteVersion as { ok?: boolean } | null)?.ok) invalidateDeleted(cache, input.project, "version", input.key, "versions");
            },
          },
        },
      }),
      fetchExchange,
    ],
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
<Toaster />
<div class="mx-auto flex min-h-svh max-w-5xl flex-col">
  <div class="p-6">
    {@render children?.()}
  </div>
  <Footer />
</div>
