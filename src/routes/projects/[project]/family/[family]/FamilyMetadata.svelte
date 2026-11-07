<script lang="ts">
  import FlagsDisplay from "$lib/components/FlagsDisplay.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Alert from "$lib/components/ui/alert";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import * as Card from "$lib/components/ui/card";
  import * as Input from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import type { Java } from "$lib/gql/graphql";
  import { splitFlags } from "$lib/utils";
  import { getContextClient } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import { getOperationErrorMessage, getUnexpectedOperationResultMessage } from "$lib/operation-error";
  import { page } from "$app/state";
  import { AUTH_CTX } from "$lib/auth.svelte";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  const auth = AUTH_CTX.get();

  type Family = {
    key: string;
    java: Java;
  };

  interface Props {
    family: Family;
    editMode?: boolean;
    deletable?: boolean;
  }

  let { family, editMode = $bindable(false), deletable = false }: Props = $props();

  interface EditState {
    minimum?: number;
    flags?: string;
  }
  let editState: EditState = $state({});

  function resetEditState() {
    editState = {
      minimum: family.java.version.minimum,
      flags: family.java.flags.recommended.join(" "),
    };
  }

  const client = getContextClient();
  let saving = $state(false);
  let saveError: string | null = $state(null);

  async function saveChanges() {
    if (saving) return;

    saveError = null;
    if (editState.minimum == null || !Number.isInteger(editState.minimum) || editState.minimum < 1) {
      saveError = "Set a valid minimum Java version.";
      return;
    }

    saving = true;
    try {
      const result = await client
        .mutation(
          graphql(`
            mutation UpdateFamily($input: UpdateFamilyInput!) {
              updateFamily(input: $input) {
                family {
                  id
                  key
                  java {
                    version {
                      minimum
                    }
                    flags {
                      recommended
                    }
                  }
                }
              }
            }
          `),
          {
            input: {
              project: page.params.project!,
              key: family.key,
              java: {
                version: {
                  minimum: editState.minimum,
                },
                flags: {
                  recommended: editState.flags ? splitFlags(editState.flags) : [],
                },
              },
            },
          },
        )
        .toPromise();
      const errorMessage = getOperationErrorMessage(result.error, "save the family metadata");
      if (errorMessage) {
        saveError = errorMessage;
        return;
      }

      if (!result.data?.updateFamily?.family) {
        saveError = getUnexpectedOperationResultMessage("save the family metadata");
        return;
      }

      editMode = false;
      resetEditState();
      toast.success("Family metadata saved.");
    } catch (error) {
      saveError = getUnexpectedOperationResultMessage("save the family metadata", error);
    } finally {
      saving = false;
    }
  }

  let deleteDialogOpen = $state(false);
  let deleting = $state(false);

  async function deleteFamily() {
    if (deleting) return;

    deleting = true;
    try {
      const result = await client
        .mutation(
          graphql(`
            mutation DeleteFamily($input: DeleteFamilyInput!) {
              deleteFamily(input: $input) {
                ok
              }
            }
          `),
          { input: { project: page.params.project!, key: family.key } },
        )
        .toPromise();
      const errorMessage = getOperationErrorMessage(result.error, "delete the family");
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }

      if (!result.data?.deleteFamily?.ok) {
        toast.error(getUnexpectedOperationResultMessage("delete the family"));
        return;
      }

      deleteDialogOpen = false;
      toast.success("Family deleted.");
      await goto(resolve("/projects/[project]", { project: page.params.project! }));
    } catch (error) {
      toast.error(getUnexpectedOperationResultMessage("delete the family", error));
    } finally {
      deleting = false;
    }
  }
</script>

<section class="space-y-4">
  <div class="flex items-center gap-2">
    <h2 class="flex items-center text-lg font-medium">Metadata</h2>
    {#if auth.getUsername()}
      <Button
        size="icon-xs"
        variant="ghost"
        disabled={editMode}
        onclick={() => {
          editMode = true;
          resetEditState();
        }}
        title={editMode ? "Editing metadata" : "Edit metadata"}
      >
        <span class="iconify size-4 lucide--pencil"></span>
      </Button>
      {#if deletable}
        <Button size="icon-xs" variant="ghost" class="text-destructive" disabled={editMode} onclick={() => (deleteDialogOpen = true)} title="Delete family">
          <span class="iconify size-4 lucide--trash"></span>
        </Button>
      {/if}
    {/if}
  </div>
  {#if saveError}
    <Alert.Root variant="destructive">
      <Alert.Description>{saveError}</Alert.Description>
    </Alert.Root>
  {/if}
  <Card.Root>
    <Card.Content class="space-y-2">
      <h3 class="text-lg font-medium">General</h3>
      <div class="text-sm">
        <div class="font-medium">Family ID</div>
        <div class="mt-0.5 break-all">{family.key}</div>
      </div>

      <h3 class="mt-4 text-lg font-medium">Java</h3>
      {#if editMode}
        <Label for="family-min-java-input">Minimum Version</Label>
        <Input.Root id="family-min-java-input" type="number" min="1" step="1" bind:value={editState.minimum} required />

        <Label for="family-flags-input">Recommended JVM Flags (space separated)</Label>
        <div class="flex items-center gap-1">
          <Input.Root id="family-flags-input" bind:value={editState.flags} />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            onclick={() => {
              editState.flags = undefined;
            }}
          >
            <span class="iconify lucide--trash"></span>
          </Button>
        </div>
      {:else}
        <div class="text-sm">
          <div class="flex items-center gap-2 font-medium">Minimum Version</div>
          <div class="mt-0.5">{family.java.version.minimum}</div>
        </div>

        <div class="space-y-1 text-sm">
          <div class="flex items-center gap-2 font-medium">Recommended Flags</div>
          <FlagsDisplay flags={family.java.flags.recommended.length > 0 ? family.java.flags.recommended : ["None"]} />
        </div>
      {/if}
    </Card.Content>
  </Card.Root>
  {#if editMode}
    <Button
      variant="destructive"
      onclick={() => {
        editMode = false;
        resetEditState();
      }}
      disabled={saving}
    >
      <span class="iconify lucide--x"></span>
      Cancel
    </Button>
    <Button disabled={saving} onclick={saveChanges}>
      {#if saving}
        <span class="iconify animate-spin lucide--loader-2"></span>
        Saving Changes…
      {:else}
        <span class="iconify lucide--check"></span>
        Save Changes
      {/if}
    </Button>
  {/if}
</section>

<AlertDialog.Root bind:open={deleteDialogOpen}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Delete family?</AlertDialog.Title>
        <AlertDialog.Description>
          Family <span class="font-medium break-all text-foreground">{family.key}</span> will be deleted. This action cannot be undone.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action variant="destructive" disabled={deleting} onclick={deleteFamily}>
          {#if deleting}
            <span class="iconify animate-spin lucide--loader-2"></span>
            Deleting…
          {:else}
            Delete
          {/if}
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
