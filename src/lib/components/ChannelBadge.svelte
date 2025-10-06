<script lang="ts">
  import type { BuildChannel } from "$lib/gql/graphql";

  const { channel } = $props<{ channel: BuildChannel }>();

  function classes(ch: BuildChannel): string {
    switch (ch) {
      case "ALPHA": // red
        return "bg-[#d32f2f]/15 text-[#b71c1c] border-[#d32f2f]/40 dark:bg-[#d32f2f]/10 dark:text-[#d32f2f] dark:border-[#d32f2f]/50";
      case "BETA": // yellow
        return "bg-[#f9a825]/15 text-[#f57f17] border-[#f9a825]/40 dark:bg-[#f9a825]/10 dark:text-[#f9a825] dark:border-[#f9a825]/50";
      case "STABLE": // blue
        return "bg-[#42a5f5]/15 text-[#0d47a1] border-[#42a5f5]/40 dark:bg-[#42a5f5]/10 dark:text-[#42a5f5] dark:border-[#42a5f5]/50";
      case "RECOMMENDED": // green
        return "bg-[#66bb6a]/15 text-[#1b5e20] border-[#66bb6a]/40 dark:bg-[#66bb6a]/10 dark:text-[#66bb6a] dark:border-[#66bb6a]/50";
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
