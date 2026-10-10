import { useId } from 'react';
import { PawPrint } from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { getTagPublicUrl } from '@/lib/tagUtils';

/**
 * Photoreal-style Petziq Smart Tag product render.
 *
 * Draws the physical tag (metal rim, glossy face, keyring, engraved back) as
 * layered SVG so shape/colour selections read like a real acrylic/metal product
 * rather than a webpage card. The QR is the customer's real generated code from
 * the existing QRCodeDisplay component.
 */

export type TagShape = 'round' | 'bone' | 'heart' | 'rectangle';
export type TagColor = 'black' | 'blue' | 'pink' | 'silver' | 'gold';

export const TAG_SHAPES: { id: TagShape; label: string }[] = [
  { id: 'round', label: 'Round' },
  { id: 'bone', label: 'Bone' },
  { id: 'heart', label: 'Heart' },
  { id: 'rectangle', label: 'Rectangle' },
];

export const TAG_COLORS: { id: TagColor; label: string }[] = [
  { id: 'black', label: 'Black' },
  { id: 'blue', label: 'Blue' },
  { id: 'pink', label: 'Pink' },
  { id: 'silver', label: 'Silver' },
  { id: 'gold', label: 'Gold' },
];

interface TagProductPreviewProps {
  petName: string;
  tagId: string;
  shape: TagShape;
  color: TagColor;
  side: 'front' | 'back';
  className?: string;
}

const S = 190; // tag body box in px (SVG user units == px)

/** Per-colour face/rim gradients and text treatments. */
const COLOR_THEMES: Record<
  TagColor,
  {
    face: [string, string, string];
    rim: [string, string, string, string];
    lightText: boolean;
  }
> = {
  black: {
    face: ['#313d4d', '#141c26', '#04060a'],
    rim: ['#f8fafc', '#7c8798', '#e5eaf1', '#4b5565'],
    lightText: true,
  },
  blue: {
    face: ['#3b82f6', '#1d4ed8', '#122c72'],
    rim: ['#dbeafe', '#60a5fa', '#93c5fd', '#1e3a8a'],
    lightText: true,
  },
  pink: {
    face: ['#f472b6', '#db2777', '#831843'],
    rim: ['#fce7f3', '#f9a8d4', '#fbcfe8', '#9d174d'],
    lightText: true,
  },
  silver: {
    face: ['#f6f8fb', '#ccd5de', '#9fadb9'],
    rim: ['#ffffff', '#94a3b8', '#e2e8f0', '#64748b'],
    lightText: false,
  },
  gold: {
    face: ['#fde68a', '#f59e0b', '#92610a'],
    rim: ['#fef3c7', '#fbbf24', '#fcd34d', '#92400e'],
    lightText: false,
  },
};

/** Content insets per shape so text/QR stay on the material. */
const CONTENT_BOX: Record<TagShape, string> = {
  round: 'px-7',
  rectangle: 'px-6',
  heart: 'px-8 pt-6',
  bone: 'px-14 pt-3',
};

const QR_SIZE: Record<TagShape, number> = {
  round: 92,
  rectangle: 96,
  heart: 76,
  bone: 60,
};

/** Hole position for the keyring, per shape (top-centre unless noted). */
const HOLE_TOP: Record<TagShape, number> = {
  round: 12,
  rectangle: 14,
  heart: 30,
  bone: 78,
};

function heartPath(s: number): string {
  const k = s / 100;
  return [
    `M ${50 * k} ${88 * k}`,
    `C ${27 * k} ${70 * k} ${8 * k} ${52 * k} ${8 * k} ${33 * k}`,
    `C ${8 * k} ${19 * k} ${19 * k} ${8 * k} ${32 * k} ${8 * k}`,
    `C ${40 * k} ${8 * k} ${47 * k} ${12 * k} ${50 * k} ${19 * k}`,
    `C ${53 * k} ${12 * k} ${60 * k} ${8 * k} ${68 * k} ${8 * k}`,
    `C ${81 * k} ${8 * k} ${92 * k} ${19 * k} ${92 * k} ${33 * k}`,
    `C ${92 * k} ${52 * k} ${73 * k} ${70 * k} ${50 * k} ${88 * k} Z`,
  ].join(' ');
}

/** Dog-bone silhouette as a union of overlapping subpaths (all clockwise). */
function bonePath(s: number): string {
  const k = s / 100;
  const r = 14 * k;
  const knob = (cx: number, cy: number) =>
    `M ${cx * k - r} ${cy * k} a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 ${-2 * r} 0 Z`;
  const bar = `M ${25 * k} ${38 * k} H ${75 * k} V ${62 * k} H ${25 * k} Z`;
  return [knob(25, 38), knob(75, 38), bar, knob(25, 62), knob(75, 62)].join(' ');
}

function ShapeGeometry({
  shape,
  fill,
  stroke,
  strokeWidth,
  scale = 1,
}: {
  shape: TagShape;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  scale?: number;
}) {
  const t =
    scale !== 1
      ? `translate(${S / 2} ${S / 2}) scale(${scale}) translate(${-S / 2} ${-S / 2})`
      : undefined;
  const props = {
    fill,
    stroke,
    strokeWidth,
    transform: t,
  };
  switch (shape) {
    case 'round':
      return <circle cx={S / 2} cy={S / 2} r={S / 2 - 2} {...props} />;
    case 'rectangle':
      return <rect x={10} y={8} width={S - 20} height={S - 16} rx={30} {...props} />;
    case 'heart':
      return <path d={heartPath(S)} {...props} />;
    case 'bone':
      return <path d={bonePath(S)} fillRule="nonzero" {...props} />;
  }
}

/** Brand lockup: paw + Petziq wordmark, light-on-dark or engraved-on-metal. */
function BrandLockup({ light, small = false }: { light: boolean; small?: boolean }) {
  const tone = light ? 'text-white' : 'text-slate-900';
  return (
    <div className="flex items-center justify-center gap-1">
      <PawPrint
        className={`${small ? 'h-3 w-3' : 'h-4 w-4'} ${tone}`}
        fill="currentColor"
        strokeWidth={0}
      />
      <span
        className={`font-display font-extrabold tracking-tight ${tone} ${
          small ? 'text-[11px]' : 'text-sm'
        }`}
      >
        Petziq
      </span>
    </div>
  );
}

export function TagProductPreview({
  petName,
  tagId,
  shape,
  color,
  side,
  className = '',
}: TagProductPreviewProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const theme = COLOR_THEMES[color];
  const displayName = petName.trim() || 'Your Pet';

  const faceId = `face-${uid}`;
  const rimId = `rim-${uid}`;
  const sheenId = `sheen-${uid}`;
  const shadeId = `shade-${uid}`;
  const clipId = `clip-${uid}`;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Keyring */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ marginBottom: shape === 'bone' ? '-0.25rem' : '-0.6rem' }}
      >
        <div
          className="h-8 w-8 rounded-full"
          style={{
            border: '3.5px solid transparent',
            borderTopColor: '#e2e8f0',
            borderRightColor: '#8b96a5',
            borderBottomColor: '#5c6675',
            borderLeftColor: '#c3ccd6',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.55))',
          }}
        />
        <div
          className="-mt-1 h-3 w-5 rounded-b-md"
          style={{
            background: 'linear-gradient(180deg,#cbd5e1 0%,#7c8798 70%,#565f6e 100%)',
          }}
        />
      </div>

      {/* Tag body */}
      <div className="relative" style={{ width: S, height: S }}>
        <svg
          width={S}
          height={S}
          viewBox={`0 0 ${S} ${S}`}
          className="absolute inset-0 drop-shadow-[0_20px_32px_rgba(0,0,0,0.55)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={faceId} x1="0" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stopColor={theme.face[0]} />
              <stop offset="52%" stopColor={theme.face[1]} />
              <stop offset="100%" stopColor={theme.face[2]} />
            </linearGradient>
            <linearGradient id={rimId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={theme.rim[0]} />
              <stop offset="30%" stopColor={theme.rim[1]} />
              <stop offset="62%" stopColor={theme.rim[2]} />
              <stop offset="100%" stopColor={theme.rim[3]} />
            </linearGradient>
            <radialGradient id={sheenId} cx="0.32" cy="0.2" r="0.85">
              <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
              <stop offset="34%" stopColor="rgba(255,255,255,0.10)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <radialGradient id={shadeId} cx="0.5" cy="1" r="0.9">
              <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
              <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <clipPath id={clipId}>
              <ShapeGeometry shape={shape} fill="#000" />
            </clipPath>
          </defs>

          {/* Metal rim */}
          <ShapeGeometry shape={shape} fill={`url(#${rimId})`} scale={1.055} />

          {/* Face + lighting, clipped to the silhouette */}
          <g clipPath={`url(#${clipId})`}>
            <ShapeGeometry shape={shape} fill={`url(#${faceId})`} />
            <rect width={S} height={S} fill={`url(#${sheenId})`} />
            <ellipse
              cx={S / 2}
              cy={S * 1.04}
              rx={S * 0.56}
              ry={S * 0.34}
              fill={`url(#${shadeId})`}
            />
          </g>

          {/* Engraved edge between rim and face */}
          <ShapeGeometry
            shape={shape}
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={1.4}
          />
        </svg>

        {/* Keyring hole through the material */}
        <span
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-ink-950 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)]"
          style={{ top: HOLE_TOP[shape], width: 13, height: 13 }}
        />

        {/* Printed / engraved content */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center ${CONTENT_BOX[shape]}`}
        >
          {side === 'front' ? (
            <>
              <BrandLockup light={theme.lightText} />
              <p
                className={`mt-0.5 w-full truncate font-display text-lg font-extrabold tracking-tight ${
                  theme.lightText ? 'text-white' : 'text-slate-900'
                }`}
              >
                {displayName}
              </p>
              <div className="mt-1.5 rounded-xl bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                <QRCodeDisplay
                  value={getTagPublicUrl(tagId)}
                  size={QR_SIZE[shape]}
                  className="!bg-transparent !p-0"
                />
              </div>
              <p
                className={`mt-1.5 text-[9px] font-medium ${
                  theme.lightText ? 'text-white/80' : 'text-slate-800/90'
                }`}
              >
                Scan for my profile
              </p>
              <PawPrint
                className={`mt-1 h-3 w-3 ${
                  theme.lightText ? 'text-white/70' : 'text-slate-900/70'
                }`}
                fill="currentColor"
                strokeWidth={0}
              />
            </>
          ) : (
            <>
              <BrandLockup light={theme.lightText} small />
              <p
                className={`mt-2 w-full truncate font-display text-xl font-extrabold tracking-tight ${
                  theme.lightText ? 'text-white' : 'text-slate-900'
                }`}
              >
                {displayName}
              </p>
              <p
                className={`mt-1 font-mono text-[10px] tracking-wide ${
                  theme.lightText ? 'text-white/85' : 'text-slate-800'
                }`}
              >
                ID: {tagId}
              </p>
              <PawPrint
                className={`mt-2.5 h-3.5 w-3.5 ${
                  theme.lightText ? 'text-white/75' : 'text-slate-900/70'
                }`}
                fill="currentColor"
                strokeWidth={0}
              />
              <p
                className={`mt-1.5 text-[10px] font-semibold ${
                  theme.lightText ? 'text-white/80' : 'text-slate-800/90'
                }`}
              >
                petziq.com
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
