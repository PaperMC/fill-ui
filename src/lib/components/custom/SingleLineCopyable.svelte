<script lang="ts">
  import CopyToClipboard from "$lib/components/custom/CopyToClipboard.svelte";
  import { cn } from "$lib/utils";
  import { ScrollState, useResizeObserver } from "runed";

  interface Props {
    text: string;
    copyLabel?: string;
    copiedLabel?: string;
    class?: string;
  }

  let { text, copyLabel, copiedLabel, class: className }: Props = $props();

  let scrollArea: HTMLElement | null = $state(null);
  const scrollState = new ScrollState({ element: () => scrollArea });

  useResizeObserver(
    () => scrollArea,
    () => scrollState.setArrivedState(),
  );

  function scrollContainer(node: HTMLElement) {
    scrollArea = node;
    return () => {
      scrollArea = null;
    };
  }
</script>

<div class={cn("flex max-w-full min-w-0 items-center gap-1", className)}>
  <div class="relative min-w-0 flex-1 overflow-hidden rounded-md">
    <code {@attach scrollContainer} class="block overflow-x-auto bg-secondary p-2 whitespace-nowrap">{text}</code>
    {#if !scrollState.arrived.left}
      <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-secondary to-transparent"></div>
    {/if}
    {#if !scrollState.arrived.right}
      <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-r from-transparent to-secondary"></div>
    {/if}
  </div>
  <CopyToClipboard variant="outline" size="icon-sm" {text} {copyLabel} {copiedLabel} class="shrink-0" />
</div>
