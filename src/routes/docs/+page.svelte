<script lang="ts">
  import { mode } from "mode-watcher";
  import Header from "$lib/components/custom/header/Header.svelte";
  import { resolve } from "$app/paths";
  import scalarStyleUrl from "@scalar/api-reference/style.css?url";

  let container: HTMLDivElement | undefined = $state();
  let loading = $state(true);
  let failed = $state(false);

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
          url: resolve("/openapi.yaml"),
          forceDarkModeState,
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

<Header breadcrumbs={[{ label: "API docs", href: resolve("/docs") }]} />

{#if loading}
  <p class="flex items-center gap-2 p-6 text-sm text-muted-foreground">
    <span class="iconify animate-spin lucide--loader-2"></span>
    Loading API docs...
  </p>
{:else if failed}
  <p class="p-6 text-sm text-muted-foreground">Could not load the API docs. Reload the page to try again.</p>
{/if}

<div bind:this={container}></div>
