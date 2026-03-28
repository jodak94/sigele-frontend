import { useState } from 'react';
import { ShieldCheck, WarningCircle, ArrowRight, Buildings } from '@phosphor-icons/react';
import { buildTenantUrl } from '../utils/tenant';
import { useNavigate } from 'react-router-dom';

const FONT_DISPLAY = "'Epilogue', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

export function NoTenantPage() {
    const navigate = useNavigate();
    const [tenant, setTenant] = useState('');

    const handleGo = () => {
        const t = tenant.trim().toLowerCase();
        if (!t) return;
        window.location.href = buildTenantUrl(t);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleGo();
    };

    return (
        <div
            className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 sigele-public"
            style={{
                fontFamily: FONT_BODY,
                backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
            }}
        >
            {/* Top glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(13,148,136,0.08) 0%, transparent 70%)',
                }}
            />

            {/* Logo */}
            <div className="relative flex items-center gap-2.5 mb-12">
                <ShieldCheck size={28} weight="fill" className="text-teal-400" />
                <span
                    style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.025em' }}
                    className="font-black text-white text-2xl"
                >
                    SIGELE
                </span>
            </div>

            <div className="relative w-full max-w-sm">
                <div
                    style={{
                        background: 'linear-gradient(145deg, #071a18 0%, #050e0d 100%)',
                        border: '1px solid rgba(20,184,166,0.2)',
                        borderRadius: '18px',
                        padding: '32px',
                        boxShadow: '0 0 0 1px rgba(20,184,166,0.07), 0 40px 80px rgba(0,0,0,0.55)',
                    }}
                >
                    {/* Icon */}
                    <div
                        className="w-14 h-14 flex items-center justify-center mx-auto mb-6 rounded-xl"
                        style={{
                            background: 'rgba(20,184,166,0.08)',
                            border: '1px solid rgba(20,184,166,0.22)',
                        }}
                    >
                        <Buildings size={28} weight="bold" className="text-teal-400" />
                    </div>

                    <h1
                        style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.025em' }}
                        className="text-xl font-black text-white text-center mb-3"
                    >
                        Acceso con link de organización
                    </h1>

                    <p className="text-slate-400 text-sm leading-relaxed text-center mb-7 font-medium">
                        El acceso es del tipo{' '}
                        <span className="text-teal-400 font-bold font-mono">tuorganizacion.sigele.com.py</span>
                    </p>

                    {/* Input */}
                    <div className="mb-4">
                        <label
                            className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2"
                            style={{ letterSpacing: '0.1em' }}
                        >
                            Nombre de organización
                        </label>
                        <div
                            className="flex items-center overflow-hidden transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                            }}
                            onFocus={() => {}}
                        >
                            <input
                                type="text"
                                value={tenant}
                                onChange={(e) =>
                                    setTenant(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="tuorganizacion"
                                className="flex-1 px-4 py-3 bg-transparent outline-none text-white font-bold placeholder:text-slate-600 text-sm focus:outline-none"
                                style={{
                                    caretColor: '#60a5fa',
                                }}
                            />
                            <span className="pr-4 text-slate-500 text-xs font-bold whitespace-nowrap">
                                .sigele.com.py
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleGo}
                        disabled={!tenant.trim()}
                        className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-lg transition-all mb-5 mt-1 disabled:opacity-35 disabled:cursor-not-allowed"
                        style={{
                            background: tenant.trim()
                                ? 'linear-gradient(135deg, #0d9488, #0f766e)'
                                : 'rgba(13,148,136,0.5)',
                            boxShadow: tenant.trim() ? '0 4px 16px rgba(13,148,136,0.35)' : 'none',
                        }}
                    >
                        Ir a mi organización
                        <ArrowRight size={15} weight="bold" />
                    </button>

                    <div className="flex items-start gap-2 justify-center text-slate-600 text-xs font-medium text-center">
                        <WarningCircle size={13} weight="fill" className="shrink-0 mt-0.5" />
                        Si no tienes un link, contacta al responsable de tu campaña.
                    </div>
                </div>

                <div className="mt-5 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                    >
                        ← Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}
