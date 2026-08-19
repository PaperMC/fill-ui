<script lang="ts">
  import { mode } from "mode-watcher";
  import { ElementSize } from "runed";
  import Header from "$lib/components/custom/header/Header.svelte";
  import { resolve } from "$app/paths";
  import { API_ENDPOINT } from "$lib/api.svelte";
  import scalarStyleUrl from "@scalar/api-reference/style.css?url";

  let container: HTMLDivElement | undefined = $state();
  let bar: HTMLDivElement | undefined = $state();
  let loading = $state(true);
  let failed = $state(false);

  // Scalar offsets its sticky sidebar by this, so it tracks the real bar height instead of a hardcoded guess.
  const barSize = new ElementSize(() => bar);

  // Scalar's stylesheet sets a global body background, so it is attached here and detached on unmount.
  $effect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = scalarStyleUrl;
    document.head.append(link);
    return () => {
      link.remove();
      document.body.classList.remove("dark-mode", "light-mode");
    };
  });

  $effect(() => {
    const target = container;
    if (!target) return;

    // Scalar resolves its color mode once during setup, so a theme change needs a fresh instance.
    const forceDarkModeState = mode.current === "dark" ? "dark" : "light";
    let reference: { destroy: () => void } | undefined;
    let destroyed = false;

    void (async () => {
      try {
        const { createApiReference } = await import("@scalar/api-reference");
        if (destroyed) return;
        reference = createApiReference(target, {
          url: API_ENDPOINT + "/openapi.yaml",
          forceDarkModeState,
          showDeveloperTools: "never",
        });
      } catch {
        failed = true;
      } finally {
        loading = false;
      }
    })();

    return () => {
      destroyed = true;
      reference?.destroy();
    };
  });
</script>

<svelte:head>
  <title>API docs - Fill</title>
</svelte:head>

<div class="flex flex-1 flex-col" style="--scalar-custom-header-height: {barSize.height}px">
  <div bind:this={bar} class="sticky top-0 z-20 border-b bg-background/80 px-6 py-4 backdrop-blur-md">
    <Header breadcrumbs={[{ label: "API docs", href: resolve("/docs") }]} />
  </div>

  {#if loading}
    <p class="flex flex-1 items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
      <span class="iconify animate-spin lucide--loader-2"></span>
      Loading API docs...
    </p>
  {:else if failed}
    <p class="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">Could not load the API docs. Reload the page to try again.</p>
  {/if}

  <div bind:this={container} class="flex-1"></div>
</div>

<style>
  /* Bridge Scalar's palette onto the app tokens so the embed does not read as a second product. */
  :global(body) {
    --scalar-font: var(--font-sans);
    --scalar-background-1: var(--background);
    --scalar-background-2: var(--card);
    --scalar-background-3: var(--secondary);
    --scalar-background-accent: color-mix(in oklab, var(--primary) 15%, transparent);
    --scalar-border-color: var(--border);
    --scalar-color-1: var(--foreground);
    --scalar-color-2: var(--muted-foreground);
    --scalar-color-3: var(--muted-foreground);
    --scalar-color-accent: var(--primary);
  }
</style>
