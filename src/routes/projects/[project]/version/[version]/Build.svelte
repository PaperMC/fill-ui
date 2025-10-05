<script lang="ts">
  import ChannelBadge from "$lib/components/ChannelBadge.svelte";
  import { formatDateTime } from "$lib/utils/date";
  import PromoteBuildButton from "$lib/components/PromoteBuildButton.svelte";
  import { Button } from "$lib/components/ui/button";
  import { API_ENDPOINT } from "$lib/api.svelte";
  import { page } from "$app/state";
  import { type Build, BuildChannel } from "$lib/gql/graphql";
  import { AUTH_CTX } from "$lib/auth.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { mergeProps } from "bits-ui";
  import CommitList from "./CommitList.svelte";
  import { pushState } from "$app/navigation";
  import { watch } from "runed";
  import CopyToClipboard from "$lib/components/custom/CopyToClipboard.svelte";

  interface Props {
    build: Build;
    linked: boolean;
  }

  let { build, linked }: Props = $props();

  const auth = AUTH_CTX.get();

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

  let button: HTMLElement | null = $state(null);
  watch(
    () => button,
    (btn, old) => {
      if (!old && btn && linked) {
        btn.focus();
        btn.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
  );
</script>

<li class="space-y-2 rounded-md border p-3">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <div class="flex min-w-0 items-center gap-2">
      <Button
        bind:ref={button}
        id="build-{build.id}"
        onclick={(e) => {
          e.preventDefault();
          // eslint-disable-next-line svelte/no-navigation-without-resolve
          pushState(`?build=${build.id}`, {});
          button?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
        href="?build={build.id}"
        variant="link"
        size="sm"
        class="h-6 px-0.5 font-mono text-sm">#{build.id}</Button
      >
      <ChannelBadge channel={build.channel} />
      {#if build.time}<span class="truncate text-xs text-neutral-500">{formatDateTime(build.time)}</span>{/if}
    </div>
    <div class="flex items-center gap-2">
      {#if auth.getUsername() && build.channel !== BuildChannel.Recommended}
        <PromoteBuildButton buildId={build.id} />
      {/if}
      <Button
        href="{API_ENDPOINT}/v3/projects/{page.params.project}/versions/{page.params.version}/builds/{build.id}"
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
  <CommitList {build} />
  {#if build.downloads && build.downloads.length > 0}
    <div class="flex flex-wrap gap-2 overflow-x-auto">
      {#each build.downloads as d (d.name)}
        <div class="flex items-center gap-1">
          <Button href={d.url} rel="noopener noreferrer" title={d.name} size="sm" variant="outline">
            <span class="iconify lucide--download"></span>
            <span class="font-mono">{d.name}</span>
            {#if d.size}
              <span class="relative z-0 rounded border px-1 font-mono text-xs before:absolute before:inset-0 before:z-[-1] before:rounded before:bg-secondary"
                >{formatBytes(d.size)}</span
              >
            {/if}
          </Button>
          <Popover.Root>
            <Popover.Trigger>
              {#snippet child({ props })}
                <Button title="Show checksums" variant="ghost" size="icon" {...mergeProps(props, { class: "size-6" })}>
                  <span class="iconify lucide--file-check"></span>
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content>
              <div class="leading-4 font-medium">Checksums</div>
              <div class="mb-2 text-sm">{d.name}</div>
              {#if d.checksums?.sha256}
                <div class="grid grid-cols-[auto_1fr] gap-x-2 text-xs break-all">
                  <div class="flex flex-col">
                    <span>SHA-256</span>
                    <CopyToClipboard text={d.checksums.sha256} />
                  </div>
                  <span class="relative z-0 p-0.5 font-mono before:absolute before:inset-0 before:z-[-1] before:rounded before:bg-secondary"
                    >{d.checksums.sha256}</span
                  >
                </div>
              {:else}
                <div class="text-xs text-neutral-500">No checksums available.</div>
              {/if}
            </Popover.Content>
          </Popover.Root>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-xs text-neutral-500">No downloads.</div>
  {/if}
</li>
