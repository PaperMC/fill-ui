<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Input from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  interface Props {
    minJavaOverride?: number;
    familyMinJava: number;
    label: string;
  }

  let { minJavaOverride = $bindable(), familyMinJava, label }: Props = $props();
  const uid = $props.id();
  const inputId = `min-java-override-${uid}`;
</script>

<Label for={inputId}>{label}</Label>
<div class="flex items-center gap-1">
  <Input.Root id={inputId} type="number" min="1" step="1" bind:value={minJavaOverride} placeholder="Family: {familyMinJava}"></Input.Root>
  <Button
    type="button"
    variant="secondary"
    size="sm"
    onclick={() => {
      minJavaOverride = familyMinJava;
    }}><span class="iconify lucide--copy"></span>Copy Family</Button
  >
  <Button
    type="button"
    variant="destructive"
    size="icon"
    class="size-8"
    onclick={() => {
      minJavaOverride = undefined;
    }}><span class="iconify lucide--trash"></span></Button
  >
</div>
