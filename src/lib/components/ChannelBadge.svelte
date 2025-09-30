<script lang="ts">
  import type { BuildChannel } from "$lib/gql/graphql";

  const { channel } = $props<{ channel: BuildChannel }>();

  function classes(ch: BuildChannel): string {
    switch (ch) {
      case "ALPHA":
        // alpha #ff6f61
        return "bg-[#ff6f61]/15 text-[#ff6f61] border-[#ff6f61]/40 dark:bg-[#ff6f61]/10 dark:text-[#ff6f61] dark:border-[#ff6f61]/50";
      case "BETA":
        // beta #fff176 (light) - use darker readable text in light mode
        return "bg-[#fff176]/40 text-[#9c8700] border-[#fff176]/60 dark:bg-[#fff176]/20 dark:text-[#fff176] dark:border-[#fff176]/50";
      case "STABLE":
        // stable #4fc3f7
        return "bg-[#4fc3f7]/20 text-[#0288d1] border-[#4fc3f7]/40 dark:bg-[#4fc3f7]/15 dark:text-[#4fc3f7] dark:border-[#4fc3f7]/50";
      case "RECOMMENDED":
        // recommended #4db6ac
        return "bg-[#4db6ac]/20 text-[#00695c] border-[#4db6ac]/40 dark:bg-[#4db6ac]/15 dark:text-[#4db6ac] dark:border-[#4db6ac]/50";
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
