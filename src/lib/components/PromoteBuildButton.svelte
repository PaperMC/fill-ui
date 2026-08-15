<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Alert from "$lib/components/ui/alert";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { getContextClient } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import { getOperationErrorMessage, getUnexpectedOperationResultMessage } from "$lib/operation-error";
  import { page } from "$app/state";

  interface Props {
    buildNumber: number;
  }

  let { buildNumber }: Props = $props();

  const client = getContextClient();

  let promoting: boolean = $state(false);
  let open: boolean = $state(false);
  let promotionError: string | null = $state(null);

  async function promoteBuild(id: number) {
    if (promoting) return;

    promotionError = null;
    promoting = true;
    try {
      const result = await client
        .mutation(
          graphql(`
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
          {
            input: {
              project: page.params.project!,
              version: page.params.version!,
              number: id,
            },
          },
        )
        .toPromise();
      const errorMessage = getOperationErrorMessage(result.error, `promote build #${id}`);
      if (errorMessage) {
        promotionError = errorMessage;
        return;
      }

      if (!result.data?.promoteBuild) {
        promotionError = getUnexpectedOperationResultMessage(`promote build #${id}`);
      }
    } catch (error) {
      promotionError = getUnexpectedOperationResultMessage(`promote build #${id}`, error);
    } finally {
      promoting = false;
    }
  }
</script>

{#if promotionError}
  <Alert.Root variant="destructive">
    <Alert.Description>{promotionError}</Alert.Description>
  </Alert.Root>
{/if}

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
