<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { AUTH_CTX } from "$lib/auth.svelte";
  import FlagsDisplay from "$lib/components/FlagsDisplay.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button";
  import * as Input from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import type { Java } from "$lib/gql/graphql";
  import { splitFlags } from "$lib/utils";
  import { getContextClient, mutationStore } from "@urql/svelte";
  import { watch } from "runed";

  const auth = AUTH_CTX.get();

  type Family = {
    key: string;
    java: Java;
  };

  interface Props {
    family: Family;
    versionCount: number;
    editMode?: boolean;
  }

  interface EditState {
    minimum?: number;
    flags?: string[];
  }

  let { family, versionCount, editMode = $bindable(false) }: Props = $props();

  function createEditState(): EditState {
    return {
      minimum: family.java.version.minimum,
      flags: family.java.flags.recommended,
    };
  }

  let editState: EditState = $state(createEditState());

  function resetEditState() {
    editState = createEditState();
  }

  const client = getContextClient();
  let saving = $state(false);
  let deleting = $state(false);
  let deleteDialogOpen = $state(false);
  let deleteConfirmation = $state("");
  let canDelete = $derived(versionCount === 0);

  watch(
    () => deleteDialogOpen,
    (open) => {
      if (!open) {
        deleteConfirmation = "";
      }
    },
  );

  function saveChanges() {
    if (saving || deleting) return;
    if (editState.minimum == null) {
      alert("Please set a minimum Java version.");
      return;
    }

    saving = true;

    const result = mutationStore({
      client,
      query: `
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
      `,
      variables: {
        input: {
          project: page.params.project!,
          key: family.key,
          java: {
            version: {
              minimum: editState.minimum,
            },
            flags: {
              recommended: editState.flags || [],
            },
          },
        },
      },
    });

    result.subscribe(({ data, error, fetching }) => {
      if (!fetching) {
        saving = false;
        if (error) {
          alert(`Error updating family: ${error.message}`);
          return;
        }

        const updated = (data as { updateFamily?: { family?: { key?: string } } } | undefined)?.updateFamily?.family;
        if (!updated?.key) {
          alert("Error updating family: The server did not confirm the update.");
          return;
        }

        editMode = false;
        goto(
          resolve("/projects/[project]/family/[family]", {
            project: page.params.project!,
            family: updated.key,
          }),
          {
            invalidateAll: true,
            keepFocus: true,
            noScroll: true,
            replaceState: true,
          },
        );
      }
    });
  }

  function deleteFamily() {
    if (deleting || saving || !canDelete || deleteConfirmation !== "delete") return;

    deleting = true;

    const result = mutationStore({
      client,
      query: `
        mutation DeleteFamily($input: DeleteFamilyInput!) {
          deleteFamily(input: $input) {
            ok
          }
        }
      `,
      variables: {
        input: {
          project: page.params.project!,
          key: family.key,
        },
      },
    });

    result.subscribe(({ data, error, fetching }) => {
      if (!fetching) {
        deleting = false;
        if (error) {
          alert(`Error deleting family: ${error.message}`);
          return;
        }

        const deleted = (data as { deleteFamily?: { ok?: boolean | null } } | undefined)?.deleteFamily?.ok;
        if (!deleted) {
          alert("Error deleting family: The server did not confirm the deletion.");
          return;
        }

        deleteDialogOpen = false;
        editMode = false;
        goto(resolve("/projects/[project]", { project: page.params.project! }));
      }
    });
  }
</script>

<section class="space-y-4">
  <div class="flex items-center gap-2">
    <h2 class="flex items-center text-lg font-medium">Metadata</h2>
    {#if auth.getUsername()}
      <Button
        size="icon"
        variant="ghost"
        disabled={editMode}
        class="size-6"
        onclick={() => {
          editMode = true;
          resetEditState();
        }}
        title={editMode ? "Editing metadata" : "Edit metadata"}
      >
        <span class="iconify size-4 lucide--pencil"></span>
      </Button>
    {/if}
  </div>

  <div class="space-y-2 rounded-lg border p-4">
    <h3 class="text-lg font-medium">General</h3>
    <div class="text-sm">
      <div class="font-medium">Family ID</div>
      <div class="mt-0.5 break-all">{family.key}</div>
    </div>

    <h3 class="mt-4 text-lg font-medium">Java</h3>
    {#if editMode}
      <div class="space-y-2 text-sm">
        <div class="space-y-1">
          <Label for="family-min-java">Minimum Version</Label>
          <Input.Root id="family-min-java" type="number" min="1" step="1" bind:value={editState.minimum} />
        </div>

        <div class="space-y-1">
          <Label for="family-flags">Recommended Flags</Label>
          <Input.Root
            id="family-flags"
            bind:value={() => editState.flags?.join(" ") || "", (value) => (editState.flags = value ? splitFlags(value) : [])}
            placeholder="-Xms4G -Xmx4G"
          />
        </div>
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
  </div>

  {#if editMode}
    <div class="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        onclick={() => {
          editMode = false;
          deleteDialogOpen = false;
          resetEditState();
        }}
        disabled={saving || deleting}
      >
        <span class="iconify lucide--x"></span>
        Cancel
      </Button>

      <Button disabled={saving || deleting} onclick={saveChanges}>
        {#if saving}
          <span class="iconify animate-spin lucide--loader-2"></span>
          Saving Changes...
        {:else}
          <span class="iconify lucide--check"></span>
          Save Changes
        {/if}
      </Button>

      <AlertDialog.Root bind:open={deleteDialogOpen}>
        <AlertDialog.Trigger>
          {#snippet child({ props })}
            <Button variant="destructive" disabled={saving || deleting || !canDelete} title={!canDelete ? "Families with versions cannot be deleted." : undefined} {...props}>
              {#if deleting}
                <span class="iconify animate-spin lucide--loader-2"></span>
                Deleting...
              {:else}
                <span class="iconify lucide--trash-2"></span>
                Delete
              {/if}
            </Button>
          {/snippet}
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete Family</AlertDialog.Title>
            <AlertDialog.Description>
              Type <code>delete</code> to confirm deleting family <code>{family.key}</code>. This cannot be undone.
            </AlertDialog.Description>
          </AlertDialog.Header>

          <div class="space-y-2">
            <Label for="delete-family-confirmation">Confirmation</Label>
            <Input.Root
              id="delete-family-confirmation"
              bind:value={deleteConfirmation}
              placeholder="type 'delete'"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck={false}
              disabled={deleting}
            />
          </div>

          <AlertDialog.Footer>
            <AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
            <Button variant="destructive" disabled={deleting || !canDelete || deleteConfirmation !== "delete"} onclick={deleteFamily}>
              {#if deleting}
                <span class="iconify animate-spin lucide--loader-2"></span>
                Deleting...
              {:else}
                <span class="iconify lucide--trash-2"></span>
                Delete Family
              {/if}
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>

    {#if !canDelete}
      <p class="text-sm text-neutral-500">Delete is only available for empty families. Remove or move all versions first.</p>
    {/if}
  {/if}
</section>
