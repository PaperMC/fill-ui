<script lang="ts">
  import type { Commit } from "$lib/gql/graphql";
  import { Button } from "$lib/components/ui/button";
  import { slide } from "svelte/transition";

  interface Props {
    commit: Commit;
  }

  let { commit }: Props = $props();

  let collapsed = $state(true);
  let commitLines = $derived(commit.message.split(/\r?\n/));
  let hasOneLine = $derived(commitLines.filter((l) => l.length !== 0).length === 1);
  let firstLine = $derived(commitLines[0] ?? "");
  let remainingLines = $derived(commitLines.slice(1).join("\n"));
</script>

<div class="space-y-0.5">
  <div class="truncate font-mono text-xs text-neutral-500">{commit.sha}</div>
  {#if hasOneLine}
    <div class="ps-2 text-sm wrap-break-word">{firstLine}</div>
  {:else}
    <div class="flex items-center gap-1">
      {#if collapsed}
        <div class="truncate ps-2 text-sm">{firstLine}</div>
      {:else}
        <div class="ps-2 text-sm wrap-break-word">{firstLine}</div>
      {/if}
      <Button variant="ghost" size="icon" class="size-6" onclick={() => (collapsed = !collapsed)} aria-label="Expand/collapse commit message">
        {#if collapsed}
          <span class="iconify lucide--unfold-vertical"></span>
        {:else}
          <span class="iconify lucide--fold-vertical"></span>
        {/if}
      </Button>
    </div>
  {/if}
  {#if !collapsed}
    <div transition:slide class="ps-2 text-sm wrap-break-word whitespace-pre-line">{remainingLines}</div>
  {/if}
</div>
