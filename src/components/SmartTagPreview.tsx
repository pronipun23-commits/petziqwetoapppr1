import { PawPrint, Sprout } from 'lucide-react';
import { TagProductPreview } from './TagProductPreview';
import type { TagType } from '@/hooks/useSmartTags';

interface SmartTagPreviewProps {
  tagType: TagType;
  name: string;
  tagId: string;
  photoUrl?: string | null;
  details?: Record<string, string>;
  compact?: boolean;
  className?: string;
}

export function SmartTagPreview({
  tagType,
  name,
  tagId,
  photoUrl,
  compact = false,
  className = '',
}: SmartTagPreviewProps) {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] glass p-3 ${className}`}>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand-500/15 blur-xl" />
          <div className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border-2 border-white/10 bg-gradient-to-br from-ink-800 to-ink-900">
            {photoUrl ? (
              <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
            ) : tagType === 'pet' ? (
              <PawPrint className="h-7 w-7 text-brand-300" />
            ) : (
              <Sprout className="h-7 w-7 text-brand-300" />
            )}
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-ink-50 truncate">{name || 'Untitled Tag'}</p>
          <p className="font-mono text-xs text-ink-400">{tagId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Ambient glow */}
      <div className="absolute -inset-8 rounded-3xl bg-gradient-to-b from-brand-500/10 via-cyan-500/5 to-transparent blur-2xl" />

      <div className="relative flex flex-col items-center">
        {/* Physical product mockup — the same render used by the Smart Tags
            shop configurator, so the create flow preview matches the product. */}
        <TagProductPreview petName={name} tagId={tagId} shape="round" color="black" side="front" />

        {photoUrl && (
          <div className="-mt-5 h-16 w-16 overflow-hidden rounded-full border-2 border-white/15 shadow-soft">
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
          </div>
        )}

        {/* Info */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">
            {tagType === 'pet' ? (
              <>
                <PawPrint className="h-3 w-3" />
                Pet Smart Tag
              </>
            ) : (
              <>
                <Sprout className="h-3 w-3" />
                Plant Smart Tag
              </>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-400">
            Scan QR to view public profile
          </p>
        </div>
      </div>
    </div>
  );
}
