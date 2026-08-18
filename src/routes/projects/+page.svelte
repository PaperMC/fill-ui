<script lang="ts">
  import { SHARED_QUERIES_CTX } from "$lib/api.svelte";
  import Header from "$lib/components/custom/header/Header.svelte";
  import CardLink from "$lib/components/custom/CardLink.svelte";
  import { resolve } from "$app/paths";
  import * as Alert from "$lib/components/ui/alert";
  import LoadingSniffer from "$lib/components/LoadingSniffer.svelte";
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

<div class="space-y-8">
  <Header breadcrumbs={[projectsHeaderSegment]} />

  <section class="space-y-4">
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#if sharedQueries.projects.loading}
        <LoadingSniffer text="Loading projects…" />
      {:else if sharedQueries.projects.error}
        <Alert.Root variant="destructive">
          <Alert.Description>Error loading projects: {sharedQueries.projects.error.message}</Alert.Description>
        </Alert.Root>
      {:else if safeProjects.length === 0}
        <div class="text-sm text-muted-foreground">No projects found.</div>
      {:else}
        {#each safeProjects as project (project.key)}
          <li>
            <CardLink href={resolve("/projects/[project]", { project: project.key })}>{project.name}</CardLink>
          </li>
        {/each}
      {/if}
    </ul>
  </section>
</div>
