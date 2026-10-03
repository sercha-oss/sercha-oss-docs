---
id: notion
sidebar_position: 3
title: Notion
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="connector-title">
  <img src="/assets/logos/notion/notion_icon.png" alt="Notion" />
  <h1>Notion Connector</h1>
</div>

Indexes Notion pages and databases, including nested content and database properties.

<div className="guide-meta">Accurate as of April 2026</div>

<div className="prereq-box">

**Prerequisites** - Before you start, make sure you have:
- A running Sercha instance ([Quickstart](/docs/quickstart) or [Development Setup](/docs/development))
- A Notion account with permission to create integrations

</div>

---

## 1. Create a Notion Public Integration

Go to **[Create a new public integration](https://www.notion.so/profile/integrations/public/form/new-integration)** on Notion.

Select the workspace where you want to create the integration:

<div className="screenshot">
  <img src="/img/connectors/notion/set-workspace.png" alt="Notion integration creation showing workspace selection" />
  <div className="screenshot-caption">Select your workspace to create the integration.</div>
</div>

## 2. Configure the redirect URI

Set the **Redirect URI** to your Sercha callback URL:

| Field | Value |
|-------|-------|
| **Redirect URI** | `http://localhost:8080/api/v1/oauth/callback` |

<div className="screenshot">
  <img src="/img/connectors/notion/set-redirect.png" alt="Notion integration settings showing redirect URI configuration" />
  <div className="screenshot-caption">Set the redirect URI to point to your Sercha API callback endpoint.</div>
</div>

:::tip
Since this is designed to work as an internal integration, Notion verification won't be needed. Optional fields can be left blank:
- Company name
- Website
- Developer email
- Tagline
- Privacy policy URL
- Terms of use URL
:::

Click **Submit** to create the integration.

## 3. Copy the Client ID and Client Secret

After creating the integration, you'll be taken to the integration settings page. From here:

1. Copy the **OAuth client ID**
2. Copy the **OAuth client secret**

<div className="warning-box">

**Copy the secret now.** You may need to regenerate it if you navigate away without saving it.

</div>

## 4. Configure the provider

Add the credentials to your `.env` file (in your Sercha deployment directory):

```bash title=".env"
NOTION_CLIENT_ID=your_client_id
NOTION_CLIENT_SECRET=your_client_secret
```

## 5. Restart the backend

Restart the backend container so it picks up the new credentials:

```bash title="Terminal"
docker compose restart sercha-core
```

:::tip
No data is lost when restarting. The backend containers are stateless - all data is persisted in PostgreSQL and the document store.
:::

You can verify the provider is configured via [List Providers](/api/list-providers):

```bash title="curl"
curl http://localhost:8080/api/v1/providers \
  -H "Authorization: Bearer $TOKEN"
```

Notion should show `"configured": true, "enabled": true`.

---

From here you can continue setup using either the **Admin UI** or the **API**.

<Tabs>
<TabItem value="ui" label="Admin UI" default>

## 6. Connect your Notion account

Open [http://localhost:3000/admin/sources](http://localhost:3000/admin/sources) in your browser. You'll see Notion listed under the available providers. Click **Connect** on the Notion row.

<div className="screenshot">
  <img src="/img/connectors/notion/ui-sources-connect.png" alt="Sercha Sources page showing Notion ready to connect" />
  <div className="screenshot-caption">The Sources page shows all configured providers. Click "Connect" next to Notion.</div>
</div>

Your browser redirects to the Notion consent page. Review the permissions and click **Select pages**.

<div className="screenshot">
  <img src="/img/connectors/notion/oauth-consent.png" alt="Notion OAuth consent page showing requested permissions" />
  <div className="screenshot-caption">Notion asks you to authorize the integration and select which pages to share.</div>
</div>

Select the pages and databases you want to make available to Sercha:

<div className="screenshot">
  <img src="/img/connectors/notion/oauth-select-pages.png" alt="Notion page selection dialog" />
  <div className="screenshot-caption">Choose which pages and databases Sercha can access. You can select individual pages or entire databases.</div>
</div>

<div className="warning-box">

**Page selection is fixed at OAuth time.** Even with auto-sync enabled, Sercha can only access the pages you select during this consent step. To add new top-level pages later, you'll need to reconnect. However, new child pages within selected pages will be synced automatically.

</div>

After authorizing, you'll be redirected back to Sercha.

## 7. Choose sync mode

You can either enable **Auto-sync** to index all accessible content, or manually select specific containers:

<div className="screenshot">
  <img src="/img/connectors/notion/auto-discover-or-select.png" alt="Sercha showing auto-sync toggle and container selection options" />
  <div className="screenshot-caption">Choose between auto-sync (indexes everything) or manual container selection.</div>
</div>

If you choose manual selection, pick the pages and databases you want to index:

<div className="screenshot">
  <img src="/img/connectors/notion/select-containers.png" alt="Container selection showing available Notion pages and databases" />
  <div className="screenshot-caption">Select specific pages or databases to index.</div>
</div>

Click **Create Source** to finish.

## 8. Trigger a sync

Click into your source, then click **Sync Now** to start indexing.

Once the sync completes, you'll see the indexed documents listed on the page.

</TabItem>
<TabItem value="api" label="API">

## 6. Get an auth token

If you haven't set up an account yet, create one via [Initial Setup](/api/initial-setup):

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password",
    "name": "Admin"
  }'
```

Then [log in](/api/user-login) to get a Bearer token:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }'
```

Export the `token` from the response:

```bash title="Terminal"
export TOKEN=<paste token here>
```

## 7. Connect your Notion account

Start the OAuth flow via [Authorize](/api/start-o-auth-authorization):

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/oauth/notion/authorize \
  -H "Authorization: Bearer $TOKEN"
```

Open the returned `authorization_url` in your browser. Notion shows the consent page - review the permissions and select the pages you want to share.

<div className="warning-box">

**Page selection is fixed at OAuth time.** Even with auto-sync enabled, Sercha can only access the pages you select during this consent step. To add new top-level pages later, you'll need to reconnect. However, new child pages within selected pages will be synced automatically.

</div>

After authorization, Notion redirects to `localhost:8080/api/v1/oauth/callback`. The API processes the code exchange and creates a connection.

Verify the connection via [List Connections](/api/list-connections):

```bash title="curl"
curl http://localhost:8080/api/v1/connections \
  -H "Authorization: Bearer $TOKEN"
```

Save the connection `id` from the response.

## 8. Create a source

[List available containers](/api/list-containers) for the connection:

```bash title="curl"
curl http://localhost:8080/api/v1/connections/{connection_id}/containers \
  -H "Authorization: Bearer $TOKEN"
```

Each container represents a page or database. [Create a source](/api/create-source) with the containers you want to index:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/sources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Notion Workspace",
    "provider_type": "notion",
    "connection_id": "{connection_id}",
    "containers": [
      {"id": "page-uuid", "name": "Project Notes", "type": "page"},
      {"id": "database-uuid", "name": "Task Tracker", "type": "database"}
    ]
  }'
```

## 9. Trigger a sync

[Trigger a sync](/api/trigger-sync) to start indexing:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/sources/{source_id}/sync \
  -H "Authorization: Bearer $TOKEN"
```

Check sync progress via [Sync State](/api/get-sync-state-for-source):

```bash title="curl"
curl http://localhost:8080/api/v1/sources/{source_id}/sync \
  -H "Authorization: Bearer $TOKEN"
```

</TabItem>
</Tabs>

---

## What gets indexed

<div className="feature-grid">
  <div className="feature-card">
    <strong>Pages</strong>
    <span>Full page content including nested blocks</span>
  </div>
  <div className="feature-card">
    <strong>Databases</strong>
    <span>Database entries with all property values</span>
  </div>
  <div className="feature-card">
    <strong>Nested content</strong>
    <span>Child pages, toggle blocks, and nested lists</span>
  </div>
  <div className="feature-card">
    <strong>Metadata</strong>
    <span>Created/updated timestamps, parent relationships</span>
  </div>
</div>

## Permissions

Notion doesn't use traditional OAuth scopes. Instead, permissions are granted at the page and database level during the OAuth consent flow. The integration can only access content you explicitly share with it.

## Sync behavior

- **Initial sync**: Fetches all content from selected pages and databases
- **Incremental sync**: Detects changes using `last_edited_time` timestamps
- **Rate limiting**: Notion allows 3 requests per second - Sercha handles this automatically
- **Nested blocks**: Content is extracted up to 10 levels deep

:::info
Notion tokens don't expire, so you won't need to re-authenticate unless you revoke the integration's access.
:::
