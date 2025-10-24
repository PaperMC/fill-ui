<script lang="ts">
  import FlagsDisplay from "$lib/components/FlagsDisplay.svelte";
  import type { Java } from "$lib/gql/graphql";

  type Family = {
    key: string;
    java: Java;
  };

  interface Props {
    family: Family;
  }

  let { family }: Props = $props();
</script>

<section class="space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="flex items-center text-lg font-medium">Metadata</h2>
  </div>
  <div class="space-y-2 rounded-lg border p-4">
    <h3 class="text-lg font-medium">General</h3>
    <div class="text-sm">
      <div class="font-medium">Family ID</div>
      <div class="mt-0.5 break-all">{family.key}</div>
    </div>

    <h3 class="mt-4 text-lg font-medium">Java</h3>
    <div class="text-sm">
      <div class="flex items-center gap-2 font-medium">Minimum Version</div>
      <div class="mt-0.5">{family.java.version.minimum}</div>
    </div>

    <div class="space-y-1 text-sm">
      <div class="flex items-center gap-2 font-medium">Recommended Flags</div>
      <FlagsDisplay flags={family.java.flags.recommended.length > 0 ? family.java.flags.recommended : ["None"]} />
    </div>
  </div>
</section>
