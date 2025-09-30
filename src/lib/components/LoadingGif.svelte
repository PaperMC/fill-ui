<script lang="ts">
  import snifferWalk from "$lib/assets/Sniffer_walk_pixel_art.gif";
  import sniffletPlop from "$lib/assets/Snifflet_plop_pixel_art.gif";
  import sniffletSniff from "$lib/assets/Snifflet_sniff_pixel_art.gif";

  interface Props {
    text?: string | undefined;
  }

  let { text }: Props = $props();

  const gifs = [snifferWalk, sniffletPlop, sniffletSniff];

  export function getRandomLoadingGif(): string {
    const randomIndex = Math.floor(Math.random() * gifs.length);
    return gifs[randomIndex];
  }
</script>

<div>
  <img src={getRandomLoadingGif()} alt="Loading..." class="pixel-art h-24 w-24" />
  {#if text}
    <div class="animate-pulse text-sm text-neutral-500">{text}</div>
  {/if}
</div>

<style>
  .pixel-art {
    image-rendering: pixelated;
    object-fit: contain;
  }
</style>
