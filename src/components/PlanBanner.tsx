import { WhatsappLogo, Warning, XCircle, Hourglass } from '@phosphor-icons/react';
import { usePlanStore } from '../store/planStore';

const WA_PLAN = `https://wa.me/595985851696?text=${encodeURIComponent('Hola, necesito ampliar mi plan en SIGELE.')}`;

export function PlanBanner() {
    const plan = usePlanStore((s) => s.plan);

    if (!plan || plan.esPlanFull) return null;

    const pct = Math.round(plan.porcentajeUso);

    if (plan.captacionBloqueada) {
        return (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2.5 min-w-0">
                    <XCircle size={18} weight="fill" className="text-red-500 shrink-0" />
                    <p className="text-sm font-bold text-red-700 truncate">
                        Superaste el límite de {plan.electorLimit.toLocaleString('es-PY')} electores.{' '}
                        <span className="font-extrabold">Ampliá tu plan</span> para seguir captando.
                    </p>
                </div>
                <a
                    href={WA_PLAN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                >
                    <WhatsappLogo size={14} weight="fill" />
                    Ampliar
                </a>
            </div>
        );
    }

    if (plan.enGracia) {
        return (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-yellow-50 border border-yellow-200">
                <div className="flex items-center gap-2.5 min-w-0">
                    <Hourglass size={18} weight="fill" className="text-yellow-600 shrink-0" />
                    <p className="text-sm font-bold text-yellow-800 truncate">
                        Período de gracia activo. Superaste el plan de {plan.electorLimit.toLocaleString('es-PY')} electores.{' '}
                        <span className="font-extrabold">Ampliá tu plan</span> para evitar el bloqueo.
                    </p>
                </div>
                <a
                    href={WA_PLAN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold transition-colors"
                >
                    <WhatsappLogo size={14} weight="fill" />
                    Ampliar
                </a>
            </div>
        );
    }

    if (pct >= 80) {
        return (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-orange-50 border border-orange-200">
                <div className="flex items-center gap-2.5 min-w-0">
                    <Warning size={18} weight="fill" className="text-orange-500 shrink-0" />
                    <p className="text-sm font-bold text-orange-800 truncate">
                        Usaste el {pct}% de tu capacidad ({plan.electorCount.toLocaleString('es-PY')}/{plan.electorLimit.toLocaleString('es-PY')} electores).{' '}
                        Considerá ampliar tu plan.
                    </p>
                </div>
                <a
                    href={WA_PLAN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
                >
                    <WhatsappLogo size={14} weight="fill" />
                    Ampliar
                </a>
            </div>
        );
    }

    return null;
}
