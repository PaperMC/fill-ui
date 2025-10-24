<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { getContextClient, mutationStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import { page } from "$app/state";

  interface Props {
    buildNumber: number;
  }

  let { buildNumber }: Props = $props();

  const client = getContextClient();

  let promoting: boolean = $state(false);
  let open: boolean = $state(false);

  function promoteBuild(id: number) {
    if (promoting) return;
    promoting = true;
    const result = mutationStore({
      client,
      query: graphql(`
        mutation PromoteBuild($input: PromoteBuildInput!) {
          promoteBuild(input: $input) {
            version {
              id
            }
            build {
              id
              channel
            }
          }
        }
      `),
      variables: {
        input: {
          project: page.params.project!,
          version: page.params.version!,
          number: id,
        },
      },
    });
    result.subscribe(({ error, fetching }) => {
      if (!fetching) {
        promoting = false;
        if (error) {
          alert(`Error promoting build #${id}: ${error.message}`);
        }
      }
    });
  }
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Trigger>
    {#snippet child({ props })}
      <Button disabled={promoting} variant="secondary" size="sm" {...props}>
        {#if promoting}
          <span class="iconify animate-spin lucide--loader-2"></span>
          Promoting…
        {:else}
          <span class="iconify lucide--arrow-up"></span>
          Promote to Recommended
        {/if}
      </Button>
    {/snippet}
  </AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Promote Build to Recommended</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to promote build #{buildNumber} to recommended? This action cannot be undone.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action
          onclick={() => {
            open = false;
            promoteBuild(buildNumber);
          }}>Promote</AlertDialog.Action
        >
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
