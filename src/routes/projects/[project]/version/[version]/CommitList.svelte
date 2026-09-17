<script lang="ts">
  import type { Build } from "$lib/gql/graphql";
  import type { GitRepoLike } from "$lib/utils/git";
  import Commit from "./Commit.svelte";

  interface Props {
    build: Build;
    gitRepository?: GitRepoLike | null;
  }

  let { build, gitRepository }: Props = $props();
</script>

{#if build.commits.length !== 0}
  <div class="space-y-2">
    {#each build.commits as commit (commit.sha)}
      <Commit {commit} {gitRepository} />
    {/each}
  </div>
{/if}
