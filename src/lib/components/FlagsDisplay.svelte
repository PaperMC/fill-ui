<script lang="ts">
  import CopyToClipboard from "$lib/components/custom/CopyToClipboard.svelte";

  interface Props {
    flags?: string[];
    flagsString?: string;
  }

  let { flags, flagsString }: Props = $props();

  const textToCopy = $derived(flagsString ?? (flags ?? []).join(" "));
</script>

<div class="relative">
  <pre class="rounded-md bg-neutral-100 p-2 pr-8 font-mono text-xs dark:bg-neutral-800"><code class="block overflow-x-auto">{textToCopy}</code></pre>
  <CopyToClipboard text={textToCopy} class="absolute top-1 right-1 " />
</div>
