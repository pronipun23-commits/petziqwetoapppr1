import { ArrowLeft, ArrowRight, Clock, Calendar, Sparkles, BookOpen } from 'lucide-react';
import { getBlogPost, BLOG_POSTS, type BlogPost } from '@/data/blog';
import { NotFoundPage } from '@/pages/NotFoundPage';

interface BlogPostPageProps {
  postId: string;
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

export function BlogPostPage({ postId, onNavigate }: BlogPostPageProps) {
  const post = getBlogPost(postId);

  if (!post) {
    return <NotFoundPage onNavigate={onNavigate} />;
  }

  const related = BLOG_POSTS.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);
  const fallbackRelated = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);
  const relatedPosts = related.length > 0 ? related : fallbackRelated;

  return (
    <article className="container-px pt-8 pb-24 lg:pb-16">
      {/* Back link */}
      <button
        onClick={() => onNavigate('/blog')}
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-300 transition hover:text-ink-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </button>

      {/* Header */}
      <div className="mx-auto mt-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <span className={`chip border text-xs ${CATEGORY_COLORS[post.category]}`}>
            {CATEGORY_LABELS[post.category]}
          </span>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Calendar className="h-3 w-3" />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink-50 text-balance sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-300 text-balance">
          {post.excerpt}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-sm font-bold text-white">
            {post.author.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-50">{post.author}</p>
            <p className="text-xs text-ink-400">Petziq Editorial</p>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-white/[0.08]">
        <img
          src={post.image}
          alt={post.title}
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="mx-auto mt-10 max-w-2xl">
        <div className="space-y-6">
          {post.body.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-ink-200 sm:text-lg"
              style={{ lineHeight: '1.8' }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Educational disclaimer */}
        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-ink-850/60 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
            <p className="text-sm leading-relaxed text-ink-300">
              This article is for educational purposes only and is not a substitute
              for professional veterinary or horticultural advice. Always consult a
              qualified veterinarian for pet health concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Related articles */}
      <div className="mx-auto mt-16 max-w-5xl">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-300" />
          <h2 className="font-display text-xl font-semibold text-ink-50">More articles</h2>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {relatedPosts.map((rp, i) => (
            <button
              key={rp.id}
              onClick={() => onNavigate(`/blog/${rp.id}`)}
              className="group card-surface overflow-hidden text-left transition hover:border-white/[0.10] animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-video overflow-hidden bg-ink-900">
                <img
                  src={rp.image}
                  alt={rp.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <span className={`chip border text-[10px] ${CATEGORY_COLORS[rp.category]}`}>
                  {CATEGORY_LABELS[rp.category]}
                </span>
                <h3 className="mt-3 font-display text-sm font-semibold leading-snug text-ink-50">
                  {rp.title}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-300">
                  Read <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
