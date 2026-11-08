module.exports = {
  "serchaqlSidebar": [
    "intro",
    "reference/index",
    {
      "type": "category",
      "label": "Query syntax",
      "collapsed": true,
      "link": {
        "type": "doc",
        "id": "reference/query-syntax"
      },
      "items": [
        "reference/commands/select",
        "reference/clauses/with",
        "reference/clauses/from",
        "reference/clauses/join",
        "reference/clauses/via",
        "reference/clauses/as-of",
        "reference/clauses/where",
        "reference/clauses/group-by",
        "reference/clauses/having",
        "reference/clauses/over",
        "reference/clauses/set-operators",
        "reference/clauses/order-by",
        "reference/clauses/limit",
        "reference/clauses/distinct",
        "reference/clauses/subqueries"
      ]
    },
    {
      "type": "category",
      "label": "Operators and expressions",
      "collapsed": true,
      "link": {
        "type": "doc",
        "id": "reference/operators-and-expressions"
      },
      "items": [
        "reference/clauses/operators",
        "reference/clauses/like",
        "reference/clauses/in",
        "reference/clauses/between",
        "reference/clauses/is-null",
        "reference/clauses/exists",
        "reference/clauses/case",
        "reference/clauses/cast",
        "reference/clauses/comments"
      ]
    },
    {
      "type": "category",
      "label": "Functions",
      "collapsed": true,
      "link": {
        "type": "doc",
        "id": "reference/functions"
      },
      "items": [
        {
          "type": "category",
          "label": "Text",
          "collapsed": true,
          "items": [
            {
              "type": "category",
              "label": "Case and length",
              "collapsed": true,
              "items": [
                "reference/functions/lower",
                "reference/functions/upper",
                "reference/functions/initcap",
                "reference/functions/length"
              ]
            },
            {
              "type": "category",
              "label": "Find",
              "collapsed": true,
              "items": [
                "reference/functions/strpos",
                "reference/functions/position",
                "reference/functions/starts_with",
                "reference/functions/regexp_like"
              ]
            },
            {
              "type": "category",
              "label": "Take part of a string",
              "collapsed": true,
              "items": [
                "reference/functions/substring",
                "reference/functions/left",
                "reference/functions/right",
                "reference/functions/split_part"
              ]
            },
            {
              "type": "category",
              "label": "Change a string",
              "collapsed": true,
              "items": [
                "reference/functions/replace",
                "reference/functions/regexp_replace",
                "reference/functions/trim",
                "reference/functions/ltrim",
                "reference/functions/rtrim",
                "reference/functions/lpad",
                "reference/functions/rpad",
                "reference/functions/reverse",
                "reference/functions/concat",
                "reference/functions/concat_ws"
              ]
            },
            {
              "type": "category",
              "label": "Split into rows",
              "collapsed": true,
              "items": [
                "reference/functions/string_to_table",
                "reference/functions/regexp_split_to_table"
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Number",
          "collapsed": true,
          "items": [
            "reference/functions/abs",
            "reference/functions/round",
            "reference/functions/trunc",
            "reference/functions/ceil",
            "reference/functions/floor",
            "reference/functions/sign",
            "reference/functions/mod",
            "reference/functions/power",
            "reference/functions/sqrt"
          ]
        },
        {
          "type": "category",
          "label": "Date and time",
          "collapsed": true,
          "items": [
            "reference/functions/current_date",
            "reference/functions/extract",
            "reference/functions/date_part",
            "reference/functions/date_trunc"
          ]
        },
        {
          "type": "category",
          "label": "Conditional",
          "collapsed": true,
          "items": [
            "reference/functions/coalesce",
            "reference/functions/nullif",
            "reference/functions/greatest",
            "reference/functions/least"
          ]
        },
        {
          "type": "category",
          "label": "Aggregate",
          "collapsed": true,
          "items": [
            "reference/functions/count",
            "reference/functions/sum",
            "reference/functions/avg",
            "reference/functions/min",
            "reference/functions/max",
            "reference/functions/string_agg",
            "reference/functions/array_agg"
          ]
        },
        {
          "type": "category",
          "label": "Window",
          "collapsed": true,
          "items": [
            {
              "type": "category",
              "label": "Ranking",
              "collapsed": true,
              "items": [
                "reference/functions/row_number",
                "reference/functions/rank",
                "reference/functions/dense_rank",
                "reference/functions/ntile",
                "reference/functions/percent_rank",
                "reference/functions/cume_dist"
              ]
            },
            {
              "type": "category",
              "label": "Other rows",
              "collapsed": true,
              "items": [
                "reference/functions/lag",
                "reference/functions/lead",
                "reference/functions/first_value",
                "reference/functions/last_value",
                "reference/functions/nth_value"
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Commands",
      "collapsed": true,
      "link": {
        "type": "doc",
        "id": "reference/commands"
      },
      "items": [
        {
          "type": "category",
          "label": "Model entities",
          "collapsed": true,
          "items": [
            "reference/commands/create-entity",
            "reference/commands/drop-entity"
          ]
        },
        {
          "type": "category",
          "label": "Relations",
          "collapsed": true,
          "items": [
            "reference/commands/create-relation",
            "reference/commands/refresh-relation",
            "reference/commands/drop-relation"
          ]
        },
        {
          "type": "category",
          "label": "Tables",
          "collapsed": true,
          "items": [
            "reference/commands/alter-table-rename",
            "reference/commands/alter-table-normalise",
            "reference/commands/refresh-table",
            "reference/commands/alter-table-model-ignore"
          ]
        },
        {
          "type": "category",
          "label": "Views",
          "collapsed": true,
          "items": [
            "reference/commands/create-view",
            "reference/commands/comment-on",
            "reference/commands/drop-view"
          ]
        },
        {
          "type": "category",
          "label": "Materialized views",
          "collapsed": true,
          "items": [
            "reference/commands/create-materialized-view",
            "reference/commands/refresh-materialized-view",
            "reference/commands/alter-materialized-view",
            "reference/commands/drop-materialized-view"
          ]
        },
        {
          "type": "category",
          "label": "Tools",
          "collapsed": true,
          "items": [
            "reference/commands/create-tool",
            "reference/commands/call",
            "reference/commands/drop-tool",
            "reference/commands/detach-preset"
          ]
        },
        {
          "type": "category",
          "label": "Edges",
          "collapsed": true,
          "items": [
            "reference/commands/create-edge",
            "reference/commands/preview-edge",
            "reference/commands/refresh-edges",
            "reference/commands/drop-edge"
          ]
        },
        {
          "type": "category",
          "label": "People",
          "collapsed": true,
          "items": [
            "reference/commands/create-people",
            "reference/commands/refresh-people",
            "reference/commands/drop-people"
          ]
        },
        {
          "type": "category",
          "label": "Access",
          "collapsed": true,
          "items": [
            "reference/commands/grant",
            "reference/commands/revoke"
          ]
        },
        {
          "type": "category",
          "label": "Looking around",
          "collapsed": true,
          "items": [
            "reference/commands/show-model",
            "reference/commands/show-links",
            "reference/commands/show-lineage",
            "reference/commands/show-raw",
            "reference/commands/show-records",
            "reference/commands/show",
            "reference/commands/describe",
            "reference/commands/explain"
          ]
        },
        {
          "type": "category",
          "label": "Extracting entities from documents",
          "collapsed": true,
          "items": [
            "reference/commands/create-ontology",
            "reference/commands/create-extracted-entity",
            "reference/commands/alter-entity",
            "reference/commands/create-record-type",
            "reference/commands/create-ontology-edge",
            "reference/commands/create-structure",
            "reference/commands/create-corpus",
            "reference/commands/alter-corpus",
            "reference/commands/bind-corpus",
            "reference/commands/alter-binding",
            "reference/commands/run-binding",
            "reference/commands/cancel-run",
            "reference/commands/rebind-corpus",
            "reference/commands/unbind-corpus",
            "reference/commands/drop-run",
            "reference/commands/drop-corpus",
            "reference/commands/drop-structure",
            "reference/commands/drop-ontology"
          ]
        }
      ]
    }
  ]
};
