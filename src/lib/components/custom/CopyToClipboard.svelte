<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { copyToClipboard, type RestProps } from "$lib/utils";
  import { mergeProps } from "bits-ui";

  interface Props extends RestProps {
    text: string;
  }

  let { text, ...restProps }: Props = $props();

  let copied = $state(false);

  async function copy() {
    await copyToClipboard(text, (v) => (copied = v));
  }

  let mergedProps = $derived(
    mergeProps(restProps, {
      class: "size-6",
    }),
  );
</script>

<Button size="icon" variant="ghost" {...mergedProps} onclick={copy} title={copied ? "Copied!" : "Copy to clipboard"}>
  {#if copied}
    <span class="iconify lucide--check"></span>
  {:else}
    <span class="iconify lucide--copy"></span>
  {/if}
</Button>
