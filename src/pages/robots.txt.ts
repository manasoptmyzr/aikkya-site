// Everyone is welcome to read this site, including search engines and AI assistants.
// Content-Signal says how the content may be used (contentsignals.org):
// appearing in search, being used to answer people's questions, and training.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site)}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
