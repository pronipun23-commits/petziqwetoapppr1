import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  downloadable?: boolean;
  filename?: string;
}

export function QRCodeDisplay({
  value,
  size = 180,
  className = '',
  downloadable = false,
  filename = 'petziq-smart-tag-qr.png',
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    }).catch(() => {});
  }, [value, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`inline-flex items-center justify-center rounded-2xl bg-white p-3 ${className}`}>
        <canvas ref={canvasRef} />
      </div>
      {downloadable && (
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-brand-300 hover:bg-brand-500/10 hover:border-brand-500/30 transition shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          Download QR Image
        </button>
      )}
    </div>
  );
}
