// A plain-text summary of Aikkya for AI assistants (see llmstxt.org).
// Built from the same files as the website, so it stays up to date.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site, rupees } from '../site';
import { journalPosts, postUrl, inOrder } from '../util';

export const GET: APIRoute = async ({ site: base }) => {
  const url = (path: string) => new URL(path, base).href;
  const rooms = (await getCollection('rooms')).sort((a, b) => a.data.order - b.data.order);
  const questions = await inOrder('questions');
  const press = await inOrder('press');
  const posts = await journalPosts();
  const p = site.prices;
  const a = site.address;

  const text = `# ${site.fullName} (${site.scripts.hindi} · ${site.scripts.bangla})

> ${site.description}

- Address: ${site.fullName}, ${a.street}, ${a.locality}, ${a.district} district, ${a.region} ${a.postalCode}, India
- Hosts: Shivani and Avijeet, who live on the farm
- Contact: WhatsApp ${site.phone}. There is no online booking. Guests write first, and the hosts host a few people at a time.
- Prices: ${rupees(p.wabiSabi)} a night for Wabi or Sabi, ${rupees(p.kintsugi)} for Kintsugi or A-Frame of Mind, for two people with breakfast. A third person in the same room is ${rupees(p.extraGuest)} a night.
- Check-in from 2 pm, check-out by 11 am
- Instagram: ${site.instagram}

## Rooms
${rooms.map((r) => `- [${r.data.name}](${url('/stay/#' + r.id)}): ${r.data.line} Sleeps ${r.data.sleeps.toLowerCase()}.`).join('\n')}

## Questions
${questions.map((q) => `- ${q.data.q} ${q.data.a}`).join('\n')}

## In the news
${press.map((n) => `- ${n.data.outlet}, ${n.data.when}: ${n.data.about}`).join('\n')}

## Pages
- [Stay](${url('/stay/')})
- [Us](${url('/us/')})
- [Kind words from guests](${url('/kind-words/')})
- [Getting here and questions](${url('/getting-here/')})
- [Say hello](${url('/say-hello/')})

## Life at Aikkya (journal)
${posts.map((post) => `- [${post.data.title}](${url(postUrl(post.id))})`).join('\n')}
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
