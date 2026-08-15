<script lang="ts">
  import type { Snippet } from "svelte";
  import { XIcon } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";

  let { children }: { children?: Snippet } = $props();
</script>

<Badge variant="outline" class="border-red-300 bg-red-100 tracking-wide text-red-700 uppercase dark:border-red-700 dark:bg-red-900/40 dark:text-red-300">
  <XIcon data-icon="inline-start" />
  {@render children?.()}
</Badge>
