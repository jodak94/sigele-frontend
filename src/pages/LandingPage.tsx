import {
    ShieldCheck,
    Users,
    ChartBar,
    MapPin,
    Palette,
    ArrowRight,
    CheckCircle,
    WhatsappLogo,
    MagnifyingGlass,
    UserPlus,
    Briefcase,
    Buildings,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const WA_NUMBER = '595972195087';
const WA_INFO = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me interesa obtener más información sobre SIGELE.')}`;
const WA_DEMO = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, quisiera solicitar una demo de SIGELE para mi campaña.')}`;

const features = [
    {
        icon: MagnifyingGlass,
        title: 'Padrón Electoral Público',
        description:
            'Consulta instantánea del padrón. Cualquier ciudadano puede verificar su mesa y local de votación desde cualquier dispositivo.',
    },
    {
        icon: UserPlus,
        title: 'Captación Masiva',
        description:
            'Operadores registran electores en segundos. El foco vuelve automáticamente al campo de búsqueda para cargas continuas sin fricción.',
    },
    {
        icon: ChartBar,
        title: 'Reportes en Tiempo Real',
        description:
            'Estadísticas de captación por operador, local, mesa y seccional. Exportación a Excel con un clic para análisis fuera de línea.',
    },
    {
        icon: Briefcase,
        title: 'Panel de Coordinadores',
        description:
            'Supervisión completa de operadores, cuotas, rendimiento y electores captados. Todo desde un único panel centralizado.',
    },
    {
        icon: Palette,
        title: 'Branding Personalizado',
        description:
            'Adapta la plataforma a tu campaña: logo, imagen del candidato, colores y título. Cada cliente tiene su identidad propia.',
    },
    {
        icon: ShieldCheck,
        title: 'Seguro y Multi-tenant',
        description:
            'Arquitectura multi-tenant con roles diferenciados: operadores, coordinadores y administradores. Datos aislados por campaña.',
    },
];

const steps = [
    {
        number: '01',
        title: 'Configura tu campaña',
        description: 'Personaliza el branding, crea operadores y coordinadores en minutos.',
    },
    {
        number: '02',
        title: 'Moviliza tu equipo',
        description: 'Cada operador captura electores desde su celular, en campo, sin papel.',
    },
    {
        number: '03',
        title: 'Analiza y decide',
        description: 'Monitorea el avance en tiempo real y exporta datos para tus estrategas.',
    },
];

const stats = [
    { value: '100%', label: 'Digitalización del proceso' },
    { value: '< 5s', label: 'Por registro de elector' },
    { value: '24/7', label: 'Disponibilidad en la nube' },
    { value: 'Multi', label: 'Campañas simultáneas' },
];

const FONT_DISPLAY = "'Epilogue', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

const MOCK_RANKING = [
    { name: 'J. Martínez', total: 287, pct: 100 },
    { name: 'A. Gómez',    total: 241, pct: 84  },
    { name: 'C. López',    total: 198, pct: 69  },
    { name: 'R. Benítez',  total: 156, pct: 54  },
];

const MOCK_KPIS = [
    { label: 'Total Activos',   value: '1.247', accent: true  },
    { label: 'Cand. Mesa',      value: '312',   accent: false },
    { label: 'Req. Transporte', value: '89',    accent: false },
    { label: 'Tachados',        value: '23',    accent: false },
];

const MOCK_CONSULTAS = [
    { label: 'Hoy',    value: '142'    },
    { label: 'Ayer',   value: '98'     },
    { label: '7 días', value: '847'    },
    { label: 'Total',  value: '12.431' },
];

const MOCK_COORDS = [
    { name: 'A. Florentín', operadores: 4, electores: 612, mesa: 98,  pct: 100, leader: true  },
    { name: 'M. Villalba',  operadores: 3, electores: 448, mesa: 67,  pct: 73,  leader: false },
];

const SL = (opacity = 0.55) => ({
    fontSize: '9px',
    color: `rgba(148,163,184,${opacity})`,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
});

function DashboardPreview() {
    return (
        <div className="relative dashboard-animate" style={{ fontFamily: FONT_BODY }}>
            <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(13,148,136,0.16) 0%, transparent 70%)' }}
            />
            <div
                style={{
                    background: 'linear-gradient(145deg, #071a18 0%, #050e0d 100%)',
                    border: '1px solid rgba(20,184,166,0.22)',
                    borderRadius: '18px',
                    padding: '16px',
                    position: 'relative',
                    boxShadow: '0 0 0 1px rgba(20,184,166,0.07), 0 48px 96px rgba(0,0,0,0.65)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                {/* Window chrome */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {[0,1,2].map((i) => (
                        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                    ))}
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)', marginLeft: '6px' }} />
                    <span style={SL(0.45)}>Centro de Control</span>
                </div>

                {/* 4 KPI cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
                    {MOCK_KPIS.map((k) => (
                        <div key={k.label} style={{
                            background: 'rgba(255,255,255,0.025)',
                            border: `1px solid ${k.accent ? 'rgba(20,184,166,0.25)' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: '8px', padding: '7px 9px',
                        }}>
                            <div style={{ ...SL(), marginBottom: '3px' }}>{k.label}</div>
                            <div style={{
                                fontSize: '17px', fontWeight: '900', lineHeight: 1,
                                letterSpacing: '-0.03em', fontFamily: FONT_DISPLAY,
                                color: k.accent ? '#2dd4bf' : 'white',
                                fontVariantNumeric: 'tabular-nums',
                            }}>{k.value}</div>
                        </div>
                    ))}
                </div>

                {/* Buscador de Electores */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ ...SL(0.45), marginBottom: '8px' }}>Buscar Elector en Listas</div>
                    {/* Input row */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                            borderRadius: '7px', padding: '5px 9px', gap: '6px',
                        }}>
                            <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.4)' }}>🔍</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>3.421.876</span>
                        </div>
                        <div style={{
                            padding: '5px 10px', borderRadius: '7px', fontSize: '10px', fontWeight: '700',
                            color: 'white', background: 'rgba(20,184,166,0.2)', border: '1px solid rgba(20,184,166,0.3)',
                            display: 'flex', alignItems: 'center',
                        }}>Verificar</div>
                    </div>
                    {/* Found result */}
                    <div style={{
                        padding: '7px 10px', background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.2)',
                        borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const,
                    }}>
                        <span style={{ fontSize: '10px', color: '#2dd4bf' }}>✓</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>Pedro García R.</span>
                        <span style={{ fontSize: '9px', color: 'rgba(148,163,184,0.5)' }}>CI: 3.421.876</span>
                        <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', background: 'rgba(13,148,136,0.6)', color: 'white' }}>Mesa</span>
                        <span style={{ fontSize: '9px', color: 'rgba(148,163,184,0.5)' }}>Lista de: <span style={{ color: '#2dd4bf', fontWeight: '600' }}>J. Martínez</span></span>
                    </div>
                </div>

                {/* Ranking + Consultas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
                    {/* Ranking */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 12px' }}>
                        <div style={{ ...SL(0.45), marginBottom: '8px' }}>Ranking Cargas</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                            {MOCK_RANKING.map((op, i) => (
                                <div key={op.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontWeight: '600', display: 'flex', gap: '4px' }}>
                                            <span style={{ color: 'rgba(148,163,184,0.4)', fontWeight: '700' }}>{i + 1}.</span>
                                            {op.name}
                                        </span>
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#2dd4bf', fontVariantNumeric: 'tabular-nums' }}>{op.total}</span>
                                    </div>
                                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                                        <div style={{ height: '100%', width: `${op.pct}%`, background: 'linear-gradient(90deg, #0d9488, #2dd4bf)', borderRadius: '2px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Consultas */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 12px' }}>
                        <div style={{ ...SL(0.45), marginBottom: '8px' }}>Consultas al Padrón</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                            {MOCK_CONSULTAS.map((c) => (
                                <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.55)', fontWeight: '500' }}>{c.label}</span>
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'white', fontVariantNumeric: 'tabular-nums', fontFamily: FONT_DISPLAY }}>{c.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desempeño por Coordinador */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ ...SL(0.45), marginBottom: '8px' }}>Desempeño por Coordinador</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {MOCK_COORDS.map((c) => (
                            <div key={c.name} style={{
                                background: 'rgba(255,255,255,0.025)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '8px', padding: '9px 10px',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                {/* Left accent bar */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '3px', height: '100%',
                                    background: c.leader ? '#14b8a6' : 'rgba(148,163,184,0.3)',
                                    borderRadius: '8px 0 0 8px',
                                }} />
                                <div style={{ paddingLeft: '6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.85)', fontFamily: FONT_DISPLAY }}>{c.name}</div>
                                            <div style={{ fontSize: '9px', color: 'rgba(148,163,184,0.5)', marginTop: '1px' }}>{c.operadores} operadores</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '16px', fontWeight: '900', color: c.leader ? '#2dd4bf' : 'white', fontFamily: FONT_DISPLAY, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{c.electores}</div>
                                            <div style={{ fontSize: '8px', color: 'rgba(148,163,184,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>electores</div>
                                        </div>
                                    </div>
                                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginBottom: '5px' }}>
                                        <div style={{ height: '100%', width: `${c.pct}%`, background: c.leader ? 'linear-gradient(90deg,#0d9488,#2dd4bf)' : 'rgba(148,163,184,0.35)', borderRadius: '2px' }} />
                                    </div>
                                    <div style={{ fontSize: '9px', color: 'rgba(148,163,184,0.5)' }}>
                                        {c.mesa} <span style={{ opacity: 0.6 }}>miembros mesa</span>
                                        {c.leader && <span style={{ marginLeft: '6px', color: '#2dd4bf' }}>🏆</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OperatorPhoneMockup() {
    return (
        <div style={{ fontFamily: FONT_BODY, maxWidth: '240px', margin: '0 auto' }}>
            {/* Phone frame */}
            <div style={{
                background: 'linear-gradient(145deg, #071a18 0%, #050e0d 100%)',
                border: '1px solid rgba(20,184,166,0.2)',
                borderRadius: '24px',
                padding: '16px',
                boxShadow: '0 0 0 1px rgba(20,184,166,0.06), 0 32px 64px rgba(0,0,0,0.7)',
                position: 'relative',
            }}>
                {/* Notch */}
                <div style={{ width: '60px', height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', margin: '0 auto 14px' }} />

                {/* Header */}
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: 'white', fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}>Panel Operativo</div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px', padding: '5px 8px', flex: 1 }}>
                            <div style={SL()}>Activos</div>
                            <div style={{ fontSize: '16px', fontWeight: '900', color: 'white', fontFamily: FONT_DISPLAY }}>47</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px', padding: '5px 8px', flex: 1 }}>
                            <div style={SL()}>Mesa</div>
                            <div style={{ fontSize: '16px', fontWeight: '900', color: '#2dd4bf', fontFamily: FONT_DISPLAY }}>12</div>
                        </div>
                    </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '12px' }} />

                {/* Capture form */}
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.65)', marginBottom: '8px' }}>Cargar Elector</div>

                {/* CI */}
                <div style={{ marginBottom: '7px' }}>
                    <div style={{ ...SL(), marginBottom: '3px' }}>Cédula</div>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '7px', overflow: 'hidden' }}>
                        <span style={{ flex: 1, padding: '5px 8px', fontSize: '11px', color: 'white', fontWeight: '700' }}>1.234.567</span>
                        <span style={{ padding: '5px 7px', fontSize: '10px', color: '#2dd4bf' }}>🔍</span>
                    </div>
                </div>

                {/* Found */}
                <div style={{ marginBottom: '7px', padding: '5px 8px', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.22)', borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#2dd4bf', fontSize: '10px' }}>✓</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)', fontWeight: '600' }}>Carlos Martínez R.</span>
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '7px' }}>
                    <div style={{ ...SL(), marginBottom: '3px' }}>Teléfono *</div>
                    <div style={{ padding: '5px 8px', fontSize: '11px', color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px' }}>0981 123 456</div>
                </div>

                {/* Checkboxes */}
                <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                        { label: 'Miembro de Mesa', checked: true },
                        { label: 'Requiere Transporte', checked: false },
                    ].map((cb) => (
                        <div key={cb.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '11px', height: '11px', borderRadius: '3px', flexShrink: 0, border: cb.checked ? '1.5px solid rgba(20,184,166,0.7)' : '1.5px solid rgba(255,255,255,0.12)', background: cb.checked ? 'rgba(20,184,166,0.15)' : 'transparent' }} />
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontWeight: '500' }}>{cb.label}</span>
                        </div>
                    ))}
                </div>

                {/* Button */}
                <div style={{ padding: '7px', textAlign: 'center', background: 'linear-gradient(135deg, #0d9488, #0f766e)', borderRadius: '8px', fontSize: '10px', fontWeight: '700', color: 'white' }}>
                    Registrar Captación
                </div>
            </div>
        </div>
    );
}

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen antialiased sigele-public">

            {/* ── Navbar ── */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/96 backdrop-blur-md border-b border-slate-800/70">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={24} weight="fill" className="text-teal-400" />
                        <span
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}
                            className="font-black text-white text-xl"
                        >
                            SIGELE
                        </span>
                        <div className="hidden sm:block w-px h-4 bg-slate-700 mx-0.5" />
                        <span className="hidden sm:block text-xs font-medium text-slate-500 tracking-wide">
                            Gestión Electoral
                        </span>
                    </div>
                    <nav className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/padron')}
                            className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2"
                        >
                            Consultar Padrón
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden sm:block text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all px-4 py-2 rounded-lg"
                        >
                            Ingresar
                        </button>
                        <a
                            href={WA_DEMO}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-teal-600/30"
                        >
                            <WhatsappLogo size={15} weight="fill" />
                            Solicitar Demo
                        </a>
                    </nav>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="relative bg-slate-950 min-h-screen flex items-center pt-16 overflow-hidden">
                {/* Precision grid background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }}
                />
                {/* Top radial glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(13,148,136,0.1) 0%, transparent 70%)',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center w-full">
                    {/* Left: Copy */}
                    <div className="hero-animate">
                        <div className="inline-flex items-center gap-2 bg-teal-500/8 border border-teal-500/22 text-teal-400 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 live-blip" />
                            Sistema de Gestión Electoral — Paraguay
                        </div>

                        <h1
                            style={{ fontFamily: FONT_DISPLAY, lineHeight: 1.02, letterSpacing: '-0.035em' }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6"
                        >
                            Tecnología que
                            <br />
                            organiza campañas.
                            <br />
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #5eead4 0%, #14b8a6 55%, #0f766e 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Datos que ganan.
                            </span>
                        </h1>

                        <p className="text-slate-400 text-lg max-w-lg mb-10 leading-relaxed font-medium">
                            SIGELE conecta a tu equipo de campo con los datos electorales en tiempo real. Captación
                            masiva, padrón público y reportes — todo en una plataforma.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <a
                                href={WA_DEMO}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] hover:shadow-teal-500/35"
                            >
                                <WhatsappLogo size={20} weight="fill" />
                                Solicitar Demo Gratis
                            </a>
                            <a
                                href={WA_INFO}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-all"
                            >
                                Más información
                                <ArrowRight size={16} weight="bold" />
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            {['Sin contratos largos', 'Implementación rápida', 'Soporte incluido'].map((t) => (
                                <span key={t} className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                    <CheckCircle size={14} weight="fill" className="text-teal-500/70" />
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right: Dashboard preview */}
                    <div className="hidden lg:block">
                        <DashboardPreview />
                    </div>
                </div>
            </section>

            {/* ── Stats strip ── */}
            <section className="bg-slate-900 border-y border-slate-800 py-10 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p
                                style={{
                                    fontFamily: FONT_DISPLAY,
                                    fontVariantNumeric: 'tabular-nums',
                                    letterSpacing: '-0.03em',
                                }}
                                className="text-3xl font-black text-teal-400"
                            >
                                {s.value}
                            </p>
                            <div className="w-6 h-px bg-teal-500/35 mx-auto my-2" />
                            <p className="text-slate-400 text-sm font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-2xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-teal-600" />
                            <p className="text-teal-600 font-bold text-xs uppercase tracking-widest">Funcionalidades</p>
                        </div>
                        <h2
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.03em' }}
                            className="text-4xl font-black text-slate-900 mb-4"
                        >
                            Todo lo que necesita
                            <br />
                            tu campaña
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Una plataforma completa, pensada para la realidad del trabajo político en Paraguay.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="group p-6 bg-slate-50 hover:bg-white border border-slate-200 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50 rounded-xl transition-all duration-200"
                            >
                                <div className="w-10 h-10 bg-teal-50 group-hover:bg-teal-600 rounded-lg flex items-center justify-center mb-5 transition-colors duration-200">
                                    <f.icon
                                        size={20}
                                        weight="bold"
                                        className="text-teal-600 group-hover:text-white transition-colors duration-200"
                                    />
                                </div>
                                <h3
                                    style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}
                                    className="font-bold text-slate-900 mb-2 text-base"
                                >
                                    {f.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Operator in the field ── */}
            <section className="py-24 px-6 bg-slate-950">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Phone mockup */}
                    <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                        <OperatorPhoneMockup />
                    </div>

                    {/* Text */}
                    <div className="order-1 lg:order-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-teal-400" />
                            <p className="text-teal-400 font-bold text-xs uppercase tracking-widest">Panel Operativo</p>
                        </div>
                        <h2
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.03em' }}
                            className="text-4xl font-black text-white mb-5"
                        >
                            El campo, en tiempo real
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8 font-medium">
                            El operador busca al elector por cédula directamente en el padrón,
                            completa los datos logísticos y registra la captación en segundos —
                            desde cualquier celular, sin instalar nada.
                        </p>
                        <ul className="space-y-3">
                            {[
                                'Búsqueda por cédula contra el padrón en tiempo real',
                                'Registro de teléfono y dirección de recogida',
                                'Marcado de disponibilidad para Miembro de Mesa',
                                'Indicación de si requiere transporte el Día D',
                                'Exportación a Excel y PDF con un clic',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-slate-300 text-sm font-medium">
                                    <CheckCircle size={16} weight="fill" className="text-teal-500 shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="py-24 px-6 bg-slate-950">
                <div className="max-w-5xl mx-auto">
                    <div className="max-w-2xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-teal-400" />
                            <p className="text-teal-400 font-bold text-xs uppercase tracking-widest">¿Cómo funciona?</p>
                        </div>
                        <h2
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.03em' }}
                            className="text-4xl font-black text-white"
                        >
                            Tres pasos para digitalizar
                            <br />
                            tu campaña
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {steps.map((step, i) => (
                            <div key={step.number} className="relative">
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-7 left-[calc(50%+36px)] w-[calc(100%-72px)] border-t border-dashed border-slate-700" />
                                )}
                                <div
                                    style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.04em' }}
                                    className="text-7xl font-black text-teal-500/15 leading-none mb-5 select-none"
                                >
                                    {step.number}
                                </div>
                                <h3
                                    style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}
                                    className="font-bold text-white text-lg mb-3"
                                >
                                    {step.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── For who ── */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="max-w-2xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-teal-600" />
                            <p className="text-teal-600 font-bold text-xs uppercase tracking-widest">¿Para quién?</p>
                        </div>
                        <h2
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.03em' }}
                            className="text-4xl font-black text-slate-900"
                        >
                            Pensado para todos
                            <br />
                            los actores de la campaña
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Buildings,
                                role: 'Candidatos y Partidos',
                                featured: true,
                                perks: [
                                    'Visión global de la captación',
                                    'Branding personalizado',
                                    'Reportes ejecutivos',
                                    'Multi-campaña en simultáneo',
                                ],
                            },
                            {
                                icon: Users,
                                role: 'Coordinadores',
                                featured: false,
                                perks: [
                                    'Seguimiento de operadores',
                                    'Metas y cuotas por equipo',
                                    'Mapas de cobertura seccional',
                                    'Exportación de datos',
                                ],
                            },
                            {
                                icon: MapPin,
                                role: 'Operadores de Campo',
                                featured: false,
                                perks: [
                                    'App móvil desde el navegador',
                                    'Búsqueda en padrón en tiempo real',
                                    'Registro en menos de 5 segundos',
                                    'Sin instalación requerida',
                                ],
                            },
                        ].map((card) => (
                            <div
                                key={card.role}
                                className={`p-7 rounded-xl border-2 transition-all ${
                                    card.featured
                                        ? 'bg-teal-600 border-teal-500'
                                        : 'bg-white border-slate-200 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-50'
                                }`}
                            >
                                <div
                                    className={`w-11 h-11 rounded-lg flex items-center justify-center mb-5 ${
                                        card.featured ? 'bg-white/15' : 'bg-slate-100'
                                    }`}
                                >
                                    <card.icon
                                        size={22}
                                        weight="bold"
                                        className={card.featured ? 'text-white' : 'text-slate-700'}
                                    />
                                </div>
                                <h3
                                    style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}
                                    className={`font-bold text-lg mb-5 ${card.featured ? 'text-white' : 'text-slate-900'}`}
                                >
                                    {card.role}
                                </h3>
                                <ul className="space-y-2.5">
                                    {card.perks.map((p) => (
                                        <li
                                            key={p}
                                            className={`flex items-start gap-2.5 text-sm font-medium ${
                                                card.featured ? 'text-teal-100' : 'text-slate-600'
                                            }`}
                                        >
                                            <CheckCircle
                                                size={15}
                                                weight="fill"
                                                className={`shrink-0 mt-0.5 ${card.featured ? 'text-teal-200' : 'text-teal-500'}`}
                                            />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pull quote ── */}
            <section className="py-20 px-6 bg-slate-900 border-y border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <div
                        style={{ fontFamily: 'Georgia, serif', lineHeight: 0.8 }}
                        className="text-8xl font-black text-teal-500/18 select-none mb-2"
                    >
                        "
                    </div>
                    <blockquote
                        style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.025em' }}
                        className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-7 max-w-3xl"
                    >
                        La diferencia entre ganar y perder una elección está en los datos y en la organización del
                        equipo.
                    </blockquote>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-teal-500" />
                        <p className="text-teal-400 font-bold text-xs uppercase tracking-widest">
                            SIGELE — Tecnología para campañas que ganan
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="py-24 px-6 bg-slate-950">
                <div className="max-w-4xl mx-auto">
                    <div
                        className="relative rounded-2xl p-12 text-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #115e59 0%, #0f766e 50%, #0d9488 100%)',
                        }}
                    >
                        {/* Inner grid */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                                backgroundSize: '32px 32px',
                            }}
                        />
                        <div className="relative">
                            <ShieldCheck size={44} weight="fill" className="text-teal-200 mx-auto mb-6" />
                            <h2
                                style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.035em' }}
                                className="text-4xl font-black text-white mb-4"
                            >
                                ¿Listo para digitalizar
                                <br />
                                tu campaña?
                            </h2>
                            <p className="text-teal-200 text-lg mb-10 font-medium max-w-xl mx-auto leading-relaxed">
                                Contáctanos hoy por WhatsApp. Te mostramos la plataforma en funcionamiento y diseñamos
                                juntos el plan para tu campaña.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href={WA_DEMO}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-white hover:bg-teal-50 text-teal-700 font-bold text-base px-8 py-3.5 rounded-xl transition-colors shadow-lg"
                                >
                                    <WhatsappLogo size={20} weight="fill" />
                                    Solicitar Demo
                                </a>
                                <a
                                    href={WA_INFO}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-colors"
                                >
                                    <WhatsappLogo size={20} weight="fill" />
                                    Más información
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-slate-950 border-t border-slate-800/80 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <ShieldCheck size={20} weight="fill" className="text-teal-400" />
                        <span
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}
                            className="font-black text-white"
                        >
                            SIGELE
                        </span>
                        <span className="text-slate-600 text-sm ml-1">Gestión Electoral Digital</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
                        <button onClick={() => navigate('/padron')} className="hover:text-white transition-colors">
                            Consultar Padrón
                        </button>
                        <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
                            Ingresar
                        </button>
                        <a
                            href={WA_INFO}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            Contacto
                        </a>
                    </div>
                    <p className="text-slate-700 text-xs">© {new Date().getFullYear()} SIGELE. Paraguay.</p>
                </div>
            </footer>
        </div>
    );
}
