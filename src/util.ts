import { getCollection } from 'astro:content';
import type { DataCollectionKey } from 'astro:content';

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// The opening of a post, as plain text, for lists and previews.
export const excerpt = (body = '', max = 180) => {
  const paras = body
    .split(/\n\s*\n/)
    .map((p) =>
      p
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/^\s*[-*]\s+/gm, '')
        .replace(/[*_#>`]/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean);
  let text = '';
  for (const p of paras) {
    text = text ? `${text} ${p}` : p;
    if (text.length >= 100) break;
  }
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)) + '…';
};

export const journalPosts = async () =>
  (await getCollection('journal', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

export const postUrl = (id: string) => `/journal/${id}/`;

// Entries in the YAML files show in the order of their ids (01-..., 02-...).
export const inOrder = async <C extends DataCollectionKey>(name: C) =>
  (await getCollection(name)).sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
