<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import * as Input from "$lib/components/ui/input";

  interface Props {
    flagsOverride?: string;
    familyFlags: string;
  }

  let { flagsOverride = $bindable(), familyFlags }: Props = $props();
  const uid = $props.id();
  const inputId = `flags-override-${uid}`;
</script>

<Label for={inputId}>Recommended JVM Flags Override (space separated)</Label>
<div class="flex items-center gap-1">
  <Input.Root id={inputId} bind:value={flagsOverride} placeholder="Family: {familyFlags.length === 0 ? 'None' : familyFlags}"></Input.Root>
  <Button
    type="button"
    variant="secondary"
    size="sm"
    onclick={() => {
      flagsOverride = familyFlags;
    }}><span class="iconify lucide--copy"></span>Copy Family</Button
  >
  <Button
    type="button"
    variant="destructive"
    size="icon"
    class="size-8"
    onclick={() => {
      flagsOverride = undefined;
    }}><span class="iconify lucide--trash"></span></Button
  >
</div>
