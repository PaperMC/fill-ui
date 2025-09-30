<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";

  interface Props {
    flags?: string[];
    flagsString?: string;
  }

  let { flags, flagsString }: Props = $props();

  let copied = $state(false);

  const textToCopy = $derived(flagsString ?? (flags ?? []).join(" "));

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(textToCopy);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }
</script>

<div class="relative">
  <pre class="rounded-md bg-neutral-100 p-2 pr-8 font-mono text-xs dark:bg-neutral-800"><code class="block overflow-x-auto">{textToCopy}</code></pre>
  <Button size="icon" variant="ghost" class="absolute top-1 right-1 size-6" onclick={copyToClipboard} title={copied ? "Copied!" : "Copy to clipboard"}>
    {#if copied}
      <span class="iconify lucide--check"></span>
    {:else}
      <span class="iconify lucide--copy"></span>
    {/if}
  </Button>
</div>
