<script lang="ts">
  import Button, { type ButtonProps } from "$lib/components/ui/button/button.svelte";
  import { copyToClipboard } from "$lib/utils";
  import { mergeProps } from "bits-ui";

  interface Props extends ButtonProps {
    text: string;
  }

  let { text, ...restProps }: Props = $props();

  let copied = $state(false);

  async function copy() {
    await copyToClipboard(text, (v) => (copied = v));
  }

  let mergedProps = $derived(
    mergeProps(
      {
        variant: "ghost",
        size: "icon",
        class: "size-6",
      },
      restProps,
    ),
  );
</script>

<Button {...mergedProps} onclick={copy} title={copied ? "Copied!" : "Copy to clipboard"}>
  {#if copied}
    <span class="iconify lucide--check"></span>
  {:else}
    <span class="iconify lucide--copy"></span>
  {/if}
</Button>
