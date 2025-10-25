<script lang="ts">
  import Separator from "$lib/components/ui/separator/separator.svelte";
</script>

<footer class="mt-auto flex flex-col">
  <Separator />
  <div class="flex items-center justify-between px-6 py-6">
    <a href="https://papermc.io" title="PaperMC" class="logo h-12 w-[calc(var(--spacing)*34.19)] bg-cover bg-center"></a>
    <div>© The PaperMC Team</div>
  </div>
  <p class="px-6 pb-6 text-sm">
    This website is not an official Minecraft website and is not associated with Mojang Studios or Microsoft. All product and company names are trademarks or
    registered trademarks of their respective holders. Use of these names does not imply any affiliation or endorsement by them.
  </p>
</footer>

<style>
  .logo {
    background-image: url("/papermc_combination_mark_dark.min.svg");
  }

  @media (prefers-color-scheme: dark) {
    .logo {
      background-image: url("/papermc_combination_mark_light.min.svg");
    }
  }
</style>
