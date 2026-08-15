<script lang="ts">
  import SingleLineCopyable from "$lib/components/custom/SingleLineCopyable.svelte";

  interface Props {
    flags?: string[];
    flagsString?: string;
  }

  let { flags, flagsString }: Props = $props();

  const textToCopy = $derived(flagsString ?? (flags ?? []).join(" "));
</script>

<SingleLineCopyable text={textToCopy} class="font-mono text-xs" />
