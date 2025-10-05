<script lang="ts">
  import { RunedQuery } from "$lib/api.svelte";
  import Header from "$lib/components/custom/header/Header.svelte";
  import { Button } from "$lib/components/ui/button";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import LoadingGif from "$lib/components/LoadingGif.svelte";
  import { projectsHeaderSegment } from "$lib/components/custom/header/index.svelte";

  const projects = new RunedQuery(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query AllProjects {
          projects {
            id
          }
        }
      `),
    }),
  );

  let projectIds = $derived(
    projects.current?.projects
      ?.map((o) => {
        return o?.id;
      })
      ?.filter((o) => o != null) || [],
  );
</script>

<svelte:head>
  <title>Projects - Fill</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6">
  <Header breadcrumbs={[projectsHeaderSegment]} />

  <section class="space-y-4">
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#if projects.loading}
        <LoadingGif text="Loading projects…" />
      {:else if projects.error}
        <div class="text-sm text-red-600">Error loading projects: {projects.error.message}</div>
      {:else if projectIds.length === 0}
        <div class="text-sm text-neutral-500">No projects found.</div>
      {:else}
        {#each projectIds as project (project)}
          <li>
            <Button class="w-full justify-between" variant="outline" href={`/projects/${project}`}>
              <h3 class="text-sm font-medium">{project}</h3>
            </Button>
          </li>
        {/each}
      {/if}
    </ul>
  </section>
</div>
