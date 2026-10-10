import { useState } from 'react';
import { ArrowRight, Clock, Search } from 'lucide-react';
import { BLOG_POSTS, type BlogPost } from '@/data/blog';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

const CATEGORY_LABELS: Record<BlogPost['category'], string> = {
  pets: 'Pets',
  plants: 'Plants',
  care: 'Care',
  general: 'General',
};

const CATEGORY_COLORS: Record<BlogPost['category'], string> = {
  pets: 'border-brand-500/30 bg-brand-500/10 text-brand-300',
  plants: 'border-brand-400/30 bg-brand-400/10 text-brand-500',
  care: 'border-accent-500/30 bg-accent-500/10 text-accent-400',
  general: 'border-white/[0.08] bg-white/[0.05] text-ink-200',
};

export function BlogPage({ onNavigate }: BlogPageProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<BlogPost['category'] | 'all'>('all');

  const filtered = BLOG_POSTS.filter((post) => {
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Petziq Blog</p>
        <h1 className="mt-3 section-title text-balance">Care guides, tips, and stories</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-300">
          Practical, vet-informed articles to help you care for your pets and plants with confidence.
        </p>
      </div>

      {/* Search + filter */}
      <div className="mx-auto mt-8 max-w-2xl space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="input-field pl-11"
            aria-label="Search blog posts"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'pets', 'plants', 'care'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-brand-500/15 text-brand-500 ring-1 ring-brand-500/20'
                  : 'text-ink-300 hover:bg-white/[0.06] hover:text-ink-50'
              }`}
            >
              {cat === 'all' ? 'All Articles' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="text-ink-300">No articles found. Try a different search or category.</p>
        </div>
      )}

      {/* Featured post */}
      {featured && !query && activeCategory === 'all' && (
        <div className="mt-12">
          <button
            onClick={() => onNavigate(`/blog/${featured.id}`)}
            className="group card-surface relative w-full overflow-hidden text-left transition hover:border-white/[0.10] animate-fade-up"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-video overflow-hidden bg-ink-900 lg:aspect-auto">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
              </div>
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className={`chip border text-xs ${CATEGORY_COLORS[featured.category]}`}>
                    {CATEGORY_LABELS[featured.category]}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-ink-400">
                    <Clock className="h-3 w-3" />{featured.readTime}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl text-balance">
                  {featured.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink-300">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
                  Read article
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Post grid */}
      {((featured && rest.length > 0) || (query || activeCategory !== 'all')) && filtered.length > 0 && (
        <div className={`mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${featured && !query && activeCategory === 'all' ? '' : 'mt-12'}`}>
          {(query || activeCategory !== 'all' ? filtered : rest).map((post, i) => (
            <button
              key={post.id}
              onClick={() => onNavigate(`/blog/${post.id}`)}
              className="group card-surface overflow-hidden text-left transition hover:border-white/[0.10] hover:shadow-soft animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-video overflow-hidden bg-ink-900">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
                <span className={`absolute left-3 top-3 chip border text-xs backdrop-blur-sm ${CATEGORY_COLORS[post.category]}`}>
                  {CATEGORY_LABELS[post.category]}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-ink-400">
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug text-ink-50">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-300">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-300">
                  Read more
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
