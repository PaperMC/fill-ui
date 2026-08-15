<script lang="ts">
  import { onDestroy } from "svelte";
  import Button, { type ButtonProps } from "$lib/components/ui/button/button.svelte";
  import { mergeProps } from "bits-ui";
  import { toast } from "svelte-sonner";

  interface Props extends ButtonProps {
    text: string;
    copyLabel?: string;
    copiedLabel?: string;
  }

  let { text, copyLabel = "Copy to clipboard", copiedLabel = "Copied to clipboard", ...restProps }: Props = $props();

  let copyStatus: "idle" | "copied" | "failed" = $state("idle");
  let resetCopyStatus: ReturnType<typeof setTimeout> | undefined;

  onDestroy(() => {
    if (resetCopyStatus) clearTimeout(resetCopyStatus);
  });

  function setCopyStatus(status: typeof copyStatus) {
    copyStatus = status;
    if (resetCopyStatus) clearTimeout(resetCopyStatus);
    resetCopyStatus = setTimeout(() => {
      copyStatus = "idle";
      resetCopyStatus = undefined;
    }, 2000);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
    } catch (error) {
      console.error("Failed to copy:", error);
      setCopyStatus("failed");
      toast.error("Unable to copy to clipboard. Please try again.");
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

<Button
  {...mergedProps}
  onclick={copy}
  aria-label={copyStatus === "copied" ? copiedLabel : copyStatus === "failed" ? "Unable to copy to clipboard" : copyLabel}
  title={copyStatus === "copied" ? copiedLabel : copyStatus === "failed" ? "Unable to copy to clipboard" : copyLabel}
>
  {#if copyStatus === "copied"}
    <span class="iconify lucide--check"></span>
  {:else if copyStatus === "failed"}
    <span class="iconify lucide--x"></span>
  {:else}
    <span class="iconify lucide--copy"></span>
  {/if}
</Button>
