<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import Header from "$lib/components/custom/header/Header.svelte";
  import * as Alert from "$lib/components/ui/alert";
  import { Button } from "$lib/components/ui/button";
  import * as Select from "$lib/components/ui/select";
  import * as Input from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { RunedQuery, SHARED_QUERIES_CTX } from "$lib/api.svelte";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import { getOperationErrorMessage, getUnexpectedOperationResultMessage } from "$lib/operation-error";
  import { goto } from "$app/navigation";
  import MinJavaOverride from "$lib/components/MinJavaOverride.svelte";
  import FlagsOverride from "$lib/components/FlagsOverride.svelte";
  import JavaOverridesInfo from "$lib/components/JavaOverridesInfo.svelte";
  import { splitFlags } from "$lib/utils";
  import { resolve } from "$app/paths";
  import { buildHeaderSegments } from "$lib/components/custom/header/index.svelte";

  let versionId: string | undefined = $state();
  let familyId: string | undefined = $state();
  let minJava: number | undefined = $state();
  let flags: string | undefined = $state();

  const familiesQuery = RunedQuery.static(
    queryStore({
      client: getContextClient(),
      query: graphql(`
        query ProjectFamiliesWithMeta($projectKey: String!) {
          project(key: $projectKey) {
            families {
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
      variables: {
        projectKey: page.params.project ?? "",
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
  let formError: string | null = $state(null);

  async function submitForm(e: Event) {
    e.preventDefault();
    if (creating) return;

    formError = null;
    if (!versionId || !familyId) {
      formError = "Please fill in all required fields.";
      return;
    }
    if (flags && flags.length > 0) {
      if (minJava === undefined) {
        formError = "Set a minimum Java version when using custom flags. See the notice for details.";
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

    try {
      const result = await client
        .mutation(
          graphql(`
            mutation CreateVersion($input: CreateVersionInput!) {
              createVersion(input: $input) {
                version {
                  key
                  family {
                    key
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
          {
            input: {
              project: page.params.project!,
              family: familyId,
              key: versionId,
              ...(javaInput && { java: javaInput }),
            },
          },
        )
        .toPromise();
      const errorMessage = getOperationErrorMessage(result.error, "create the version");
      if (errorMessage) {
        formError = errorMessage;
        return;
      }

      const version = result.data?.createVersion?.version;
      if (!version) {
        formError = getUnexpectedOperationResultMessage("create the version");
        return;
      }

      await goto(
        resolve("/projects/[project]/version/[version]", {
          project: page.params.project!,
          version: version.key,
        }),
      );
    } catch (error) {
      formError = getUnexpectedOperationResultMessage("create the version", error);
    } finally {
      creating = false;
    }
  }

  function familyJava() {
    const family = families.find((f) => f.key === familyId);
    return family?.java?.version?.minimum ?? 21;
  }

  function familyFlags() {
    const family = families.find((f) => f.key === familyId);
    return family?.java?.flags?.recommended?.join(" ") ?? "";
  }

  const sharedQueries = SHARED_QUERIES_CTX.get();
  let breadcrumbs = $derived.by(() => {
    let base = buildHeaderSegments(sharedQueries, page.params.project);
    base.push({ label: "<new version>", href: "" });
    return base;
  });
</script>

<svelte:head>
  <title>New {sharedQueries.projectNameOrFallback(page.params.project)} Version - Fill</title>
</svelte:head>

<div class="space-y-8">
  <Header {breadcrumbs} />

  <form class="space-y-2" onsubmit={submitForm}>
    {#if formError}
      <Alert.Root variant="destructive">
        <Alert.Description>{formError}</Alert.Description>
      </Alert.Root>
    {/if}
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
          {#each families as family (family.key)}
            <Select.Item value={family.key}>{family.key}</Select.Item>
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
