<script lang="ts">
  import Button, { type ButtonProps } from "$lib/components/ui/button/button.svelte";
  import { mergeProps } from "bits-ui";

  interface Props extends ButtonProps {
    text: string;
  }

  let { text, ...restProps }: Props = $props();

  let showCopied = $state(false);
  let stopShowCopied: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      showCopied = true;
      if (stopShowCopied) clearTimeout(stopShowCopied);
      stopShowCopied = setTimeout(() => {
        showCopied = false;
        stopShowCopied = undefined;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  let mergedProps = $derived(
    mergeProps(
      {
        variant: "ghost",
        size: "icon-xs",
      },
      restProps,
    ),
  );
</script>

<Button {...mergedProps} onclick={copy} title={showCopied ? "Copied!" : "Copy to clipboard"}>
  {#if showCopied}
    <span class="iconify lucide--check"></span>
  {:else}
    <span class="iconify lucide--copy"></span>
  {/if}
</Button>
