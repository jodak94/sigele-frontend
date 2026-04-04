import { useState } from 'react';
import { WarningCircle, ArrowRight, Buildings } from '@phosphor-icons/react';
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
            className="min-h-screen bg-[#f3e8d2] flex flex-col items-center justify-center p-6 sigele-public"
            style={{
                fontFamily: FONT_BODY,
                backgroundImage:
                    'linear-gradient(rgba(120,80,40,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,80,40,0.06) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
            }}
        >
            {/* Top glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(213,43,30,0.07) 0%, transparent 70%)',
                }}
            />

            {/* Logo */}
            <div className="relative flex items-center mb-10">
                <img src="/logo_letras.png" alt="SIGELE" className="h-12 w-auto" />
            </div>

            <div className="relative w-full max-w-sm">
                <div
                    style={{
                        background: '#fefaf4',
                        border: '1px solid rgba(180,130,70,0.28)',
                        borderRadius: '18px',
                        padding: '32px',
                        boxShadow: '0 4px 24px rgba(100,60,20,0.1)',
                    }}
                >
                    {/* Icon */}
                    <div
                        className="w-14 h-14 flex items-center justify-center mx-auto mb-6 rounded-xl"
                        style={{
                            background: 'rgba(213,43,30,0.07)',
                            border: '1px solid rgba(213,43,30,0.2)',
                        }}
                    >
                        <Buildings size={28} weight="bold" className="text-[#D52B1E]" />
                    </div>

                    <h1
                        style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.025em' }}
                        className="text-xl font-black text-[#1c1208] text-center mb-3"
                    >
                        Acceso con link de organización
                    </h1>

                    <p className="text-[#6b5035] text-sm leading-relaxed text-center mb-7 font-medium">
                        El acceso es del tipo{' '}
                        <span className="text-[#D52B1E] font-bold font-mono">tuorganizacion.sigele.com.py</span>
                    </p>

                    {/* Input */}
                    <div className="mb-4">
                        <label
                            className="block text-xs font-bold text-[#8a6840] uppercase tracking-widest mb-2"
                            style={{ letterSpacing: '0.1em' }}
                        >
                            Nombre de organización
                        </label>
                        <div
                            className="flex items-center overflow-hidden transition-all"
                            style={{
                                background: '#ffffff',
                                border: '1px solid rgba(180,130,70,0.3)',
                                borderRadius: '10px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}
                        >
                            <input
                                type="text"
                                value={tenant}
                                onChange={(e) =>
                                    setTenant(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="tuorganizacion"
                                className="flex-1 px-4 py-3 bg-transparent outline-none text-[#1c1208] font-bold placeholder:text-[#c4a882] text-sm focus:outline-none"
                                style={{ caretColor: '#D52B1E' }}
                            />
                            <span className="pr-4 text-[#9a7a55] text-xs font-bold whitespace-nowrap">
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
                                ? 'linear-gradient(135deg, #D52B1E, #b02318)'
                                : 'rgba(213,43,30,0.4)',
                            boxShadow: tenant.trim() ? '0 4px 16px rgba(213,43,30,0.3)' : 'none',
                        }}
                    >
                        Ir a mi organización
                        <ArrowRight size={15} weight="bold" />
                    </button>

                    <div className="flex items-start gap-2 justify-center text-[#9a7a55] text-xs font-medium text-center">
                        <WarningCircle size={13} weight="fill" className="shrink-0 mt-0.5" />
                        Si no tienes un link, contacta al responsable de tu campaña.
                    </div>
                </div>

                <div className="mt-5 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#8a6840] hover:text-[#1c1208] text-sm font-medium transition-colors"
                    >
                        ← Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}
