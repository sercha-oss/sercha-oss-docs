---
id: intro
sidebar_position: 1
title: Introduction
slug: /
---

# Sercha Documentation

Connect data sources like GitHub, Google Drive, and Notion, and work with their documents from one API.

## How it works

1. **Connect** a data source via OAuth or API key
2. **Ingest** - Sercha fetches and stores content from each source
3. **Read** - list sources and read documents from the REST API or Admin UI

<div className="feature-grid">
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/docs/quickstart">Quickstart</a></strong>
      <span>Get Sercha running locally with Docker Compose.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/docs/development">Development</a></strong>
      <span>Build from source with hot reload.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/docs/configuration">Configuration</a></strong>
      <span>Environment variables and deployment options.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/docs/indexing">Indexing Guide</a></strong>
      <span>Connect sources and index content via the API.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/api/sercha-core-api">API Reference</a></strong>
      <span>Full REST API documentation with interactive examples.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/connectors">Connectors</a></strong>
      <span>GitHub, local filesystem, and more data sources.</span>
    </div>
  </div>
</div>

## Stack

| Component | Role |
|-----------|------|
| Sercha API | REST API for auth, sources, documents |
| Worker | Background sync and indexing |
| PostgreSQL | Metadata, users, documents |
| OpenSearch | Legacy store, not used for search |

All components run in a single container for development. See [Configuration](/docs/configuration) for production deployments.
