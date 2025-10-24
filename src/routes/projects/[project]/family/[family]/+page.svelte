<script lang="ts">
  import { RunedQuery, SHARED_QUERIES_CTX } from "$lib/api.svelte";
  import SupportBadge from "$lib/components/SupportBadge.svelte";
  import Header from "$lib/components/custom/header/Header.svelte";
  import { Button } from "$lib/components/ui/button";
  import { page } from "$app/state";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import LoadingGif from "$lib/components/LoadingGif.svelte";
  import FamilyMetadata from "./FamilyMetadata.svelte";
  import { AUTH_CTX } from "$lib/auth.svelte";
  import { buildHeaderSegments } from "$lib/components/custom/header/index.svelte";
  import { type PageProps } from "./$types";

  let { data }: PageProps = $props();

  const auth = AUTH_CTX.get();

  const familyQuery = RunedQuery.static(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query Family($project: String!, $id: String!) {
          project(key: $project) {
            id
            family(key: $id) {
              id
              key
              java {
                version {
                  minimum
                }
                flags {
                  recommended
                }
              }
            }
            versions(filterBy: { familyKey: $id }, first: 100) {
              edges {
                node {
                  id
                  key
                  family {
                    id
                    key
                  }
                  support {
                    status
                    end
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `),
      variables: {
        project: page.params.project ?? "",
        id: page.params.family ?? "",
      },
    }),
  );

  let family = $derived(familyQuery.current?.project?.family ?? null);
  let versions = $derived(familyQuery.current?.project?.versions?.edges?.map((e) => e?.node).filter((v): v is NonNullable<typeof v> => v != null) ?? []);
  const sharedQueries = SHARED_QUERIES_CTX.get();
  let projectName = $derived(data.preloadedFamily?.project?.name || sharedQueries.projectNameOrFallback(page.params.project));
</script>

<svelte:head>
  <title>{projectName} Family {page.params.family} - Fill</title>
  {#if data.preloadedFamily !== undefined}
    {@const desc = `Details and versions for family ${data.preloadedFamily.project?.family?.key} of ${projectName}.`}
    <meta name="description" content={desc} />
    <meta property="og:title" content="{projectName} Family {data.preloadedFamily.project?.family?.key} - Fill" />
    <meta property="og:description" content={desc} />
  {/if}
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6">
  <Header breadcrumbs={buildHeaderSegments(sharedQueries, page.params.project, page.params.family)} />
  {#if familyQuery.loading}
    <LoadingGif text="Loading family…" />
  {:else if familyQuery.error}
    <div class="text-sm text-red-600">{familyQuery.error.message}</div>
  {:else if !family}
    <p class="text-sm text-neutral-500">Family not found.</p>
  {:else}
    <div class="space-y-8">
      <FamilyMetadata {family} />

      <section class="space-y-4">
        <div class="flex items-center gap-2">
          <h2 class="flex items-center text-lg font-medium">Versions</h2>
          {#if auth.getUsername()}
            <Button size="icon" class="size-6" href="/projects/{page.params.project}/version/new?family={encodeURIComponent(page.params.family ?? '')}">
              <span class="iconify size-4 lucide--plus"></span>
            </Button>
          {/if}
        </div>
        {#if versions.length > 0}
          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {#each versions as version (version.key)}
              <li>
                <Button variant="outline" class="w-full" href={`/projects/${page.params.project}/version/${version.key}`}>
                  <div class="flex w-full items-center justify-between gap-2">
                    <h3 class="text-sm font-medium">{version.key}</h3>
                    <SupportBadge support={version.support} />
                  </div>
                </Button>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-sm text-neutral-500">No versions found for this family.</p>
        {/if}
      </section>
    </div>
  {/if}
</div>
