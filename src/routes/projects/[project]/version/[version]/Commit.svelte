<script lang="ts">
  import type { Commit } from "$lib/gql/graphql";
  import { Button } from "$lib/components/ui/button";
  import { slide } from "svelte/transition";
  import { page } from "$app/state";
  import { getCommitUrl, getForgeLabel, type GitRepoLike } from "$lib/utils/github";
  import CopyToClipboard from "$lib/components/custom/CopyToClipboard.svelte";

  interface Props {
    commit: Commit;
    projectKey?: string;
    gitRepository?: GitRepoLike | null;
  }

  let { commit, projectKey = page.params.project, gitRepository }: Props = $props();

  let collapsed = $state(true);
  let commitLines = $derived(commit.message.split(/\r?\n/));
  let hasOneLine = $derived(commitLines.filter((l) => l.length !== 0).length === 1);
  let firstLine = $derived(commitLines[0] ?? "");
  let remainingLines = $derived(commitLines.slice(1).join("\n"));

  let commitUrl = $derived(getCommitUrl(gitRepository, projectKey, commit.sha));
  let forgeLabel = $derived(getForgeLabel(gitRepository));
  let trimmedSha = $derived(commit.sha ? commit.sha.trim() : "");
  let shortSha = $derived(trimmedSha.slice(0, 7));
</script>

<div class="space-y-0.5">
  <div class="flex items-center gap-1 font-mono text-xs text-muted-foreground">
    {#if commitUrl && shortSha}
      <a
        href={commitUrl}
        target="_blank"
        rel="noopener noreferrer external"
        class="inline-flex items-center gap-1 underline-offset-4 hover:text-foreground hover:underline"
        title="View commit on {forgeLabel} ({trimmedSha})"
      >
        <span>{shortSha}</span>
        <span class="iconify size-3 lucide--external-link"></span>
      </a>
    {:else if shortSha}
      <span>{shortSha}</span>
    {/if}
    {#if trimmedSha}
      <CopyToClipboard text={trimmedSha} copyLabel="Copy full commit SHA" copiedLabel="Copied commit SHA!" />
    {/if}
  </div>
  {#if hasOneLine}
    <div class="ps-2 text-sm wrap-break-word">{firstLine}</div>
  {:else}
    <div class="flex items-center gap-1">
      {#if collapsed}
        <div class="truncate ps-2 text-sm">{firstLine}</div>
      {:else}
        <div class="ps-2 text-sm wrap-break-word">{firstLine}</div>
      {/if}
      <Button variant="ghost" size="icon-xs" onclick={() => (collapsed = !collapsed)} aria-label="Expand/collapse commit message">
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
