import { Compass } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="container-px pt-24 pb-24 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.05] text-ink-300">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold text-ink-50">
        Page not found
      </h1>
      <p className="mt-3 text-ink-400">
        The page you are looking for does not exist or has moved.
      </p>
      <button onClick={() => onNavigate('/')} className="btn-primary mt-8">
        Back home
      </button>
    </div>
  );
}
