// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aikkya.com',
  trailingSlash: 'ignore',
  compressHTML: true,
  integrations: [sitemap()],
  // Photos inside journal posts get smaller copies for phones.
  image: { layout: 'constrained' },
});
