<script lang="ts">
  import { RunedQuery } from "$lib/api.svelte";
  import Header from "$lib/components/custom/header/Header.svelte";
  import { page } from "$app/state";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import LoadingGif from "$lib/components/LoadingGif.svelte";
  import VersionMetadata from "./VersionMetadata.svelte";
  import Build from "./Build.svelte";
  import { buildHeaderSegments } from "$lib/components/custom/header/index.svelte";

  const versionQuery = new RunedQuery(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query Version($project: String!, $id: String!) {
          project(id: $project) {
            version(id: $id) {
              id
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
        project: page.params.project ?? "",
        id: page.params.version ?? "",
      },
    }),
  );

  let version = $derived(versionQuery.current?.project?.version ?? null);

  // Separate builds query so builds load independently of metadata.
  const buildsQuery = new RunedQuery(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query VersionBuilds($project: String!, $id: String!) {
          project(id: $project) {
            version(id: $id) {
              builds {
                id
                time
                channel
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
          }
        }
      `),
      variables: {
        project: page.params.project ?? "",
        id: page.params.version ?? "",
      },
      requestPolicy: "cache-and-network",
    }),
  );

  let builds = $derived(buildsQuery.current?.project?.version?.builds ?? []);
  const safeBuilds = $derived(builds.filter((b): b is NonNullable<typeof b> => b != null));

  let linkedBuildParam = $derived(page.url.searchParams.get("build") ?? null);
  let linkedBuildNumber = $derived(linkedBuildParam ? parseInt(linkedBuildParam) : null);
</script>

<svelte:head>
  <title>{page.params.project} Version {page.params.version} - Fill</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6">
  <Header breadcrumbs={buildHeaderSegments(page.params.project, version?.family.id, page.params.version)} />
  {#if versionQuery.loading}
    <LoadingGif text="Loading version…" />
  {:else if versionQuery.error}
    <div class="text-sm text-red-600">{versionQuery.error.message}</div>
  {:else if !version}
    <p class="text-sm text-neutral-500">Version not found.</p>
  {:else}
    <div class="space-y-8">
      <VersionMetadata {version} />
      <section class="space-y-4">
        <h2 class="flex items-center gap-2 text-lg font-medium">Builds</h2>
        {#if buildsQuery.loading}
          <LoadingGif text="Loading builds…" />
        {:else if buildsQuery.error}
          <div class="text-sm text-red-600">{buildsQuery.error.message}</div>
        {:else if safeBuilds.length === 0}
          <p class="text-sm text-neutral-500">No builds found.</p>
        {:else}
          <ul class="space-y-2">
            {#each safeBuilds as b (b.id)}
              <Build build={b} linked={linkedBuildNumber === b.id} />
            {/each}
          </ul>
        {/if}
      </section>
    </div>
  {/if}
</div>
