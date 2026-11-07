#!/usr/bin/env node
// Checks every outbound link in the built page. Run after `npm run build`.
import { readFile } from 'node:fs/promises';
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const links = [...new Set([...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')))];
let bad = 0;
for (const url of links) {
  try {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) bad++;
    console.log(`${r.ok ? 'ok ' : 'BAD'} ${r.status} ${url}`);
  } catch (e) { bad++; console.log(`ERR ${url} ${e.message}`); }
}
process.exit(bad ? 1 : 0);
