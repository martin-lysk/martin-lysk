import type { Config } from '@docusaurus/preset-classic';
import type { Options as BlogOptions } from '@docusaurus/preset-classic/lib/theme/Blog';

const config: Config = {
  title: 'Martin Lysk',
  tagline: 'Personal Blog',
  favicon: 'img/favicon.svg',

  url: 'https://martinlysk.github.io',
  baseUrl: '/',

  organizationName: 'martinlysk',
  projectName: 'martin-lysk',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        blog: {
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All posts',
          blogTitle: 'Blog',
          blogDescription: 'Personal blog',
          postsPerPage: 10,
          // One post per folder structure
          routeBasePath: '/',
          editUrl: undefined,
          remarkPlugins: [[require('./src/utils/remarkExtractH1.js').remarkExtractH1, { removeH1: true }]],
        } as BlogOptions,
        docs: false,
        theme: {
          customCss: ['./src/css/custom.css'],
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Martin Lysk',
      items: [
        { to: '/', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/martin-lysk',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Martin Lysk. Built with Docusaurus.`,
    },
    prism: {
      theme: {
        plain: {
          backgroundColor: '#F3F4F6',
          color: '#1F2937',
        },
        styles: [{
          types: ['comment', 'prolog', 'doctype', 'cdata'],
          style: { color: '#6B7280' }
        }, {
          types: ['punctuation', 'operator'],
          style: { color: '#9CA3AF' }
        }, {
          types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'],
          style: { color: '#EA580C' }
        }, {
          types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
          style: { color: '#10B981' }
        }, {
          types: ['entity', 'url', 'attr-value', 'keyword', 'variable'],
          style: { color: '#3B82F6' }
        }, {
          types: ['atrule', 'class-name', 'function', 'deleted'],
          style: { color: '#F59E0B' }
        }, {
          types: ['regex', 'important'],
          style: { color: '#EC4899' }
        }]
      },
      darkTheme: {
        plain: {
          backgroundColor: '#1F2937',
          color: '#E5E7EB',
        },
        styles: [{
          types: ['comment', 'prolog', 'doctype', 'cdata'],
          style: { color: '#6B7280' }
        }, {
          types: ['punctuation', 'operator'],
          style: { color: '#9CA3AF' }
        }, {
          types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'],
          style: { color: '#FB923C' }
        }, {
          types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
          style: { color: '#34D399' }
        }, {
          types: ['entity', 'url', 'attr-value', 'keyword'],
          style: { color: '#60A5FA' }
        }, {
          types: ['atrule', 'class-name', 'function', 'deleted'],
          style: { color: '#FBBF24' }
        }, {
          types: ['regex', 'important', 'variable'],
          style: { color: '#F472B6' }
        }]
      },
      additionalLanguages: ['bash', 'typescript', 'javascript', 'python'],
    },
  } satisfies Partial<{
    [key: string]: unknown;
  }>,
  // Markdown configuration
  markdown: {
    mermaid: true,
    format: 'detect',
  },
  // Support relative images
  plugins: [],
  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
