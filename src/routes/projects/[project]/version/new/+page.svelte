<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import Header from "$lib/components/Header.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Select from "$lib/components/ui/select";
  import * as Input from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { RunedQuery } from "$lib/api.svelte";
  import { getContextClient, queryStore, mutationStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import { goto } from "$app/navigation";
  import MinJavaOverride from "$lib/components/MinJavaOverride.svelte";
  import FlagsOverride from "$lib/components/FlagsOverride.svelte";
  import JavaOverridesInfo from "$lib/components/JavaOverridesInfo.svelte";
  import { splitFlags } from "$lib/utils";
  import { resolve } from "$app/paths";
  import { AUTH_CTX } from "$lib/auth.svelte";

  const auth = AUTH_CTX.get();
  onMount(() => auth.forceLogin());

  let versionId: string | undefined = $state();
  let familyId: string | undefined = $state();
  let minJava: number | undefined = $state();
  let flags: string | undefined = $state();

  const familiesQuery = new RunedQuery(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query ProjectFamiliesWithMeta($id: String!) {
          project(id: $id) {
            families {
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
        id: page.params.project ?? "",
      },
    }),
  );

  let families = $derived(familiesQuery.current?.project?.families?.filter((family): family is NonNullable<typeof family> => family != null) || []);

  onMount(() => {
    const urlFamilyId = page.url.searchParams.get("family");
    if (urlFamilyId) {
      familyId = urlFamilyId;
    }
  });

  const client = getContextClient();
  let creating = $state(false);

  function submitForm(e: Event) {
    e.preventDefault();
    if (creating) return;

    if (!versionId || !familyId) {
      alert("Please fill in all required fields");
      return;
    }
    if (flags && flags.length > 0) {
      if (minJava === undefined) {
        alert("You must set a minimum Java version if you set custom flags. See the notice for details.");
        return;
      }
    }
    creating = true;

    let javaInput = undefined;
    if (minJava !== undefined) {
      javaInput = {
        version: {
          minimum: minJava,
        },
        flags: {
          recommended: splitFlags(flags || ""),
        },
      };
    }

    const result = mutationStore({
      client,
      query: graphql(`
        mutation CreateVersion($input: CreateVersionInput!) {
          createVersion(input: $input) {
            version {
              id
              family {
                id
              }
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
          family: familyId,
          id: versionId,
          ...(javaInput && { java: javaInput }),
        },
      },
    });

    result.subscribe(({ data, error, fetching }) => {
      if (!fetching) {
        creating = false;
        if (error) {
          alert(`Error creating version: ${error.message}`);
        } else if (data?.createVersion?.version) {
          goto(
            resolve("/projects/[project]/version/[version]", {
              project: page.params.project!,
              version: data.createVersion.version.id,
            }),
          );
        }
      }
    });
  }

  function familyJava() {
    const family = families.find((f) => f.id === familyId);
    return family?.java?.version?.minimum ?? 21;
  }

  function familyFlags() {
    const family = families.find((f) => f.id === familyId);
    return family?.java?.flags?.recommended?.join(" ") ?? "";
  }
</script>

<svelte:head>
  <title>New {page.params.project} Version - Fill</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6">
  <Header project={page.params.project} projectPage={{ name: "<new version>", href: `` }} />

  <form class="space-y-2" onsubmit={submitForm}>
    <Label for="id-input">ID</Label>
    <Input.Root id="id-input" bind:value={versionId} required></Input.Root>

    <Label for="family-select">Family</Label>
    <Select.Root type="single" bind:value={familyId} required>
      <Select.Trigger id="family-select">
        {familyId || "Select a family..."}
      </Select.Trigger>
      <Select.Content>
        {#if familiesQuery.loading}
          <Select.Item value="" disabled>Loading families...</Select.Item>
        {:else if families.length === 0}
          <Select.Item value="" disabled>No families available</Select.Item>
        {:else}
          {#each families as family (family.id)}
            <Select.Item value={family.id}>{family.id}</Select.Item>
          {/each}
        {/if}
      </Select.Content>
    </Select.Root>

    <JavaOverridesInfo class="mt-4 mb-4" />

    <MinJavaOverride bind:minJavaOverride={minJava} familyMinJava={familyJava()} label="Minimum Java Version Override" />

    <FlagsOverride bind:flagsOverride={flags} familyFlags={familyFlags()} />

    <Button class="mt-2" type="submit" disabled={creating}>
      {#if creating}
        <span class="iconify animate-spin lucide--loader-2"></span>
        Creating Version…
      {:else}
        Create Version
      {/if}
    </Button>
  </form>
</div>
