<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import SupportBadge from "$lib/components/SupportBadge.svelte";
  import { type Java, type Support, SupportStatus } from "$lib/gql/graphql";
  import FlagsDisplay from "$lib/components/FlagsDisplay.svelte";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import { CalendarDate } from "@internationalized/date";
  import * as Select from "$lib/components/ui/select";
  import MinJavaOverride from "$lib/components/MinJavaOverride.svelte";
  import FlagsOverride from "$lib/components/FlagsOverride.svelte";
  import JavaOverridesInfo from "$lib/components/JavaOverridesInfo.svelte";
  import { splitFlags } from "$lib/utils";
  import { watch } from "runed";
  import { getContextClient, mutationStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import { page } from "$app/state";
  import { AUTH_CTX } from "$lib/auth.svelte";

  const auth = AUTH_CTX.get();

  type Family = {
    id: string;
    java?: Java;
  };

  type Version = {
    id: string;
    family: Family;
    support: Support;
    java?: Java | null;
  };

  interface Props {
    version: Version;
    editMode?: boolean;
  }

  let { version, editMode = $bindable(false) }: Props = $props();

  function overridesFamilyJava(): boolean {
    return version.java !== undefined && version.java !== null;
  }

  const supportStatuses = [SupportStatus.Deprecated, SupportStatus.Supported, SupportStatus.Unsupported];
  interface EditState {
    support: {
      status: SupportStatus;
      end?: CalendarDate;
    };
    java: {
      minimum?: number;
      flags?: string[];
    };
  }
  let editState: EditState = $state({
    support: {
      status: SupportStatus.Supported,
    },
    java: {},
  });

  function resetEditState() {
    editState = {
      support: {
        status: version.support.status,
        end: parseDateString(version.support.end),
      },
      java: {
        minimum: overridesFamilyJava() ? version.java?.version.minimum : undefined,
        flags: overridesFamilyJava() ? version.java?.flags.recommended : undefined,
      },
    };
  }

  const today = dateToCalendar(new Date());

  watch(
    () => editState.support.status,
    (status, oldStatus) => {
      if (status === SupportStatus.Unsupported) {
        editState.support.end = today;
      } else if (oldStatus === SupportStatus.Unsupported) {
        if (editState.support.end === today) {
          editState.support.end = undefined;
        }
      }
    },
  );

  function parseDateString(string?: string | null): CalendarDate | undefined {
    if (!string) return undefined;
    // Parse YYYY-MM-DD directly without timezone conversion
    const parts = string.split("-");
    if (parts.length !== 3) return undefined;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
    return new CalendarDate(year, month, day);
  }

  function dateToCalendar(date?: Date | null): CalendarDate | undefined {
    if (!date) return undefined;
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  const client = getContextClient();
  let saving = $state(false);

  function saveChanges() {
    if (saving) return;

    if (editState.java.flags && editState.java.flags.length !== 0) {
      if (!editState.java.minimum) {
        alert("You must set a minimum Java version if you set custom flags. See the notice for details.");
        return;
      }
    }

    saving = true;

    let supportInput = {
      status: editState.support.status,
      end: editState.support.end
        ? `${editState.support.end.year.toString().padStart(4, "0")}-${editState.support.end.month.toString().padStart(2, "0")}-${editState.support.end.day.toString().padStart(2, "0")}`
        : null,
    };

    let javaInput = undefined;
    if (editState.java.minimum !== undefined) {
      javaInput = {
        version: {
          minimum: editState.java.minimum,
        },
        flags: {
          recommended: editState.java.flags || [],
        },
      };
    }

    const result = mutationStore({
      client,
      query: graphql(`
        mutation UpdateVersion($input: UpdateVersionInput!) {
          updateVersion(input: $input) {
            version {
              id
            }
          }
        }
      `),
      variables: {
        input: {
          project: page.params.project!,
          id: version.id,
          ...(supportInput && { support: supportInput }),
          ...(javaInput && { java: javaInput }),
        },
      },
    });

    result.subscribe(({ data, error, fetching }) => {
      if (!fetching) {
        saving = false;
        if (error) {
          alert(`Error updating version: ${error.message}`);
        } else if (data?.updateVersion?.version) {
          editMode = false;
          resetEditState();
        }
      }
    });
  }

  let effectiveJava = $derived(version.java ?? version.family.java);
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
      <div class="font-medium">Version ID</div>
      <div class="mt-0.5 break-all">{version.id}</div>
    </div>
    <div class="text-sm">
      <div class="font-medium">Family</div>
      <div class="mt-0.5">{version.family.id}</div>
    </div>
    <div class="text-sm">
      <div class="font-medium">Support</div>
      {#if editMode}
        <div class="mt-0.5 flex items-center gap-2">
          <Select.Root type="single" bind:value={editState.support.status} required>
            <Select.Trigger>
              <SupportBadge support={{ status: editState.support.status || SupportStatus.Supported }} showEnd={false} />
            </Select.Trigger>
            <Select.Content>
              {#each supportStatuses as status (status)}
                <Select.Item value={status}>
                  <SupportBadge support={{ status }} showEnd={false} />
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
          {#if editState.support.status === SupportStatus.Unsupported}
            <span>since</span>
          {:else}
            <span>until</span>
          {/if}
          <DatePicker noValueText={editState.support.status === SupportStatus.Unsupported ? "No date set" : "No end date"} bind:value={editState.support.end} />
        </div>
      {:else}
        <div class="mt-0.5"><SupportBadge support={version.support} showEnd={true} /></div>
      {/if}
    </div>

    {#if effectiveJava && version.family.java}
      <h3 class="mt-4 text-lg font-medium">Java</h3>
      {#if editMode}
        <JavaOverridesInfo />
        <MinJavaOverride bind:minJavaOverride={editState.java.minimum} familyMinJava={version.family.java.version.minimum} label="Minimum Version Override" />

        <FlagsOverride
          bind:flagsOverride={() => editState.java.flags?.join(" "), (value) => (editState.java.flags = value ? splitFlags(value) : undefined)}
          familyFlags={version.family.java.flags.recommended.join(" ")}
        />
      {:else}
        <div class="text-sm">
          <div class="flex items-center gap-2 font-medium">Minimum Version</div>
          <div class="mt-0.5">{effectiveJava.version.minimum}</div>
          {#if overridesFamilyJava()}
            <span class="text-neutral-500 italic">Overrides family ({version.family.java.version.minimum})</span>
          {:else}
            <span class="text-neutral-500 italic">Inherited from family</span>
          {/if}
        </div>

        <div class="space-y-1 text-sm">
          <div class="flex items-center gap-2 font-medium">Recommended Flags</div>
          <FlagsDisplay flags={effectiveJava.flags.recommended.length > 0 ? effectiveJava.flags.recommended : ["None"]} />
          {#if overridesFamilyJava()}
            <span class="text-neutral-500 italic">Overrides family</span>
            <FlagsDisplay flags={version.family.java.flags.recommended.length > 0 ? version.family.java.flags.recommended : ["None"]} />
          {:else}
            <span class="text-neutral-500 italic">Inherited from family</span>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
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
