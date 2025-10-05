<script lang="ts">
  import type { Build } from "$lib/gql/graphql";
  import Commit from "./Commit.svelte";

  interface Props {
    build: Build;
  }

  let { build }: Props = $props();
</script>

{#if build.commits.length !== 0}
  <div class="space-y-2">
    {#each build.commits as commit (commit.sha)}
      <Commit {commit} />
    {/each}
  </div>
{/if}
