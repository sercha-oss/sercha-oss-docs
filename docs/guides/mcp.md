---
id: mcp
sidebar_position: 7
title: MCP Integration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MCP Integration

Connect AI assistants to Sercha using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). This allows AI tools like Claude, ChatGPT, and Microsoft Copilot to read your documents directly.

<div className="guide-meta">Accurate as of April 2026</div>

<div className="prereq-box">

**Prerequisites** - Before you start, make sure you have:
- A running Sercha instance with indexed content
- For remote clients (Claude.ai, ChatGPT, Copilot): **HTTPS** and a **public URL**
- For Claude Desktop: [Node.js](https://nodejs.org/) installed (for `npx`)

</div>

---

## Available Tools

Sercha exposes these MCP tools that AI assistants can use:

| Tool | Description | Scope |
|------|-------------|-------|
| `get_document` | Retrieve the full content and metadata of a document by ID | `mcp:documents:read` |
| `list_sources` | List all available document sources | `mcp:sources:list` |

---

## Your MCP Server URL

For local development:
```
http://localhost:8080/mcp
```

For production (required for Claude.ai, ChatGPT, Copilot):
```
https://your-sercha-domain.com/mcp
```

:::warning
Claude.ai, ChatGPT, and Microsoft Copilot connect from their cloud infrastructure. Your Sercha instance **must be publicly accessible over HTTPS** for these clients to work.
:::

---

## Client Setup

<Tabs>
<TabItem value="claude-ai" label="Claude.ai" default>

Connect Sercha to [Claude.ai](https://claude.ai) to read your documents from the web interface.

### For Pro and Max Plans

#### 1. Open Connectors settings

Click your profile icon, then go to **Customize** → **Connectors**.

#### 2. Add a custom connector

Click the **+** button, then select **Add custom connector**.

#### 3. Enter your Sercha MCP URL

```
https://your-sercha-domain.com/mcp
```

#### 4. Configure OAuth (optional)

Expand **Advanced settings** to enter OAuth credentials if you want automatic authentication:

| Field | Value |
|-------|-------|
| **OAuth Client ID** | *(leave blank for dynamic registration)* |
| **OAuth Client Secret** | *(leave blank for dynamic registration)* |

:::tip
You can leave OAuth fields blank. Sercha supports [Dynamic Client Registration](https://datatracker.ietf.org/doc/html/rfc7591), so Claude.ai will automatically register as a client.
:::

#### 5. Click Add

The connector is now configured.

#### 6. Enable in conversations

In any conversation, click **+** → **Connectors** and toggle Sercha on.

---

### For Team and Enterprise Plans

**Admin setup (Owners only):**

1. Go to **Organization settings** → **Connectors**
2. Click **Add**
3. Select **Custom** → **Web**
4. Enter your Sercha MCP URL
5. Configure OAuth in **Advanced settings** (optional)
6. Click **Add**

**Member access:**

1. Go to **Customize** → **Connectors**
2. Find the Sercha connector (labeled "Custom")
3. Click **Connect** to authenticate

---

### Limitations

| Plan | Custom Connector Limit |
|------|------------------------|
| Free | 1 connector |
| Pro, Max, Team, Enterprise | Multiple connectors |

</TabItem>
<TabItem value="claude-desktop" label="Claude Desktop">

Connect Sercha to [Claude Desktop](https://claude.ai/download) using a local configuration file.

### 1. Locate your config file

| OS | Path |
|----|------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |

Create the file if it doesn't exist.

### 2. Add the Sercha MCP server

```json title="claude_desktop_config.json"
{
  "mcpServers": {
    "sercha": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://localhost:8080/mcp"
      ]
    }
  }
}
```

Replace `http://localhost:8080` with your Sercha server URL if different.

:::tip
For remote servers, use HTTPS:
```json
"args": ["-y", "mcp-remote", "https://your-sercha-domain.com/mcp"]
```
:::

### 3. Restart Claude Desktop

Quit Claude Desktop completely and reopen it.

### 4. Authenticate

On first use, `mcp-remote` opens your browser for OAuth:

1. Browser opens to Sercha login
2. Log in and approve MCP permissions
3. Return to Claude Desktop

The token is cached in `~/.mcp-auth/` — you won't need to re-authenticate unless it expires or is revoked.

### 5. Verify connection

Ask Claude:

> "What MCP tools do you have access to?"

You should see `get_document` and `list_sources` from Sercha.

---

### Troubleshooting

**"client not found" error**

This happens when OAuth credentials are cached but the client no longer exists in Sercha (e.g., after a database reset).

Fix: Delete the cached credentials and restart Claude Desktop:

```bash title="macOS/Linux"
rm -rf ~/.mcp-auth/
```

```powershell title="Windows"
Remove-Item -Recurse -Force "$env:USERPROFILE\.mcp-auth"
```

**Tools not appearing**

1. Verify Claude Desktop was fully restarted
2. Check `claude_desktop_config.json` is valid JSON
3. Ensure Node.js is installed: `node --version`

</TabItem>
<TabItem value="chatgpt" label="ChatGPT">

Connect Sercha to [ChatGPT](https://chatgpt.com) using OpenAI's MCP support.

:::info
ChatGPT connects to MCP servers from OpenAI's cloud infrastructure. Your Sercha instance must be publicly accessible over HTTPS.
:::

### 1. Open ChatGPT settings

Click your profile icon → **Settings** → **Connected apps** (or similar, depending on UI version).

### 2. Add a new MCP server

Look for an option to add a custom app or MCP server.

### 3. Enter your Sercha MCP URL

```
https://your-sercha-domain.com/mcp
```

### 4. Authenticate

ChatGPT will redirect you to Sercha for OAuth authorization:

1. Log in to Sercha
2. Approve the requested permissions
3. You're redirected back to ChatGPT

### 5. Use in conversations

Once connected, ChatGPT can call Sercha tools when relevant to your prompts.

---

### Requirements

- **HTTPS required** — ChatGPT only connects to secure endpoints
- **Public URL** — Must be reachable from OpenAI's infrastructure
- **OAuth 2.0** — Sercha handles this via Dynamic Client Registration

</TabItem>
<TabItem value="copilot" label="Microsoft Copilot">

Connect Sercha to [Microsoft Copilot Studio](https://copilotstudio.microsoft.com/) as an MCP server action.

### 1. Open your agent in Copilot Studio

Navigate to the agent you want to add Sercha to.

### 2. Add a new MCP tool

Go to **Tools** → **Add a tool** → **New tool** → **Model Context Protocol**.

### 3. Configure the server

| Field | Value |
|-------|-------|
| **Server name** | `Sercha` |
| **Server description** | `Read documents from Sercha` |
| **Server URL** | `https://your-sercha-domain.com/mcp` |

### 4. Configure authentication

Select **OAuth 2.0** as the authentication type.

For the simplest setup, choose **OAuth 2.0 dynamic client registration with discovery** if available — Sercha supports this automatically.

For manual configuration:

| Field | Value |
|-------|-------|
| **Authorization URL** | `https://your-sercha-domain.com/oauth/authorize` |
| **Token URL** | `https://your-sercha-domain.com/oauth/token` |
| **Scopes** | `mcp:documents:read mcp:sources:list` |

### 5. Complete setup

1. Click **Create**
2. Select **Create a new connection** (or use existing)
3. Click **Add to agent**

### 6. Test the connection

In the agent test panel, try a prompt that would list your sources or read a document.

---

### Requirements

- **HTTPS required** — Copilot only connects to secure endpoints
- **Public URL** — Must be reachable from Microsoft's infrastructure
- **Redirect URI** — Sercha automatically accepts the Teams OAuth redirect

</TabItem>
</Tabs>

---

## Example Prompts

Once connected, try these prompts with any AI assistant:

> "What sources do I have indexed?"

> "Get the full content of document doc_abc123"

The AI will automatically call the appropriate Sercha tool and incorporate the results into its response.

---

## Security

- **OAuth 2.0 with PKCE** — All authentication uses secure OAuth flows
- **Scoped access** — Tools only access what the scopes allow
- **No write operations**: MCP tools are read-only (retrieve, list)
- **Dynamic Client Registration** — Clients register automatically via [RFC 7591](https://datatracker.ietf.org/doc/html/rfc7591)

---

## Deployment Checklist

For Claude.ai, ChatGPT, and Copilot (remote clients):

| Requirement | How to Set |
|-------------|------------|
| **HTTPS** | Deploy behind a reverse proxy with SSL (nginx, Cloudflare, etc.) |
| **Public URL** | Ensure Sercha is accessible from the internet |
| **BASE_URL** | Set env var: `BASE_URL=https://your-sercha-domain.com` |
| **UI_BASE_URL** | Set env var: `UI_BASE_URL=https://your-app-domain.com` |

For Claude Desktop (local):

| Requirement | How to Set |
|-------------|------------|
| **Node.js** | Install from [nodejs.org](https://nodejs.org/) |
| **Config file** | Create/edit `claude_desktop_config.json` |
