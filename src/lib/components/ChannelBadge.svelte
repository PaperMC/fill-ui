<script lang="ts">
  import type { BuildChannel } from "$lib/gql/graphql";

  const { channel } = $props<{ channel: BuildChannel }>();

  function classes(ch: BuildChannel): string {
    switch (ch) {
      case "ALPHA": // red
        return "bg-[#ea5b6f]/5 text-[#ea5b6f] border-[#ea5b6f]/40 dark:bg-[#e42e47]/5 dark:text-[#e42e47] dark:border-[#e42e47]/50";
      case "BETA": // yellow
        return "bg-[#ffc859]/5 text-[#ffc859] border-[#ffc859]/40 dark:bg-[#f9da22]/5 dark:text-[#f9da22] dark:border-[#f9da22]/50";
      case "STABLE": // blue
        return "bg-[#2b7fff]/5 text-[#2b7fff] border-[#2b7fff]/40 dark:bg-[#2b7fff]/5 dark:text-[#2b7fff] dark:border-[#2b7fff]/50";
      case "RECOMMENDED": // green
        return "bg-[#4ecb8b]/5 text-[#4ecb8b] border-[#4ecb8b]/40 dark:bg-[#4ecb8b]/5 dark:text-[#4ecb8b] dark:border-[#4ecb8b]/50";
      default:
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700";
    }
  }

  function label(ch: BuildChannel): string {
    switch (ch) {
      case "ALPHA":
        return "Alpha";
      case "BETA":
        return "Beta";
      case "STABLE":
        return "Stable";
      case "RECOMMENDED":
        return "Recommended";
      default:
        return ch;
    }
  }
</script>

<span class={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium tracking-wide uppercase ${classes(channel)}`}>{label(channel)}</span
>
