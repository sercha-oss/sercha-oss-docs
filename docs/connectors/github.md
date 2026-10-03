---
id: github
sidebar_position: 2
title: GitHub
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="connector-title">
  <img src="/assets/logos/github/github_icon.png" alt="GitHub" />
  <h1>GitHub Connector</h1>
</div>

Indexes repository content including source code, markdown, issues, and pull requests.

<div className="guide-meta">Accurate as of April 2026</div>

<div className="prereq-box">

**Prerequisites** - Before you start, make sure you have:
- A running Sercha instance ([Quickstart](/docs/quickstart) or [Development Setup](/docs/development))
- A GitHub account with permission to create OAuth Apps

</div>

---

## 1. Create a GitHub OAuth App

Go to **[Register a new OAuth application](https://github.com/settings/applications/new)** on GitHub and fill in the form:

| Field | Value |
|-------|-------|
| **Application name** | `Sercha` (or any name you like) |
| **Homepage URL** | `http://localhost:3000` |
| **Application description** | Optional - e.g. `Sercha document sync` |
| **Authorization callback URL** | `http://localhost:8080/api/v1/oauth/callback` |

Leave **Enable Device Flow** unchecked, then click **Register application**.

<div className="screenshot">
  <img src="/img/connectors/github/setup-app.png" alt="GitHub OAuth App registration form filled in with Sercha values" />
  <div className="screenshot-caption">Fill in the OAuth App form with your Sercha instance URLs. The callback URL must point to the API on port 8080.</div>
</div>

:::info
For more details on GitHub OAuth Apps, see the [GitHub documentation on creating an OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).
:::

## 2. Copy the Client ID and generate a Client Secret

After registering, GitHub takes you to the app settings page. From here:

1. Copy the **Client ID** shown on the page
2. Click **Generate a new client secret**

<div className="screenshot">
  <img src="/img/connectors/github/copy-client-gen-secret.png" alt="GitHub app settings showing Client ID and Generate a new client secret button" />
  <div className="screenshot-caption">Copy your Client ID, then click "Generate a new client secret".</div>
</div>

3. Copy the client secret immediately - GitHub only shows it once

<div className="warning-box">

**Copy the secret now.** GitHub will not show it again. If you lose it, you'll need to generate a new one.

</div>

<div className="screenshot">
  <img src="/img/connectors/github/save-secret.png" alt="GitHub showing the generated client secret with a warning to copy it" />
  <div className="screenshot-caption">Copy the secret value before navigating away from this page.</div>
</div>

## 3. Configure the provider

Add the credentials to your `.env` file (in your Sercha deployment directory):

```bash title=".env"
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

## 4. Restart the backend

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

GitHub should show `"configured": true, "enabled": true`.

---

From here you can continue setup using either the **Admin UI** or the **API**.

<Tabs>
<TabItem value="ui" label="Admin UI" default>

## 5. Connect your GitHub account

Open [http://localhost:3000/admin/sources](http://localhost:3000/admin/sources) in your browser. You'll see GitHub listed under the available providers. Click **Connect** on the GitHub row.

<div className="screenshot">
  <img src="/img/connectors/github/ui-sources-connect.png" alt="Sercha Sources page showing GitHub ready to connect" />
  <div className="screenshot-caption">The Sources page shows all configured providers. Click "Connect" next to GitHub.</div>
</div>

Your browser redirects to the GitHub consent page. Review the permissions and click **Authorize**.

<div className="screenshot">
  <img src="/img/connectors/github/github-consent.png" alt="GitHub OAuth consent page showing requested permissions" />
  <div className="screenshot-caption">GitHub asks you to authorize the app. If you want to index repositories from an organization, click "Grant" next to it here.</div>
</div>

:::tip
If you belong to any GitHub organizations, this page lets you **Grant** access to them. You'll only be able to index repositories from organizations you authorize here. You can update this later from your [GitHub Authorized OAuth Apps settings](https://github.com/settings/applications).
:::

After authorizing, you'll be redirected back to Sercha with a success confirmation.

<div className="screenshot">
  <img src="/img/connectors/github/ui-oauth-complete.png" alt="Sercha showing Connected Successfully" />
  <div className="screenshot-caption">The connection was created successfully.</div>
</div>

## 6. Select repositories and create a source

Choose which repositories to index. Use the search bar to find specific repos, or click **Select All**. Then click **Create Source**.

<div className="screenshot">
  <img src="/img/connectors/github/ui-select-repos.png" alt="Repository selection dialog showing available repos with checkboxes" />
  <div className="screenshot-caption">Select the repositories you want to index and click "Create Source".</div>
</div>

Your new source appears on the Sources page.

<div className="screenshot">
  <img src="/img/connectors/github/ui-source-created.png" alt="Sources page showing the newly created GitHub source" />
  <div className="screenshot-caption">Your GitHub source now appears under "Connected Sources".</div>
</div>

## 7. Trigger a sync

Click into your source, then click **Sync Now** to start indexing.

<div className="screenshot">
  <img src="/img/connectors/github/ui-sync-now.png" alt="Source detail page with arrow pointing to Sync Now button" />
  <div className="screenshot-caption">Click "Sync Now" to start indexing your selected repositories.</div>
</div>

Once the sync completes, you'll see the indexed documents listed on the page.

<div className="screenshot">
  <img src="/img/connectors/github/ui-sync-complete.png" alt="Source detail page showing 45 indexed documents" />
  <div className="screenshot-caption">Sync complete - your documents are now ingested.</div>
</div>

</TabItem>
<TabItem value="api" label="API">

## 5. Get an auth token

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

## 6. Connect your GitHub account

Start the OAuth flow via [Authorize](/api/start-o-auth-authorization):

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/oauth/github/authorize \
  -H "Authorization: Bearer $TOKEN"
```

Open the returned `authorization_url` in your browser. GitHub shows the consent page - review the permissions and click **Authorize**.

<div className="screenshot">
  <img src="/img/connectors/github/github-consent.png" alt="GitHub OAuth consent page showing requested permissions" />
  <div className="screenshot-caption">GitHub asks you to authorize the app. If you want to index repositories from an organization, click "Grant" next to it here.</div>
</div>

:::tip
If you belong to any GitHub organizations, this page lets you **Grant** access to them. You'll only be able to index repositories from organizations you authorize here. You can update this later from your [GitHub Authorized OAuth Apps settings](https://github.com/settings/applications).
:::

After authorization, GitHub redirects to `localhost:8080/api/v1/oauth/callback`. The API processes the code exchange and creates a connection. The browser then redirects to the UI - if the UI isn't running, that's fine, the connection is already created server-side.

Verify the connection via [List Connections](/api/list-connections):

```bash title="curl"
curl http://localhost:8080/api/v1/connections \
  -H "Authorization: Bearer $TOKEN"
```

Save the connection `id` from the response.

## 7. Create a source

[List available repositories](/api/list-containers) for the connection:

```bash title="curl"
curl http://localhost:8080/api/v1/connections/{connection_id}/containers \
  -H "Authorization: Bearer $TOKEN"
```

Each container represents a repository. [Create a source](/api/create-source) with the repositories you want to index:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/sources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My GitHub Repos",
    "provider_type": "github",
    "connection_id": "{connection_id}",
    "containers": [
      {"id": "owner/repo-name", "name": "repo-name", "type": "repository"}
    ]
  }'
```

## 8. Trigger a sync

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
    <strong>Source code</strong>
    <span>All code files, respecting .gitignore rules</span>
  </div>
  <div className="feature-card">
    <strong>Documentation</strong>
    <span>README, markdown files, and docs</span>
  </div>
  <div className="feature-card">
    <strong>Issues & PRs</strong>
    <span>Issue descriptions and pull request content (coming soon)</span>
  </div>
  <div className="feature-card">
    <strong>File metadata</strong>
    <span>Path, size, and last modified timestamps</span>
  </div>
</div>

## Scopes

The GitHub OAuth App requests `repo`, `read:user`, and `user:email` scopes.

## Sync behavior

- **Initial sync**: Fetches all files from selected repositories
- **Incremental sync**: Detects changes since last sync using commit timestamps
- **Schedule**: Automatic sync runs periodically (configurable)
