<script lang="ts" module>
  import snifferWalkGif from "$lib/assets/Sniffer_walk_pixel_art.gif";
  import sniffletPlopGif from "$lib/assets/Snifflet_plop_pixel_art.gif";
  import sniffletSniffGif from "$lib/assets/Snifflet_sniff_pixel_art.gif";
  import snifferWalkWebm from "$lib/assets/Sniffer_walk_pixel_art.webm";
  import sniffletPlopWebm from "$lib/assets/Snifflet_plop_pixel_art.webm";
  import sniffletSniffWebm from "$lib/assets/Snifflet_sniff_pixel_art.webm";
  import snifferWalkMp4 from "$lib/assets/Sniffer_walk_pixel_art.mp4";
  import sniffletPlopMp4 from "$lib/assets/Snifflet_plop_pixel_art.mp4";
  import sniffletSniffMp4 from "$lib/assets/Snifflet_sniff_pixel_art.mp4";

  const sniffers = [
    {
      gif: snifferWalkGif,
      webm: snifferWalkWebm,
      mp4: snifferWalkMp4,
    },
    {
      gif: sniffletPlopGif,
      webm: sniffletPlopWebm,
      mp4: sniffletPlopMp4,
    },
    {
      gif: sniffletSniffGif,
      webm: sniffletSniffWebm,
      mp4: sniffletSniffMp4,
    },
  ];

  function getRandomLoadingSniffer(): { gif: string; webm: string; mp4: string } {
    const randomIndex = Math.floor(Math.random() * sniffers.length);
    return sniffers[randomIndex];
  }
</script>

<script lang="ts">
  interface Props {
    text?: string | undefined;
  }

  let { text }: Props = $props();

  const randomLoadingSniffer = getRandomLoadingSniffer();
</script>

<div>
  <video autoplay loop muted playsinline class="h-24 w-24">
    <source src={randomLoadingSniffer.webm} type="video/webm" />
    <source src={randomLoadingSniffer.mp4} type="video/mp4" />
  </video>
  {#if text}
    <div class="animate-pulse text-sm text-neutral-500">{text}</div>
  {/if}
</div>
