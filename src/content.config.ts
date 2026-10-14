import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// Journal posts: one folder per post in src/content/journal/, with an index.md and its photos.
const journal = defineCollection({
  loader: glob({ base: './src/content/journal', pattern: '**/index.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      photo: image().optional(),
      photoAlt: z.string().optional(),
      instagram: z.string().url().optional(),
      draft: z.boolean().default(false),
    }),
});

// Rooms: one file per room in src/content/rooms/.
const rooms = defineCollection({
  loader: glob({ base: './src/content/rooms', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number(),
      line: z.string(),
      sleeps: z.string(),
      size: z.string().optional(),
      photos: z.array(z.object({ src: image(), alt: z.string() })),
    }),
});

// What guests have written about Aikkya.
const kindWords = defineCollection({
  loader: file('src/content/kind-words.yaml'),
  schema: z.object({
    name: z.string(),
    when: z.string(),
    where: z.string(),
    words: z.string(),
    featured: z.boolean().default(false),
  }),
});

// Newspapers and magazines that wrote about Aikkya.
const press = defineCollection({
  loader: file('src/content/press.yaml'),
  schema: z.object({
    outlet: z.string(),
    when: z.string(),
    about: z.string(),
    link: z.string().url().optional(),
  }),
});

// Questions people ask before they come.
const questions = defineCollection({
  loader: file('src/content/questions.yaml'),
  schema: z.object({
    q: z.string(),
    a: z.string(),
  }),
});

export const collections = { journal, rooms, kindWords, press, questions };
