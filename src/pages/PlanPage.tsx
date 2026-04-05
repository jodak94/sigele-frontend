import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    WhatsappLogo,
    CheckCircle,
    Warning,
    XCircle,
    Package,
    Users,
    CalendarBlank,
    Hourglass,
} from '@phosphor-icons/react';
import { getTenantPlan } from '../api/planApi';
import type { TenantPlan } from '../types/plan';

const WA_PAQUETES = `https://wa.me/595985851696?text=${encodeURIComponent('Hola, me interesa adquirir un paquete adicional para SIGELE.')}`;

function formatGuaranies(amount: number): string {
    return new Intl.NumberFormat('es-PY', {
        style: 'currency',
        currency: 'PYG',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-PY', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function UsageBar({ porcentaje, bloqueada }: { porcentaje: number; bloqueada: boolean }) {
    const pct = Math.min(100, Math.round(porcentaje));
    const color =
        bloqueada ? 'bg-red-500' :
        pct >= 90  ? 'bg-orange-500' :
        pct >= 70  ? 'bg-yellow-500' :
        'bg-green-500';

    return (
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
                className={`h-3 rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

function StatusBadge({ plan }: { plan: TenantPlan }) {
    if (plan.accesoVencido) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                <XCircle size={14} weight="fill" />
                Acceso vencido
            </span>
        );
    }
    if (plan.captacionBloqueada) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                <XCircle size={14} weight="fill" />
                Captación bloqueada
            </span>
        );
    }
    if (plan.enGracia) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                <Hourglass size={14} weight="fill" />
                En período de gracia
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
            <CheckCircle size={14} weight="fill" />
            Plan activo
        </span>
    );
}

export function PlanPage() {
    const navigate = useNavigate();
    const [plan, setPlan] = useState<TenantPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getTenantPlan()
            .then(setPlan)
            .catch(() => setError(true))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-black">Mi Plan</h1>
                    <p className="text-gray-500 font-medium">Estado de tu suscripción y paquetes contratados.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 font-bold text-sm flex items-center"
                    >
                        <ArrowLeft size={16} weight="bold" className="mr-2" />
                        Volver
                    </button>
                    <a
                        href={WA_PAQUETES}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center shadow-sm btn-primary"
                    >
                        <WhatsappLogo size={16} weight="fill" className="mr-2" />
                        Adquirir paquete
                    </a>
                </div>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-full" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
                    <Warning size={24} className="text-red-500 shrink-0" weight="fill" />
                    <p className="text-red-700 font-medium">No se pudo cargar la información del plan. Intenta de nuevo más tarde.</p>
                </div>
            )}

            {/* Content */}
            {!isLoading && plan && (
                <>
                    {/* Alertas */}
                    {(plan.accesoVencido || plan.captacionBloqueada) && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
                            <XCircle size={22} className="text-red-500 shrink-0 mt-0.5" weight="fill" />
                            <div>
                                <p className="font-bold text-red-800">
                                    {plan.accesoVencido ? 'Tu acceso ha vencido' : 'La captación está bloqueada'}
                                </p>
                                <p className="text-red-600 text-sm mt-0.5">
                                    Contacta a soporte por WhatsApp para regularizar tu plan y reactivar el acceso.
                                </p>
                            </div>
                        </div>
                    )}

                    {plan.enGracia && !plan.accesoVencido && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-3">
                            <Hourglass size={22} className="text-yellow-600 shrink-0 mt-0.5" weight="fill" />
                            <div>
                                <p className="font-bold text-yellow-800">Período de gracia activo</p>
                                <p className="text-yellow-700 text-sm mt-0.5">
                                    Tu plan ha vencido pero aún tienes acceso temporal. Contacta a soporte para renovar.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Uso de electores */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 col-span-1 md:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users size={20} weight="fill" className="text-primary" />
                                    <span className="font-bold text-gray-800">Electores registrados</span>
                                </div>
                                <StatusBadge plan={plan} />
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-extrabold text-black">
                                    {plan.electorCount.toLocaleString('es-PY')}
                                </span>
                                <span className="text-gray-400 font-medium mb-1">
                                    / {plan.electorLimit.toLocaleString('es-PY')} máx.
                                </span>
                            </div>
                            <UsageBar porcentaje={plan.porcentajeUso} bloqueada={plan.captacionBloqueada} />
                            <p className="text-sm text-gray-500">
                                {plan.porcentajeUso.toFixed(1)}% del límite utilizado
                            </p>
                        </div>

                        {/* Vencimiento */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-3">
                                <CalendarBlank size={20} weight="fill" className="text-primary" />
                                <span className="font-bold text-gray-800">Vencimiento</span>
                            </div>
                            {plan.accessExpiresAt ? (
                                <>
                                    <p className="text-xl font-extrabold text-black">
                                        {formatDate(plan.accessExpiresAt)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Fecha de expiración del acceso</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xl font-extrabold text-green-600">Sin vencimiento</p>
                                    <p className="text-sm text-gray-500 mt-1">Acceso sin límite de fecha</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Paquetes */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Package size={20} weight="fill" className="text-primary" />
                            <h2 className="font-bold text-gray-800">Paquetes contratados</h2>
                            <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                {plan.paquetes.length}
                            </span>
                        </div>

                        {plan.paquetes.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-400">
                                <Package size={40} className="mx-auto mb-2 opacity-30" />
                                <p className="font-medium">No hay paquetes contratados</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {plan.paquetes.map((pkg, i) => (
                                    <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                                <Package size={18} weight="fill" className="text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{pkg.label}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Adquirido el {formatDate(pkg.purchasedAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-extrabold text-gray-900">
                                                +{pkg.electoresAgregados.toLocaleString('es-PY')} electores
                                            </p>
                                            <p className="text-xs text-gray-500">{formatGuaranies(pkg.precio)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="bg-black rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-white font-extrabold text-lg">¿Necesitás más capacidad?</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Adquirí paquetes adicionales de electores directamente por WhatsApp.
                            </p>
                        </div>
                        <a
                            href={WA_PAQUETES}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm btn-primary shrink-0 whitespace-nowrap"
                        >
                            <WhatsappLogo size={18} weight="fill" />
                            Contactar por WhatsApp
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}
