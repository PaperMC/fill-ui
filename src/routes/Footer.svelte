<script lang="ts">
  import Separator from "$lib/components/ui/separator/separator.svelte";
</script>

<footer class="mt-auto flex flex-col">
  <Separator />
  <div class="flex items-center justify-between px-6 py-6">
    <picture title="PaperMC">
      <source srcset="https://assets.papermc.io/brand/papermc_combination_mark_light.min.svg" media="(prefers-color-scheme: dark)" />
      <img src="https://assets.papermc.io/brand/papermc_combination_mark_dark.min.svg" alt="PaperMC Logo" class="h-12 w-auto" />
    </picture>
    <div>© The PaperMC Team</div>
  </div>
  <p class="px-6 pb-6 text-sm">
    This website is not an official Minecraft website and is not associated with Mojang Studios or Microsoft. All product and company names are trademarks or
    registered trademarks of their respective holders. Use of these names does not imply any affiliation or endorsement by them.
  </p>
</footer>
