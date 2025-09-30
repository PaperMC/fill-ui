<script lang="ts">
  import { API_ENDPOINT, RunedQuery } from "$lib/api.svelte";
  import Header from "$lib/components/Header.svelte";
  import { page } from "$app/state";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import { Button } from "$lib/components/ui/button";
  import ChannelBadge from "$lib/components/ChannelBadge.svelte";
  import { formatDateTime } from "$lib/utils/date";
  import { BuildChannel } from "$lib/gql/graphql";
  import LoadingGif from "$lib/components/LoadingGif.svelte";
  import PromoteBuildButton from "$lib/components/PromoteBuildButton.svelte";
  import VersionMetadata from "./VersionMetadata.svelte";

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

  function formatBytes(bytes?: number | null): string {
    if (!bytes || bytes < 0) return "-";
    const units = ["B", "KB", "MB", "GB", "TB"] as const;
    let i = 0;
    let value = bytes;
    while (value >= 1024 && i < units.length - 1) {
      value /= 1024;
      i++;
    }
    return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
  }
</script>

<svelte:head>
  <title>{page.params.project} Version {page.params.version} - Fill</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6">
  <Header project={page.params.project} family={version?.family.id} version={page.params.version} />
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
              <li class="space-y-2 rounded-md border p-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex min-w-0 items-center gap-2">
                    <span class="font-mono text-sm">#{b.id}</span>
                    <ChannelBadge channel={b.channel} />
                    {#if b.time}<span class="truncate text-xs text-neutral-500">{formatDateTime(b.time)}</span>{/if}
                  </div>
                  <div class="flex items-center gap-2">
                    {#if b.channel !== BuildChannel.Recommended}
                      <PromoteBuildButton buildId={b.id} />
                    {/if}
                    <Button
                      href="{API_ENDPOINT}/v3/projects/{page.params.project}/versions/{page.params.version}/builds/{b.id}"
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="link"
                    >
                      <span class="iconify lucide--external-link"></span>
                      API
                    </Button>
                  </div>
                </div>
                {#if b.downloads && b.downloads.length > 0}
                  <div class="flex flex-wrap gap-2">
                    {#each b.downloads as d (d.name)}
                      <Button href={d.url} rel="noopener noreferrer" title={d.name} size="sm" variant="outline">
                        <span class="iconify lucide--download"></span>
                        <span class="font-mono">{d.name}</span>
                        {#if d.size}
                          <span
                            class="relative z-0 rounded border px-1 font-mono text-xs before:absolute before:inset-0 before:z-[-1] before:rounded before:bg-secondary"
                            >{formatBytes(d.size)}</span
                          >
                        {/if}
                      </Button>
                    {/each}
                  </div>
                {:else}
                  <div class="text-xs text-neutral-500">No downloads.</div>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
      </section>
    </div>
  {/if}
</div>
