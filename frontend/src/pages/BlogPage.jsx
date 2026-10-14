import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import { blogPosts } from '../data/blogPosts.js';
import { formatDate } from '../utils/format.js';

export default function BlogPage() {
  const categories = [...new Set(blogPosts.map((p) => p.category))];

  return (
    <>
      <SEO
        title="Blog & News"
        description="Educational articles about navigating the criminal justice system. This is not legal advice."
        path="/blog"
      />

      <section className="bg-obsidian px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.25em] text-signal">Blog & News</p>
          <h1 className="mt-4 font-display text-5xl text-bone md:text-7xl">Education & Insight</h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">
            General educational information to help families navigate complex systems. This is not legal advice.
          </p>
        </div>
      </section>

      <section className="bg-carbon px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-wider text-steel"
              >
                {cat}
              </span>
            ))}
          </div>

          {blogPosts.length === 0 ? (
            <p className="text-steel">Articles will appear here soon.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col border border-white/10 bg-obsidian transition hover:border-signal/40"
                >
                  <Link to={`/blog/${post.slug}`} className="flex flex-1 flex-col p-8">
                    <p className="text-xs uppercase tracking-wider text-signal">{post.category}</p>
                    <h2 className="mt-3 font-display text-2xl text-bone group-hover:text-signal">
                      {post.title}
                    </h2>
                    <p className="mt-4 flex-1 text-steel">{post.excerpt}</p>
                    <div className="mt-6 flex items-center gap-4 text-xs text-steel">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-obsidian px-6 py-16 text-center lg:px-10">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl text-bone">Stay Informed</h2>
          <p className="mt-4 text-steel">
            Newsletter subscription coming soon. In the meantime, explore our services or contact us directly.
          </p>
          <Link to="/contact" className="mt-6 inline-block text-signal hover:underline">
            Contact us →
          </Link>
        </div>
      </section>
    </>
  );
}
