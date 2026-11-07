#!/usr/bin/env node
// Renders the React app to static HTML (SSG) so the page is fully readable without JavaScript.
import { readFile, writeFile, rm, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { render, structuredData, llmsFull } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

let html = await readFile(path.join(dist, 'index.html'), 'utf8');

// Preload the two fonts used above the fold so the hero headline paints in brand type.
const files = await readdir(path.join(dist, 'assets'));
const preload = files
  .filter((f) => /^(space-grotesk-latin-700|inter-latin-400)-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join('');
const json = JSON.stringify(structuredData()).replace(/</g, '\\u003c');
html = html
  .replace('<!--app-head-->', `${preload}<script type="application/ld+json">${json}</script>`)
  .replace('<!--app-html-->', render());
await writeFile(path.join(dist, 'index.html'), html);

const today = new Date().toISOString().slice(0, 10);
const sitemapPath = path.join(dist, 'sitemap.xml');
const sitemap = (await readFile(sitemapPath, 'utf8')).replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`);
await writeFile(sitemapPath, sitemap);

// Full plain-text page for AI crawlers, generated from the same data as the page.
await writeFile(path.join(dist, 'llms-full.txt'), llmsFull(today));

await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('Prerendered dist/index.html');
