import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Link, ArrowSquareOut, DownloadSimple } from '@phosphor-icons/react';
import { buildTenantUrl, getTenant } from '../../utils/tenant';
import { useTenantPageEnabled } from '../../utils/useTenantPageEnabled';

export function PublicPageCard() {
    const slug = getTenant();
    const url = slug ? `${buildTenantUrl(slug)}/sobre-mi` : null;
    const canvasRef = useRef<HTMLDivElement>(null);
    const habilitado = useTenantPageEnabled();

    const handleDownload = () => {
        const canvas = canvasRef.current?.querySelector('canvas');
        if (!canvas) return;
        const png = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = png;
        a.download = `qr-${slug ?? 'sigele'}.png`;
        a.click();
    };

    if (!url || !habilitado) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
                <Link size={20} weight="bold" className="text-primary" />
                <h2 className="text-base font-extrabold text-gray-900">Mi página pública</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* QR */}
                <div ref={canvasRef} className="shrink-0 p-3 bg-white rounded-xl border border-gray-200 shadow-inner">
                    <QRCodeCanvas
                        value={url}
                        size={160}
                        bgColor="#ffffff"
                        fgColor="#111827"
                        level="M"
                        marginSize={1}
                    />
                </div>

                {/* Info + acciones */}
                <div className="flex flex-col gap-4 w-full">
                    <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                            URL pública
                        </p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary break-all hover:underline"
                        >
                            {url}
                            <ArrowSquareOut size={15} weight="bold" className="shrink-0" />
                        </a>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                        Compartí este QR en volantes, redes sociales o en tu local de campaña para que los electores accedan a tu página con un solo escaneo.
                    </p>

                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold btn-primary shadow-sm"
                        >
                            <DownloadSimple size={16} weight="bold" />
                            Descargar QR
                        </button>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowSquareOut size={16} weight="bold" />
                            Ver página
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
