import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Sercha Documentation',
  tagline: 'SerchaQL and the Sercha API',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://docs.sercha.dev',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'sercha-oss',
  projectName: 'sercha-oss-docs',

  // 'throw' (the Docusaurus default) so a broken link fails the build rather
  // than shipping. The /blog link 404'd on all 74 pages under 'warn'.
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid', 'docusaurus-theme-openapi-docs'],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'serchaql',
        path: 'docs/serchaql',
        routeBasePath: 'serchaql',
        sidebarPath: require.resolve('./sidebars-serchaql.js'),
        showLastUpdateTime: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'docs/api',
        routeBasePath: 'api',
        sidebarPath: require.resolve('./sidebars-api.js'),
        docItemComponent: '@theme/ApiItem',
      },
    ],
    [
      // The spec is cut from sercha-enterprise's annotations by
      // scripts/docs-site/public_api.py; regenerate the pages with
      // npx docusaurus clean-api-docs all && npx docusaurus gen-api-docs all
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api-docs',
        docsPluginId: 'api',
        config: {
          sercha: {
            specPath: './openapi/sercha-api.json',
            outputDir: 'docs/api',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
          },
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: false,
        // Blog is off until there are posts to publish. With it enabled but
        // empty, Docusaurus never generates /blog, so the navbar and footer
        // links to it 404'd on every page.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/sercha-logo.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: 'Sercha',
        src: 'img/sercha-logo.png',
      },
      items: [
        {
          to: '/serchaql/intro',
          label: 'SerchaQL',
          position: 'left',
        },
        {
          to: '/api/sercha-api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://discord.gg/Hpj7e6k6Et',
          position: 'right',
          className: 'header-discord-link',
          'aria-label': 'Discord community',
        },
        {
          href: 'https://sercha.dev',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'SerchaQL', to: '/serchaql/intro'},
            {label: 'API', to: '/api/sercha-api'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Discord', href: 'https://discord.gg/Hpj7e6k6Et'},
            {label: 'Sercha', href: 'https://sercha.dev'},
          ],
        },
      ],
      copyright: `Copyright \u00A9 ${new Date().getFullYear()} Sercha.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['go', 'bash', 'json', 'yaml'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
