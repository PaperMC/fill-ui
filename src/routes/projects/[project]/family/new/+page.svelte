<script lang="ts">
  import { page } from "$app/state";
  import Header from "$lib/components/custom/header/Header.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Input from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { getContextClient, mutationStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { buildHeaderSegments } from "$lib/components/custom/header/index.svelte";
  import { SHARED_QUERIES_CTX } from "$lib/api.svelte";

  let familyId: string | undefined = $state();
  let minJava: number | undefined = $state(21); // default minimum java
  let flags: string | undefined = $state(); // space separated list

  const client = getContextClient();
  let creating = $state(false);

  function submitForm(e: Event) {
    e.preventDefault();
    if (creating) return;

    if (!familyId || minJava == null) {
      alert("Please fill in all required fields");
      return;
    }
    creating = true;

    const javaInput = {
      version: { minimum: minJava },
      flags: {
        recommended: flags ? flags.split(/\s+/).filter((f) => f.length > 0) : [],
      },
    };

    const result = mutationStore({
      client,
      query: graphql(`
        mutation CreateFamily($input: CreateFamilyInput!) {
          createFamily(input: $input) {
            family {
              id
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
      variables: {
        input: {
          project: page.params.project!,
          id: familyId,
          java: javaInput,
        },
      },
    });

    result.subscribe(({ data, error, fetching }) => {
      if (!fetching) {
        creating = false;
        if (error) {
          alert(`Error creating family: ${error.message}`);
        } else if (data?.createFamily?.family) {
          goto(
            resolve("/projects/[project]/family/[family]", {
              project: page.params.project!,
              family: data.createFamily.family.id,
            }),
          );
        }
      }
    });
  }

  const sharedQueries = SHARED_QUERIES_CTX.get();
  let breadcrumbs = $derived.by(() => {
    let base = buildHeaderSegments(sharedQueries, page.params.project);
    base.push({ label: "<new family>", href: "" });
    return base;
  });
</script>

<svelte:head>
  <title>New {sharedQueries.projectNameOrFallback(page.params.project)} Family - Fill</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6">
  <Header {breadcrumbs} />

  <form class="space-y-2" onsubmit={submitForm}>
    <Label for="id-input">ID</Label>
    <Input.Root id="id-input" bind:value={familyId} required placeholder="e.g. 1.21" />

    <Label for="min-java-input">Minimum Java</Label>
    <Input.Root id="min-java-input" type="number" min="1" step="1" bind:value={minJava} required />

    <!-- TODO: add a way to populate default aikar flags -->
    <Label for="flags-input">JVM Flags (space separated)</Label>
    <div class="flex items-center gap-1">
      <Input.Root id="flags-input" bind:value={flags} />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        class="size-8"
        onclick={() => {
          flags = undefined;
        }}
      >
        <span class="iconify lucide--trash"></span>
      </Button>
    </div>

    <Button class="mt-2" type="submit" disabled={creating}>
      {#if creating}
        <span class="iconify animate-spin lucide--loader-2"></span>
        Creating Family…
      {:else}
        Create Family
      {/if}
    </Button>
  </form>
</div>
