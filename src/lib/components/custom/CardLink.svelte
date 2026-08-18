<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ChevronRightIcon } from "@lucide/svelte";
  import type { Snippet } from "svelte";

  let { href, children }: { href: string; children: Snippet } = $props();
</script>

<Button {href} variant="outline" class="group h-auto w-full justify-between rounded-lg bg-card px-4 py-3.5 hover:border-primary/60 hover:bg-secondary">
  <h3 class="text-base font-medium">{@render children()}</h3>
  <ChevronRightIcon class="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
</Button>
