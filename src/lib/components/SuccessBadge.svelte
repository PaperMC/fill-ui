<script lang="ts">
  import type { Snippet } from "svelte";
  import { CheckIcon } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";

  let { children }: { children?: Snippet } = $props();
</script>

<Badge
  variant="outline"
  class="border-green-300 bg-green-100 tracking-wide text-green-700 uppercase dark:border-green-700 dark:bg-green-900/40 dark:text-green-300"
>
  <CheckIcon data-icon="inline-start" />
  {@render children?.()}
</Badge>
