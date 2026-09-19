<script lang="ts">
  import type { Build, GitForge } from "$lib/gql/graphql";
  import Commit from "./Commit.svelte";

  interface Props {
    build: Build;
    forge?: GitForge | null;
  }

  let { build, forge }: Props = $props();
</script>

{#if build.commits.length !== 0}
  <div class="space-y-2">
    {#each build.commits as commit (commit.sha)}
      <Commit {commit} {forge} />
    {/each}
  </div>
{/if}
