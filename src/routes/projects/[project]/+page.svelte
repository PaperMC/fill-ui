<script lang="ts">
  import { RunedQuery } from "$lib/api.svelte";
  import Header from "$lib/components/Header.svelte";
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import LoadingGif from "$lib/components/LoadingGif.svelte";

  const familiesQuery = new RunedQuery(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query ProjectFamilies($id: String!) {
          project(id: $id) {
            families {
              id
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
</script>

<svelte:head>
  <title>{page.params.project} - Fill</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6">
  <Header project={page.params.project} />

  <section class="space-y-4">
    <div class="flex items-center gap-2">
      <h2 class="flex items-center text-lg font-medium">Families</h2>
      <Button size="icon" class="size-6" href="/projects/{page.params.project}/family/new">
        <span class="iconify size-4 lucide--plus"></span>
      </Button>
    </div>
    {#if familiesQuery.loading}
      <LoadingGif text="Loading families…" />
    {:else if familiesQuery.error}
      <div class="text-sm text-red-600">{familiesQuery.error.message}</div>
    {:else if families.length === 0}
      <p class="text-sm text-neutral-500">No families found for project "{page.params.project}".</p>
    {:else}
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each families as family (family.id)}
          <li>
            <Button class="w-full justify-between" variant="outline" href={`/projects/${page.params.project}/family/${family.id}`}>
              <h3 class="text-sm font-medium">{family.id}</h3>
            </Button>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>
