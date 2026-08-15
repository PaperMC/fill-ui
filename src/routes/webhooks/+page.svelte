<script lang="ts">
  import { onMount } from "svelte";
  import { CircleAlertIcon, XIcon } from "@lucide/svelte";
  import FailureBadge from "$lib/components/FailureBadge.svelte";
  import Header from "$lib/components/custom/header/Header.svelte";
  import LoadingSniffer from "$lib/components/LoadingSniffer.svelte";
  import SuccessBadge from "$lib/components/SuccessBadge.svelte";
  import SingleLineCopyable from "$lib/components/custom/SingleLineCopyable.svelte";
  import * as Alert from "$lib/components/ui/alert";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Separator } from "$lib/components/ui/separator";
  import { getContextClient } from "@urql/svelte";
  import { graphql } from "$lib/gql";
  import { DeliveryStatus, type Webhook } from "$lib/gql/graphql";
  import { getOperationErrorMessage, getUnexpectedOperationResultMessage } from "$lib/operation-error";
  import { webhooksHeaderSegment } from "$lib/components/custom/header/index.svelte";

  const webhooksQuery = graphql(`
    query Webhooks {
      webhooks {
        id
        url
        createdAt
        lastDeliveryStatus
        lastDeliveryAt
      }
    }
  `);

  const createWebhookMutation = graphql(`
    mutation CreateWebhook($input: CreateWebhookInput!) {
      createWebhook(input: $input) {
        webhook {
          id
          url
        }
        secret
      }
    }
  `);

  const deleteWebhookMutation = graphql(`
    mutation DeleteWebhook($input: DeleteWebhookInput!) {
      deleteWebhook(input: $input) {
        ok
      }
    }
  `);

  const client = getContextClient();

  type CreatedWebhookSecret = {
    id: string;
    url: string;
    secret: string;
  };

  let webhooks: Webhook[] = $state([]);
  let loading = $state(true);
  let loadError: string | null = $state(null);
  let operationError: string | null = $state(null);
  let newWebhookUrl = $state("");
  let creating = $state(false);
  let deleting = $state(false);
  let webhookPendingDeletion: Webhook | null = $state(null);
  let deleteDialogOpen = $state(false);
  let createdWebhookSecrets: CreatedWebhookSecret[] = $state([]);

  async function loadWebhooks() {
    loading = true;
    loadError = null;
    try {
      const result = await client.query(webhooksQuery, {}, { requestPolicy: "network-only" }).toPromise();
      const errorMessage = getOperationErrorMessage(result.error, "load webhooks");
      if (errorMessage) {
        loadError = errorMessage;
        return;
      }

      webhooks = (result.data?.webhooks ?? [])
        .filter((webhook): webhook is Webhook => webhook !== null)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      loadError = getUnexpectedOperationResultMessage("load webhooks", error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadWebhooks();
  });

  async function createWebhook(e: Event) {
    e.preventDefault();
    if (creating) return;

    operationError = null;
    const url = newWebhookUrl.trim();
    if (!url) {
      operationError = "Enter an endpoint URL.";
      return;
    }

    creating = true;
    try {
      const result = await client.mutation(createWebhookMutation, { input: { url } }).toPromise();
      const errorMessage = getOperationErrorMessage(result.error, "create the webhook");
      if (errorMessage) {
        operationError = errorMessage;
        return;
      }

      const createdWebhook = result.data?.createWebhook;
      if (!createdWebhook) {
        operationError = getUnexpectedOperationResultMessage("create the webhook");
        return;
      }

      createdWebhookSecrets = [
        {
          id: createdWebhook.webhook.id,
          url: createdWebhook.webhook.url,
          secret: createdWebhook.secret,
        },
        ...createdWebhookSecrets,
      ];
      newWebhookUrl = "";
      await loadWebhooks();
    } catch (error) {
      operationError = getUnexpectedOperationResultMessage("create the webhook", error);
    } finally {
      creating = false;
    }
  }

  function requestWebhookDeletion(webhook: Webhook) {
    operationError = null;
    webhookPendingDeletion = webhook;
    deleteDialogOpen = true;
  }

  async function deleteWebhook() {
    if (!webhookPendingDeletion || deleting) return;

    deleting = true;
    operationError = null;
    try {
      const result = await client.mutation(deleteWebhookMutation, { input: { id: webhookPendingDeletion.id } }).toPromise();
      const errorMessage = getOperationErrorMessage(result.error, "delete the webhook");
      if (errorMessage) {
        operationError = errorMessage;
        return;
      }

      if (!result.data?.deleteWebhook) {
        operationError = getUnexpectedOperationResultMessage("delete the webhook");
        return;
      }

      deleteDialogOpen = false;
      webhookPendingDeletion = null;
      await loadWebhooks();
    } catch (error) {
      operationError = getUnexpectedOperationResultMessage("delete the webhook", error);
    } finally {
      deleting = false;
    }
  }

  function formatDate(value: string | null | undefined): string {
    return value === null || value === undefined ? "" : new Date(value).toLocaleString();
  }
</script>

<svelte:head>
  <title>Webhooks - Fill</title>
</svelte:head>

<div class="space-y-8">
  <Header breadcrumbs={[webhooksHeaderSegment]} />

  <form onsubmit={createWebhook} class="max-w-2xl space-y-3">
    <h2 class="text-xl font-semibold">Add webhook</h2>
    {#if operationError}
      <Alert.Root variant="destructive">
        <CircleAlertIcon />
        <Alert.Title>Webhook action failed</Alert.Title>
        <Alert.Description>{operationError}</Alert.Description>
      </Alert.Root>
    {/if}
    <div class="space-y-1.5">
      <Label for="webhook-url">Endpoint URL</Label>
      <div class="flex gap-2">
        <Input id="webhook-url" bind:value={newWebhookUrl} placeholder="https://example.org/hooks/papermc" class="flex-1" disabled={creating} />
        <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
      </div>
    </div>
  </form>

  {#if createdWebhookSecrets.length > 0}
    <div class="max-w-2xl space-y-3">
      {#each createdWebhookSecrets as webhookSecret (webhookSecret.id)}
        <Alert.Root>
          <CircleAlertIcon />
          <Alert.Title>Copy this webhook secret</Alert.Title>
          <Alert.Description class="min-w-0 space-y-2">
            <p>The secret for <span class="font-medium break-all text-foreground">{webhookSecret.url}</span> is shown only once. Copy it now:</p>
            <SingleLineCopyable
              text={webhookSecret.secret}
              copyLabel="Copy webhook secret"
              copiedLabel="Webhook secret copied"
              class="font-mono text-sm text-foreground"
            />
          </Alert.Description>
          <Alert.Action>
            <Button
              variant="ghost"
              size="icon-sm"
              onclick={() => (createdWebhookSecrets = createdWebhookSecrets.filter((secret) => secret.id !== webhookSecret.id))}
              aria-label={`Dismiss webhook secret for ${webhookSecret.url}`}
              title="Dismiss"
            >
              <XIcon />
            </Button>
          </Alert.Action>
        </Alert.Root>
      {/each}
    </div>
  {/if}

  <Separator />

  <div class="flex max-w-2xl flex-col gap-3">
    <h2 class="text-xl font-semibold">Registered webhooks</h2>

    {#if loading}
      <LoadingSniffer text="Loading webhooks…" />
    {:else if loadError !== null}
      <Alert.Root variant="destructive">
        <CircleAlertIcon />
        <Alert.Title>Unable to load webhooks</Alert.Title>
        <Alert.Description>{loadError}</Alert.Description>
      </Alert.Root>
    {:else if webhooks.length === 0}
      <p class="text-sm text-muted-foreground">No webhooks registered yet.</p>
    {:else}
      {#each webhooks as webhook (webhook.id)}
        <Card.Root>
          <Card.Content class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <Card.Title class="min-w-0 break-all">{webhook.url}</Card.Title>
              <Button class="shrink-0" variant="destructive" size="sm" onclick={() => requestWebhookDeletion(webhook)}>Delete</Button>
            </div>
            <div class="grid gap-4 text-sm sm:grid-cols-2 sm:gap-0">
              <div class="space-y-1">
                <p class="text-muted-foreground">Created</p>
                <p class="font-medium">{formatDate(webhook.createdAt)}</p>
              </div>
              {#if webhook.lastDeliveryAt !== null}
                <div class="space-y-1 sm:border-l sm:pl-4">
                  <p class="text-muted-foreground">Last delivery</p>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-medium">{formatDate(webhook.lastDeliveryAt)}</span>
                    {#if webhook.lastDeliveryStatus === DeliveryStatus.Delivered}
                      <SuccessBadge>Delivered</SuccessBadge>
                    {:else if webhook.lastDeliveryStatus === DeliveryStatus.Failed}
                      <FailureBadge>Failed</FailureBadge>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          </Card.Content>
        </Card.Root>
      {/each}
    {/if}
  </div>
</div>

<AlertDialog.Root bind:open={deleteDialogOpen}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Delete webhook?</AlertDialog.Title>
        <AlertDialog.Description>
          Deliveries to <span class="font-medium break-all text-foreground">{webhookPendingDeletion?.url ?? "this endpoint"}</span> will stop immediately. This action
          cannot be undone.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action variant="destructive" disabled={deleting} onclick={deleteWebhook}>
          {deleting ? "Deleting..." : "Delete"}
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
