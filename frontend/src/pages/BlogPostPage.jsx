import { Link, useParams } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { blogPosts } from '../data/blogPosts.js';
import { formatDate } from '../utils/format.js';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  const related = blogPosts.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 2);

  if (!post) {
    return (
      <div className="px-6 py-24 lg:px-10">
        <EmptyState title="Article not found" actionLabel="Back to blog" actionTo="/blog" />
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : '';

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
      />

      <article className="bg-obsidian">
        <header className="border-b border-white/10 px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <Link to="/blog" className="text-sm text-steel hover:text-signal">
              ← All articles
            </Link>
            <p className="mt-6 text-xs uppercase tracking-wider text-signal">{post.category}</p>
            <h1 className="mt-4 font-display text-4xl text-bone md:text-5xl">{post.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-steel">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span>{post.readingTime} min read</span>
              <span>{post.author}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
          <div className="rounded border border-signal/20 bg-signal/5 p-4 text-sm text-steel">
            <strong className="text-bone">Disclaimer:</strong> This article provides general educational
            information only. It is not legal advice and should not be relied upon for case-specific decisions.
          </div>

          <div className="prose prose-invert mt-10 max-w-none space-y-6">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-lg leading-relaxed text-steel">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-sm text-steel">Share this article:</p>
            <div className="mt-3 flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-bone hover:text-signal"
              >
                Share on X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-bone hover:text-signal"
              >
                Share on Facebook
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <aside className="border-t border-white/10 bg-carbon px-6 py-16 lg:px-10">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-2xl text-bone">Related articles</h2>
              <ul className="mt-6 space-y-4">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/blog/${item.slug}`} className="text-bone hover:text-signal">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        <section className="border-t border-white/10 px-6 py-16 text-center lg:px-10">
          <h2 className="font-display text-3xl text-bone">Need Personalized Support?</h2>
          <p className="mx-auto mt-4 max-w-lg text-steel">
            General articles cannot address your specific situation. Request a consultation for individualized guidance.
          </p>
          <Button to="/booking" variant="primary" className="mt-8">
            Request a Case Review
          </Button>
        </section>
      </article>
    </>
  );
}
