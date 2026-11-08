import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "sercha-api",
    },
    {
      type: "category",
      label: "Auth",
      link: {
        type: "doc",
        id: "auth",
      },
      items: [
        {
          type: "doc",
          id: "get-an-access-token",
          label: "Get an access token",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "user-login",
          label: "User login",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "refresh-token",
          label: "Refresh token",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-current-user",
          label: "Get current user",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Query",
      link: {
        type: "doc",
        id: "query",
      },
      items: [
        {
          type: "doc",
          id: "run-sercha-ql",
          label: "Run SerchaQL",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Tools",
      link: {
        type: "doc",
        id: "tools",
      },
      items: [
        {
          type: "doc",
          id: "list-saved-tools",
          label: "List saved tools",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "get-a-saved-tool",
          label: "Get a saved tool",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "call-a-saved-tool",
          label: "Call a saved tool",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Catalogue",
      link: {
        type: "doc",
        id: "catalogue",
      },
      items: [
        {
          type: "doc",
          id: "list-corpora",
          label: "List corpora",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "get-the-catalogue-corpus-hub-detail-for-one-corpus",
          label: "Get the catalogue corpus hub detail for one corpus",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "get-a-dataset-tables-meanings",
          label: "Get a dataset table's meanings",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Exports",
      link: {
        type: "doc",
        id: "exports",
      },
      items: [
        {
          type: "doc",
          id: "start-a-large-export",
          label: "Start a large export",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-an-export",
          label: "Get an export",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Sources",
      link: {
        type: "doc",
        id: "sources",
      },
      items: [
        {
          type: "doc",
          id: "list-sources",
          label: "List sources",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "create-source",
          label: "Create source",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-source",
          label: "Get source",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "delete-source",
          label: "Delete source",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "trigger-sync",
          label: "Trigger sync",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-sync-state-for-source",
          label: "Get sync state for source",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "cancel-a-sync",
          label: "Cancel a sync",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "push-documents-to-a-push-source",
          label: "Push documents to a push source",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "list-source-documents",
          label: "List source documents",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Documents",
      link: {
        type: "doc",
        id: "documents",
      },
      items: [
        {
          type: "doc",
          id: "get-document",
          label: "Get document",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "get-a-documents-original-bytes",
          label: "Get a document's original bytes",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
