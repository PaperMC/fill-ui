<script lang="ts">
  import { RunedQuery, SHARED_QUERIES_CTX } from "$lib/api.svelte";
  import Header from "$lib/components/custom/header/Header.svelte";
  import { page } from "$app/state";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import LoadingSniffer from "$lib/components/LoadingSniffer.svelte";
  import VersionMetadata from "./VersionMetadata.svelte";
  import Build from "./Build.svelte";
  import { buildHeaderSegments } from "$lib/components/custom/header/index.svelte";
  import { type PageProps } from "./$types";
  import { Debounced } from "runed";

  let { data }: PageProps = $props();

  const versionQuery = RunedQuery.static(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query Version($projectKey: String!, $versionKey: String!) {
          project(key: $projectKey) {
            id
            version(key: $versionKey) {
              id
              key
              support {
                status
                end
              }
              java {
                version {
                  minimum
                }
                flags {
                  recommended
                }
              }
              family {
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
            }
          }
        }
      `),
      variables: {
        projectKey: page.params.project ?? "",
        versionKey: page.params.version ?? "",
      },
    }),
  );

  let version = $derived(versionQuery.current?.project?.version ?? null);

  // Separate builds query so builds load independently of metadata.
  function makeBuildsQuery(start?: string) {
    return queryStore({
      client: getContextClient(),
      query: graphql(`
        query VersionBuilds($projectKey: String!, $versionKey: String!, $after: String) {
          project(key: $projectKey) {
            id
            version(key: $versionKey) {
              id
              builds(first: 25, after: $after, orderBy: { direction: DESC }) @_relayPagination {
                edges {
                  node {
                    id
                    number
                    channel
                    createdAt
                    downloads {
                      name
                      size
                      url
                      checksums {
                        sha256
                      }
                    }
                    commits {
                      sha
                      message
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
              }
            }
          }
        }
      `),
      variables: {
        projectKey: page.params.project ?? "",
        versionKey: page.params.version ?? "",
        after: start,
      },
      requestPolicy: "cache-and-network",
    });
  }

  let startCursor: string | undefined = $state();
  let buildsQueryStore = $derived(makeBuildsQuery(startCursor));
  const buildsQuery = new RunedQuery(() => buildsQueryStore);
  let buildsLoadingDebounced = new Debounced(() => buildsQuery.loading, 100);
  $effect(() => {
    if (buildsQuery.current?.project?.version?.builds?.pageInfo?.hasNextPage) {
      startCursor = buildsQuery.current?.project?.version?.builds?.pageInfo?.endCursor ?? undefined;
    }
  });

  let builds = $derived(buildsQuery.current?.project?.version?.builds?.edges?.map((e) => e?.node).filter((n) => n != null) ?? []);

  let linkedBuildParam = $derived(page.url.searchParams.get("build") ?? null);
  let linkedBuildNumber = $derived(linkedBuildParam ? parseInt(linkedBuildParam) : null);

  const sharedQueries = SHARED_QUERIES_CTX.get();
  let projectName = $derived(data.preloadedVersion?.project?.name || sharedQueries.projectNameOrFallback(page.params.project));
</script>

<svelte:head>
  <title>{projectName} Version {page.params.version} - Fill</title>
  {#if data.preloadedVersion !== undefined}
    {@const desc = `Details and downloads for version ${data.preloadedVersion.project?.version?.key} of ${projectName}.`}
    <meta name="description" content={desc} />
    <meta property="og:title" content="{projectName} Version {data.preloadedVersion.project?.version?.key} - Fill" />
    <meta property="og:description" content={desc} />
  {/if}
</svelte:head>

<div class="space-y-8">
  <Header breadcrumbs={buildHeaderSegments(sharedQueries, page.params.project, version?.family.key, page.params.version)} />
  <div class="space-y-8">
    {#if versionQuery.loading}
      <section class="space-y-4">
        <h2 class="flex items-center text-lg font-medium">Metadata</h2>
        <LoadingSniffer text="Loading version…" />
      </section>
    {:else if versionQuery.error}
      <section class="space-y-4">
        <h2 class="flex items-center text-lg font-medium">Metadata</h2>
        <div class="text-sm text-red-600">{versionQuery.error.message}</div>
      </section>
    {:else if version}
      <VersionMetadata {version} />
    {:else}
      <p class="text-sm text-neutral-500">Version not found.</p>
    {/if}
    <section class="space-y-4">
      <h2 class="flex items-center gap-2 text-lg font-medium">Builds</h2>
      {#if buildsQuery.error}
        <div class="text-sm text-red-600">{buildsQuery.error.message}</div>
      {:else if !buildsLoadingDebounced.current && builds.length === 0}
        <p class="text-sm text-neutral-500">No builds found.</p>
      {/if}
      {#if !buildsQuery.error}
        <ul class="space-y-2">
          {#each builds as b (b.number)}
            <Build build={b} linked={linkedBuildNumber === b.number} />
          {/each}
        </ul>
      {/if}
      {#if buildsLoadingDebounced.current}
        <LoadingSniffer text="Loading builds…" />
      {/if}
    </section>
  </div>
</div>
