<script lang="ts">
  import { RunedQuery, SHARED_QUERIES_CTX } from "$lib/api.svelte";
  import Header from "$lib/components/custom/header/Header.svelte";
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import LoadingSniffer from "$lib/components/LoadingSniffer.svelte";
  import { AUTH_CTX } from "$lib/auth.svelte";
  import { buildHeaderSegments } from "$lib/components/custom/header/index.svelte";
  import { type PageProps } from "./$types";

  let { data }: PageProps = $props();

  const auth = AUTH_CTX.get();
  const sharedQueries = SHARED_QUERIES_CTX.get();

  const familiesQuery = RunedQuery.static(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query ProjectFamilies($id: String!) {
          project(key: $id) {
            id
            families {
              id
              key
            }
          }
        }
      `),
      variables: {
        id: page.params.project ?? "",
      },
    }),
  );

  let families = $derived(familiesQuery.current?.project?.families?.filter((family): family is NonNullable<typeof family> => family != null) || []);
  let projectName = $derived(data.preloadedProject?.project?.name || sharedQueries.projectNameOrFallback(page.params.project));
</script>

<svelte:head>
  <title>{projectName} - Fill</title>
  {#if data.preloadedProject !== undefined}
    {@const desc = `Version families for the ${projectName} project.`}
    <meta name="description" content={desc} />
    <meta property="og:title" content="{projectName} - Fill" />
    <meta property="og:description" content={desc} />
  {/if}
</svelte:head>

<div class="space-y-8">
  <Header breadcrumbs={buildHeaderSegments(sharedQueries, page.params.project)} />

  <section class="space-y-4">
    <div class="flex items-center gap-2">
      <h2 class="flex items-center text-lg font-medium">Families</h2>
      {#if auth.getUsername()}
        <Button size="icon-xs" href="/projects/{page.params.project}/family/new">
          <span class="iconify size-4 lucide--plus"></span>
        </Button>
      {/if}
    </div>
    {#if familiesQuery.loading}
      <LoadingSniffer text="Loading families…" />
    {:else if familiesQuery.error}
      <div class="text-destructive text-sm">{familiesQuery.error.message}</div>
    {:else if families.length === 0}
      <p class="text-muted-foreground text-sm">No families found for project "{projectName}".</p>
    {:else}
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each families as family (family.key)}
          <li>
            <Button class="w-full justify-between" variant="outline" href={`/projects/${page.params.project}/family/${family.key}`}>
              <h3 class="text-sm font-medium">{family.key}</h3>
            </Button>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>
