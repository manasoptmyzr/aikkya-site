import rss from '@astrojs/rss';
import { site } from '../../site';
import { excerpt, journalPosts, postUrl } from '../../util';

export async function GET(context) {
  const posts = await journalPosts();
  return rss({
    title: 'Life at Aikkya',
    description: site.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: excerpt(p.body, 300),
      link: postUrl(p.id),
    })),
  });
}
