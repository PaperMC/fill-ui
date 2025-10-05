<script lang="ts">
  import { SHARED_QUERIES_CTX } from "$lib/api.svelte";
  import Header from "$lib/components/custom/header/Header.svelte";
  import { Button } from "$lib/components/ui/button";
  import LoadingGif from "$lib/components/LoadingGif.svelte";
  import { projectsHeaderSegment } from "$lib/components/custom/header/index.svelte";

  const sharedQueries = SHARED_QUERIES_CTX.get();

  let safeProjects = $derived.by(() => {
    if (sharedQueries.projects.error || sharedQueries.projects.loading) return [];
    return sharedQueries.projects.current?.projects?.filter((p) => p !== null) || [];
  });
</script>

<svelte:head>
  <title>Projects - Fill</title>
  <meta name="description" content="Browse all available projects." />
  <meta property="og:title" content="Projects - Fill" />
  <meta property="og:description" content="Browse all available projects." />
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6">
  <Header breadcrumbs={[projectsHeaderSegment]} />

  <section class="space-y-4">
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#if sharedQueries.projects.loading}
        <LoadingGif text="Loading projects…" />
      {:else if sharedQueries.projects.error}
        <div class="text-sm text-red-600">Error loading projects: {sharedQueries.projects.error.message}</div>
      {:else if safeProjects.length === 0}
        <div class="text-sm text-neutral-500">No projects found.</div>
      {:else}
        {#each safeProjects as project (project.id)}
          <li>
            <Button class="w-full justify-between" variant="outline" href={`/projects/${project.id}`}>
              <h3 class="text-sm font-medium">{project.name}</h3>
            </Button>
          </li>
        {/each}
      {/if}
    </ul>
  </section>
</div>
