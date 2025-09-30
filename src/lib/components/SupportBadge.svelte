<script lang="ts">
  import type { Support, SupportStatus } from "$lib/gql/graphql";
  import { formatDateTime } from "$lib/utils/date";

  const { support, showEnd = false } = $props<{ support: Support; showEnd?: boolean }>();

  function classes(status: SupportStatus): string {
    switch (status) {
      case "SUPPORTED":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-300 dark:border-green-700";
      case "DEPRECATED":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700";
      case "UNSUPPORTED":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-700";
      default:
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700";
    }
  }
</script>

<span class="inline-flex items-center gap-2">
  <span class={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium tracking-wide uppercase ${classes(support.status)}`}
    >{support.status}</span
  >
  {#if showEnd && support.end}
    <span class="text-xs text-neutral-500">{support.status === "UNSUPPORTED" ? "since" : "until"} {formatDateTime(support.end)}</span>
  {/if}
</span>
