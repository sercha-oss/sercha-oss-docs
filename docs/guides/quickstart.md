---
id: quickstart
sidebar_position: 2
title: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

Get Sercha running locally with pre-built Docker images. This guide walks through setup, connecting a GitHub source and syncing content.

:::info
This guide uses GitHub as an example connector. After completing setup, you can connect any supported data source - see [Connectors](/connectors) for all available options.
:::

<div className="prereq-box">

**Prerequisites** - Before you start, make sure you have:
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) and npm (required if using the Admin UI)
- 4 GB RAM available

</div>

---

## 1. Clone the repository

```bash title="Terminal"
git clone https://github.com/sercha-oss/sercha-core.git
cd sercha-core/examples/quickstart
```

## 2. Configure environment variables

Create a `.env` file in the quickstart directory. Two secrets are required — without them the container will refuse to start:

```bash title="Terminal"
cat > .env <<EOF
JWT_SECRET=$(openssl rand -hex 32)
MASTER_KEY=$(openssl rand -hex 32)
EOF
```

### Optional variables

To unlock additional features, add any of the following to your `.env` file. You can also add them later and restart the containers.

```bash title=".env"
# Optional: enables GitHub connector (this guide uses GitHub as an example)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

For the GitHub credentials, see the [GitHub Connector](/connectors/github) guide.

## 3. Start the services

```bash title="Terminal"
docker compose --profile ui up -d
```

Wait about 60 seconds for OpenSearch to initialize. Check status:

```bash title="Terminal"
docker compose --profile ui ps
```

All services should show `healthy`.

:::info
The `--profile ui` flag includes the Admin UI. Without it, only the API starts on port 8080.
:::

---

## 4. Set up your account

<Tabs>
<TabItem value="ui" label="Admin UI" default>

Open [http://localhost:3000](http://localhost:3000) in your browser. On first visit, you'll see the login screen. Click **Configure Sercha** at the bottom to start the setup wizard.

<div className="screenshot">
  <img src="/img/quickstart/step_1.png" alt="Sercha login screen with Configure Sercha link" />
  <div className="screenshot-caption">Click "Configure Sercha" at the bottom to start the first-time setup wizard.</div>
</div>

The setup wizard has 4 steps: **Account**, **AI** (optional), **Capabilities** (optional), and **Sources** (optional).

### Create your admin account

Fill in your name, email, and password, then click **Get Started**.

<div className="screenshot">
  <img src="/img/quickstart/Admin_setup_pt_1.png" alt="Account creation form with name, email, and password fields" />
  <div className="screenshot-caption">Create your administrator account.</div>
</div>

### Skip adding sources

The final setup step offers to connect data sources. Click **Skip for now** - we'll connect a source separately.

<div className="screenshot">
  <img src="/img/quickstart/add_a_source_skipthisstepmodal.png" alt="Connect Data Sources screen showing GitHub ready to connect and Skip for now button" />
  <div className="screenshot-caption">Skip this step for now. You'll connect data sources after setup is complete.</div>
</div>

### Dashboard

After completing setup, you may be redirected to the login screen. Sign in with the account you just created.

<div className="screenshot">
  <img src="/img/quickstart/empty_dashboard.png" alt="Sercha admin dashboard showing system health, capabilities, and empty stats" />
  <div className="screenshot-caption">The admin dashboard shows system health, enabled capabilities, and usage stats.</div>
</div>

</TabItem>
<TabItem value="api" label="API">

The API is available at [http://localhost:8080](http://localhost:8080).

### Create your admin account

[Create an account](/api/initial-setup) via the setup endpoint:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password",
    "name": "Admin"
  }'
```

### Log in

[Log in](/api/user-login) to get a Bearer token:

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

### Verify the system

Check that the API is running:

```bash title="curl"
curl http://localhost:8080/api/v1/providers \
  -H "Authorization: Bearer $TOKEN"
```

</TabItem>
</Tabs>

---

## 5. Connect GitHub and sync

Sercha is running but has no content yet. Let's connect a GitHub source and index some repositories.

:::tip
For the full guide with additional details, see the [GitHub Connector](/connectors/github) page.
:::

### Create a GitHub OAuth App

Go to **[Register a new OAuth application](https://github.com/settings/applications/new)** on GitHub and fill in the form:

| Field | Value |
|-------|-------|
| **Application name** | `Sercha` (or any name you like) |
| **Homepage URL** | `http://localhost:3000` |
| **Authorization callback URL** | `http://localhost:8080/api/v1/oauth/callback` |

Leave **Enable Device Flow** unchecked, then click **Register application**.

<div className="screenshot">
  <img src="/img/connectors/github/setup-app.png" alt="GitHub OAuth App registration form" />
  <div className="screenshot-caption">Fill in the OAuth App form. The callback URL must point to the API on port 8080.</div>
</div>

After registering, copy the **Client ID**, then click **Generate a new client secret** and copy it immediately - GitHub only shows it once.

### Add credentials and restart

If you didn't already add these in step 2, add them to your `.env` file:

```bash title=".env"
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

Restart the backend so it picks up the new credentials:

```bash title="Terminal"
docker compose --profile ui restart sercha
```

<Tabs>
<TabItem value="ui" label="Admin UI" default>

### Connect your GitHub account

Open [http://localhost:3000/admin/sources](http://localhost:3000/admin/sources). Click **Connect** on the GitHub row.

<div className="screenshot">
  <img src="/img/connectors/github/ui-sources-connect.png" alt="Sources page showing GitHub ready to connect" />
  <div className="screenshot-caption">Click "Connect" next to GitHub on the Sources page.</div>
</div>

GitHub's consent page opens. Review the permissions and click **Authorize**. If you belong to any organizations, click **Grant** next to them to index their repositories.

<div className="screenshot">
  <img src="/img/connectors/github/github-consent.png" alt="GitHub OAuth consent page" />
  <div className="screenshot-caption">Authorize the app. Grant access to any organizations you want to index.</div>
</div>

### Select repositories and sync

After authorizing, select which repositories to index and click **Create Source**.

<div className="screenshot">
  <img src="/img/connectors/github/ui-select-repos.png" alt="Repository selection dialog" />
  <div className="screenshot-caption">Select the repositories you want to index.</div>
</div>

Click into your new source, then click **Sync Now** to start indexing.

<div className="screenshot">
  <img src="/img/connectors/github/ui-sync-now.png" alt="Source detail page with Sync Now button" />
  <div className="screenshot-caption">Click "Sync Now" to start indexing your selected repositories.</div>
</div>

Once the sync completes, you'll see the indexed documents listed on the page.

<div className="screenshot">
  <img src="/img/connectors/github/ui-sync-complete.png" alt="Sync complete showing indexed documents" />
  <div className="screenshot-caption">Sync complete - your documents are now ingested.</div>
</div>

</TabItem>
<TabItem value="api" label="API">

### Connect your GitHub account

Start the OAuth flow via [Authorize](/api/start-o-auth-authorization):

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/oauth/github/authorize \
  -H "Authorization: Bearer $TOKEN"
```

Open the returned `authorization_url` in your browser. GitHub shows the consent page - review the permissions and click **Authorize**. If you belong to any organizations, click **Grant** next to them.

After authorization, verify the connection via [List Connections](/api/list-connections):

```bash title="curl"
curl http://localhost:8080/api/v1/connections \
  -H "Authorization: Bearer $TOKEN"
```

Save the connection `id` from the response.

### Create a source and sync

[List available repositories](/api/list-containers) for the connection:

```bash title="curl"
curl http://localhost:8080/api/v1/connections/{connection_id}/containers \
  -H "Authorization: Bearer $TOKEN"
```

[Create a source](/api/create-source) with the repositories you want to index:

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

## Services

| Service | Port | Purpose |
|---------|------|---------|
| Admin UI | 3000 | Web interface (via nginx) |
| Sercha API | 8080 | REST API (API + Worker + Scheduler) |
| PostgreSQL | 5432 | Database |
| OpenSearch | 9200 | Legacy store, not used for search |

## Stopping

```bash title="Terminal"
# Stop (preserves data)
docker compose --profile ui down

# Stop and delete all data
docker compose --profile ui down -v
```

## Next steps

- [Connectors](/connectors) - connect other data sources
- [Indexing Guide](/docs/indexing) - learn the full indexing workflow
- [Development Setup](/docs/development) - build from source with hot reload
- [Configuration](/docs/configuration) - all environment variables
