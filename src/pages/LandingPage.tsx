import { useEffect, useRef } from 'react';
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
    NavigationArrow,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WA_NUMBER = '595985851696';
const WA_INFO = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me interesa obtener más información sobre SIGELE.')}`;
const WA_DEMO = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, quisiera solicitar una demo de SIGELE para mi campaña.')}`;

// Mock pin coordinates around San Lorenzo, Paraguay
const MOCK_MAP_PINS = [
    { lat: -25.3427, lng: -57.5142, nombre: 'Carlos M.',  op: 'J. Martínez' },
    { lat: -25.3489, lng: -57.5218, nombre: 'Ana G.',     op: 'A. Gómez'    },
    { lat: -25.3551, lng: -57.5097, nombre: 'Pedro R.',   op: 'J. Martínez' },
    { lat: -25.3381, lng: -57.5303, nombre: 'María L.',   op: 'C. López'    },
    { lat: -25.3624, lng: -57.5251, nombre: 'Jorge B.',   op: 'A. Gómez'    },
    { lat: -25.3442, lng: -57.5078, nombre: 'Laura F.',   op: 'J. Martínez' },
    { lat: -25.3583, lng: -57.5182, nombre: 'Diego V.',   op: 'R. Benítez'  },
    { lat: -25.3401, lng: -57.5347, nombre: 'Sandra P.',  op: 'C. López'    },
    { lat: -25.3512, lng: -57.5159, nombre: 'Roberto C.', op: 'A. Gómez'    },
    { lat: -25.3468, lng: -57.5279, nombre: 'Elena V.',   op: 'J. Martínez' },
    { lat: -25.3455, lng: -57.5195, nombre: 'Luis R.',    op: 'R. Benítez'  },
    { lat: -25.3538, lng: -57.5231, nombre: 'Patricia O.', op: 'C. López'   },
];

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
    {
        icon: NavigationArrow,
        title: 'Mapa Georreferenciado ✦ Nuevo',
        description:
            'El operador marca la ubicación exacta del elector en el mapa al momento de la captación. El coordinador visualiza todos los pines en tiempo real desde su panel.',
        highlight: true,
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


const SL_D = (op = 0.5) => ({ fontSize: '9px', color: `rgba(90,60,30,${op})`, textTransform: 'uppercase' as const, letterSpacing: '0.1em' });

function DashboardPreview() {
    return (
        <div className="relative dashboard-animate" style={{ fontFamily: FONT_BODY }}>
            <div
                style={{
                    background: '#fefaf4',
                    border: '1px solid rgba(180,130,70,0.22)',
                    borderRadius: '18px',
                    padding: '16px',
                    position: 'relative',
                    boxShadow: '0 1px 0 rgba(180,130,70,0.1), 0 24px 56px rgba(100,60,20,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                {/* Window chrome — macOS style dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {[{ bg: '#ff5f57', b: '#e0443e' }, { bg: '#febc2e', b: '#d4a017' }, { bg: '#28c840', b: '#1aaa2e' }].map((d) => (
                        <div key={d.bg} style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.bg, border: `0.5px solid ${d.b}` }} />
                    ))}
                    <div style={{ flex: 1, height: '1px', background: 'rgba(180,130,70,0.18)', marginLeft: '6px' }} />
                    <span style={SL_D(0.45)}>Centro de Control</span>
                </div>

                {/* 4 KPI cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
                    {MOCK_KPIS.map((k) => (
                        <div key={k.label} style={{
                            background: k.accent ? 'rgba(0,56,168,0.05)' : '#ffffff',
                            border: `1px solid ${k.accent ? 'rgba(0,56,168,0.2)' : 'rgba(180,130,70,0.15)'}`,
                            borderRadius: '8px', padding: '7px 9px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{ ...SL_D(), marginBottom: '3px' }}>{k.label}</div>
                            <div style={{
                                fontSize: '17px', fontWeight: '900', lineHeight: 1,
                                letterSpacing: '-0.03em', fontFamily: FONT_DISPLAY,
                                color: k.accent ? '#0038A8' : '#1c1208',
                                fontVariantNumeric: 'tabular-nums',
                            }}>{k.value}</div>
                        </div>
                    ))}
                </div>

                {/* Buscador de Electores */}
                <div style={{ background: '#ffffff', border: '1px solid rgba(180,130,70,0.15)', borderRadius: '10px', padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ ...SL_D(0.45), marginBottom: '8px' }}>Buscar Elector en Listas</div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            background: '#fafaf8', border: '1px solid rgba(180,130,70,0.2)',
                            borderRadius: '7px', padding: '5px 9px', gap: '6px',
                        }}>
                            <span style={{ fontSize: '10px', color: 'rgba(90,60,30,0.35)' }}>🔍</span>
                            <span style={{ fontSize: '11px', color: '#3a2818', fontWeight: '600' }}>3.421.876</span>
                        </div>
                        <div style={{
                            padding: '5px 10px', borderRadius: '7px', fontSize: '10px', fontWeight: '700',
                            color: 'white', background: '#D52B1E',
                            display: 'flex', alignItems: 'center',
                            boxShadow: '0 2px 6px rgba(213,43,30,0.3)',
                        }}>Verificar</div>
                    </div>
                    <div style={{
                        padding: '7px 10px', background: 'rgba(0,56,168,0.05)', border: '1px solid rgba(0,56,168,0.18)',
                        borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const,
                    }}>
                        <span style={{ fontSize: '10px', color: '#0038A8' }}>✓</span>
                        <span style={{ fontSize: '11px', color: '#1c1208', fontWeight: '700' }}>Pedro García R.</span>
                        <span style={{ fontSize: '9px', color: 'rgba(90,60,30,0.5)' }}>CI: 3.421.876</span>
                        <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', background: 'rgba(213,43,30,0.08)', color: '#D52B1E', border: '1px solid rgba(213,43,30,0.2)' }}>Mesa</span>
                        <span style={{ fontSize: '9px', color: 'rgba(90,60,30,0.5)' }}>Lista de: <span style={{ color: '#0038A8', fontWeight: '600' }}>J. Martínez</span></span>
                    </div>
                </div>

                {/* Ranking + Consultas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
                    <div style={{ background: '#ffffff', border: '1px solid rgba(180,130,70,0.15)', borderRadius: '10px', padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ ...SL_D(0.45), marginBottom: '8px' }}>Ranking Cargas</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                            {MOCK_RANKING.map((op, i) => (
                                <div key={op.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ fontSize: '10px', color: '#3a2818', fontWeight: '600', display: 'flex', gap: '4px' }}>
                                            <span style={{ color: 'rgba(90,60,30,0.35)', fontWeight: '700' }}>{i + 1}.</span>
                                            {op.name}
                                        </span>
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#D52B1E', fontVariantNumeric: 'tabular-nums' }}>{op.total}</span>
                                    </div>
                                    <div style={{ height: '3px', background: 'rgba(180,130,70,0.15)', borderRadius: '2px' }}>
                                        <div style={{ height: '100%', width: `${op.pct}%`, background: 'linear-gradient(90deg, #D52B1E, #ff7b72)', borderRadius: '2px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid rgba(180,130,70,0.15)', borderRadius: '10px', padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ ...SL_D(0.45), marginBottom: '8px' }}>Consultas al Padrón</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                            {MOCK_CONSULTAS.map((c) => (
                                <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '10px', color: 'rgba(90,60,30,0.55)', fontWeight: '500' }}>{c.label}</span>
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#1c1208', fontVariantNumeric: 'tabular-nums', fontFamily: FONT_DISPLAY }}>{c.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desempeño por Coordinador */}
                <div style={{ background: '#ffffff', border: '1px solid rgba(180,130,70,0.15)', borderRadius: '10px', padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ ...SL_D(0.45), marginBottom: '8px' }}>Desempeño por Coordinador</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {MOCK_COORDS.map((c) => (
                            <div key={c.name} style={{
                                background: c.leader ? 'rgba(213,43,30,0.04)' : '#fafaf8',
                                border: `1px solid ${c.leader ? 'rgba(213,43,30,0.18)' : 'rgba(180,130,70,0.15)'}`,
                                borderRadius: '8px', padding: '9px 10px',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '3px', height: '100%',
                                    background: c.leader ? '#D52B1E' : 'rgba(180,130,70,0.3)',
                                    borderRadius: '8px 0 0 8px',
                                }} />
                                <div style={{ paddingLeft: '6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#1c1208', fontFamily: FONT_DISPLAY }}>{c.name}</div>
                                            <div style={{ fontSize: '9px', color: 'rgba(90,60,30,0.45)', marginTop: '1px' }}>{c.operadores} operadores</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '16px', fontWeight: '900', color: c.leader ? '#0038A8' : '#1c1208', fontFamily: FONT_DISPLAY, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{c.electores}</div>
                                            <div style={{ fontSize: '8px', color: 'rgba(90,60,30,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>electores</div>
                                        </div>
                                    </div>
                                    <div style={{ height: '3px', background: 'rgba(180,130,70,0.15)', borderRadius: '2px', marginBottom: '5px' }}>
                                        <div style={{ height: '100%', width: `${c.pct}%`, background: c.leader ? 'linear-gradient(90deg,#D52B1E,#ff7b72)' : 'rgba(180,130,70,0.3)', borderRadius: '2px' }} />
                                    </div>
                                    <div style={{ fontSize: '9px', color: 'rgba(90,60,30,0.45)' }}>
                                        {c.mesa} <span style={{ opacity: 0.7 }}>miembros mesa</span>
                                        {c.leader && <span style={{ marginLeft: '6px', color: '#D52B1E' }}>🏆</span>}
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
        <div style={{ fontFamily: FONT_BODY, width: '220px', margin: '0 auto', position: 'relative' }}>

            {/* ── Botones laterales izquierdos ── */}
            {/* Silencio */}
            <div style={{ position: 'absolute', left: '-4px', top: '72px', width: '4px', height: '22px', background: 'linear-gradient(180deg,#48484a,#3a3a3c)', borderRadius: '3px 0 0 3px', boxShadow: '-1px 1px 2px rgba(0,0,0,0.4)' }} />
            {/* Volumen + */}
            <div style={{ position: 'absolute', left: '-4px', top: '104px', width: '4px', height: '30px', background: 'linear-gradient(180deg,#48484a,#3a3a3c)', borderRadius: '3px 0 0 3px', boxShadow: '-1px 1px 2px rgba(0,0,0,0.4)' }} />
            {/* Volumen − */}
            <div style={{ position: 'absolute', left: '-4px', top: '144px', width: '4px', height: '30px', background: 'linear-gradient(180deg,#48484a,#3a3a3c)', borderRadius: '3px 0 0 3px', boxShadow: '-1px 1px 2px rgba(0,0,0,0.4)' }} />
            {/* ── Botón de encendido derecho ── */}
            <div style={{ position: 'absolute', right: '-4px', top: '110px', width: '4px', height: '52px', background: 'linear-gradient(180deg,#48484a,#3a3a3c)', borderRadius: '0 3px 3px 0', boxShadow: '1px 1px 2px rgba(0,0,0,0.4)' }} />

            {/* ── Cuerpo del teléfono ── */}
            <div style={{
                background: 'linear-gradient(160deg, #3d3d3f 0%, #1c1c1e 100%)',
                borderRadius: '42px',
                padding: '10px',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.12), 0 32px 64px rgba(0,0,0,0.45)',
            }}>
                {/* ── Pantalla ── */}
                <div style={{ background: '#f9f5ef', borderRadius: '33px', overflow: 'hidden', position: 'relative' }}>

                    {/* Barra de estado */}
                    <div style={{ padding: '10px 18px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                        {/* Dynamic Island */}
                        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '24px', background: '#1c1c1e', borderRadius: '12px' }} />
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#1c1208', fontFamily: FONT_BODY }}>9:41</span>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                            {/* Señal */}
                            <svg width="13" height="9" viewBox="0 0 13 9"><rect x="0" y="5" width="2" height="4" rx="0.5" fill="#1c1208" opacity="0.8"/><rect x="3.5" y="3" width="2" height="6" rx="0.5" fill="#1c1208" opacity="0.8"/><rect x="7" y="1.5" width="2" height="7.5" rx="0.5" fill="#1c1208" opacity="0.8"/><rect x="10.5" y="0" width="2" height="9" rx="0.5" fill="#1c1208" opacity="0.3"/></svg>
                            {/* Batería */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                                <div style={{ width: '17px', height: '8px', border: '1px solid rgba(28,18,8,0.45)', borderRadius: '2px', padding: '1px' }}>
                                    <div style={{ width: '65%', height: '100%', background: '#1c1208', borderRadius: '1px', opacity: 0.75 }} />
                                </div>
                                <div style={{ width: '2px', height: '4px', background: 'rgba(28,18,8,0.35)', borderRadius: '0 1px 1px 0' }} />
                            </div>
                        </div>
                    </div>

                    {/* Contenido de la app */}
                    <div style={{ padding: '2px 14px 0' }}>

                        {/* Header app */}
                        <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#1c1208', fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}>Panel Operativo</div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                <div style={{ background: '#fff', border: '1px solid rgba(180,130,70,0.2)', borderRadius: '8px', padding: '5px 8px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <div style={{ fontSize: '8px', color: 'rgba(90,60,30,0.5)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: '2px' }}>Activos</div>
                                    <div style={{ fontSize: '16px', fontWeight: '900', color: '#1c1208', fontFamily: FONT_DISPLAY }}>47</div>
                                </div>
                                <div style={{ background: '#fff', border: '1px solid rgba(0,56,168,0.2)', borderRadius: '8px', padding: '5px 8px', flex: 1, boxShadow: '0 1px 3px rgba(0,56,168,0.07)' }}>
                                    <div style={{ fontSize: '8px', color: 'rgba(90,60,30,0.5)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: '2px' }}>Mesa</div>
                                    <div style={{ fontSize: '16px', fontWeight: '900', color: '#0038A8', fontFamily: FONT_DISPLAY }}>12</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'rgba(180,130,70,0.18)', marginBottom: '10px' }} />

                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#3a2818', marginBottom: '8px' }}>Cargar Elector</div>

                        {/* Cédula */}
                        <div style={{ marginBottom: '6px' }}>
                            <div style={{ fontSize: '8px', color: 'rgba(90,60,30,0.5)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '3px' }}>Cédula</div>
                            <div style={{ display: 'flex', background: '#fff', border: '1px solid rgba(180,130,70,0.25)', borderRadius: '7px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                                <span style={{ flex: 1, padding: '5px 8px', fontSize: '11px', color: '#1c1208', fontWeight: '700' }}>1.234.567</span>
                                <span style={{ padding: '5px 7px', fontSize: '10px', color: '#D52B1E' }}>🔍</span>
                            </div>
                        </div>

                        {/* Encontrado */}
                        <div style={{ marginBottom: '6px', padding: '5px 8px', background: 'rgba(0,56,168,0.06)', border: '1px solid rgba(0,56,168,0.18)', borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ color: '#0038A8', fontSize: '10px', fontWeight: '700' }}>✓</span>
                            <span style={{ fontSize: '10px', color: '#1c1208', fontWeight: '600' }}>Carlos Martínez R.</span>
                        </div>

                        {/* Teléfono */}
                        <div style={{ marginBottom: '6px' }}>
                            <div style={{ fontSize: '8px', color: 'rgba(90,60,30,0.5)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '3px' }}>Teléfono *</div>
                            <div style={{ padding: '5px 8px', fontSize: '11px', color: 'rgba(60,40,20,0.4)', background: '#fff', border: '1px solid rgba(180,130,70,0.2)', borderRadius: '7px' }}>0981 123 456</div>
                        </div>

                        {/* Checkboxes */}
                        <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {[
                                { label: 'Miembro de Mesa', checked: true },
                                { label: 'Requiere Transporte', checked: false },
                            ].map((cb) => (
                                <div key={cb.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{
                                        width: '12px', height: '12px', borderRadius: '3px', flexShrink: 0,
                                        border: cb.checked ? '1.5px solid #D52B1E' : '1.5px solid rgba(180,130,70,0.4)',
                                        background: cb.checked ? 'rgba(213,43,30,0.1)' : '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {cb.checked && <span style={{ fontSize: '8px', color: '#D52B1E', lineHeight: 1, fontWeight: '800' }}>✓</span>}
                                    </div>
                                    <span style={{ fontSize: '9px', color: '#3a2818', fontWeight: '500' }}>{cb.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Botón */}
                        <div style={{ padding: '8px', textAlign: 'center', background: 'linear-gradient(135deg, #D52B1E, #b02318)', borderRadius: '9px', fontSize: '10px', fontWeight: '700', color: 'white', boxShadow: '0 3px 10px rgba(213,43,30,0.35)', marginBottom: '4px' }}>
                            Registrar Captación
                        </div>
                    </div>

                    {/* Home indicator */}
                    <div style={{ padding: '8px 0 7px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '90px', height: '4px', background: '#1c1208', borderRadius: '2px', opacity: 0.15 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MapaElectoresPreview() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false,
            dragging: false,
            doubleClickZoom: false,
            keyboard: false,
            touchZoom: false,
        }).setView([-25.3490, -25.3490], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        MOCK_MAP_PINS.forEach((pin) => {
            L.circleMarker([pin.lat, pin.lng], {
                radius: 7,
                fillColor: '#D52B1E',
                color: '#b02318',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.88,
            }).addTo(map).bindPopup(
                `<div style="font-family:sans-serif;font-size:12px;font-weight:700">${pin.nombre}</div>` +
                `<div style="font-size:11px;color:#555;margin-top:2px">Op: ${pin.op}</div>`
            );
        });

        mapRef.current = map;

        setTimeout(() => {
            map.invalidateSize();
            const bounds = L.latLngBounds(MOCK_MAP_PINS.map((p) => [p.lat, p.lng]));
            const zoom = map.getBoundsZoom(bounds, false, L.point(24, 24));
            map.setView(bounds.getCenter(), zoom);
        }, 120);

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen antialiased sigele-public">

            {/* ── Navbar ── */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#f3e8d2]/95 backdrop-blur-md border-b border-[#c4a882]/40">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <img src="/logo_letras.png" alt="SIGELE" className="h-9 w-auto" />
                    </div>
                    <nav className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/padron')}
                            className="hidden sm:block text-sm font-medium text-[#6b5035] hover:text-[#1c1208] transition-colors px-3 py-2"
                        >
                            Consultar Padrón
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden sm:block text-sm font-semibold text-[#3a2818] hover:text-[#1c1208] border border-[#c4a882] hover:border-[#8a6040] transition-all px-4 py-2 rounded-lg"
                        >
                            Ingresar
                        </button>
                        <a
                            href={WA_DEMO}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-[#D52B1E] hover:bg-[#b02318] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-[#D52B1E]/30"
                        >
                            <WhatsappLogo size={15} weight="fill" />
                            Solicitar Demo
                        </a>
                    </nav>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="relative bg-[#f3e8d2] min-h-screen flex items-center pt-16 overflow-hidden">
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(120,80,40,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,80,40,0.06) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }}
                />
                {/* Top radial glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(213,43,30,0.08) 0%, transparent 70%)',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center w-full">
                    {/* Left: Copy */}
                    <div className="hero-animate">
                        <div className="inline-flex items-center gap-2 bg-[#D52B1E]/[0.08] border border-[#D52B1E]/30 text-[#D52B1E] text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D52B1E] live-blip" />
                            Sistema de Gestión Electoral — Paraguay
                        </div>

                        <h1
                            style={{ fontFamily: FONT_DISPLAY, lineHeight: 1.02, letterSpacing: '-0.035em' }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1c1208] mb-6"
                        >
                            Tecnología que
                            <br />
                            organiza campañas.
                            <br />
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #ff6b5b 0%, #D52B1E 45%, #0038A8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Datos que ganan.
                            </span>
                        </h1>

                        <p className="text-[#5a3e28] text-lg max-w-lg mb-10 leading-relaxed font-medium">
                            SIGELE conecta a tu equipo de campo con los datos electorales en tiempo real. Captación
                            masiva, padrón público y reportes — todo en una plataforma.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <a
                                href={WA_DEMO}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-[#D52B1E] hover:bg-[#b02318] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-[#D52B1E]/25 transition-all hover:scale-[1.02] hover:shadow-[#D52B1E]/35"
                            >
                                <WhatsappLogo size={20} weight="fill" />
                                Solicitar Demo Gratis
                            </a>
                            <a
                                href={WA_INFO}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 border border-[#c4a882] hover:border-[#8a6040] text-[#3a2818] hover:text-[#1c1208] font-semibold text-base px-7 py-3.5 rounded-xl transition-all"
                            >
                                Más información
                                <ArrowRight size={16} weight="bold" />
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            {['Sin contratos largos', 'Implementación rápida', 'Soporte incluido'].map((t) => (
                                <span key={t} className="flex items-center gap-1.5 text-[#8a6840] text-sm font-medium">
                                    <CheckCircle size={14} weight="fill" className="text-[#D52B1E]/70" />
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right: Dashboard preview — dark panel floating on paper */}
                    <div className="hidden lg:block">
                        <DashboardPreview />
                    </div>
                </div>
            </section>

            {/* ── Stats strip ── */}
            <section className="bg-[#ede0c8] border-y border-[#c4a882]/40 py-10 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p
                                style={{
                                    fontFamily: FONT_DISPLAY,
                                    fontVariantNumeric: 'tabular-nums',
                                    letterSpacing: '-0.03em',
                                }}
                                className="text-3xl font-black text-[#D52B1E]"
                            >
                                {s.value}
                            </p>
                            <div className="w-6 h-px bg-[#D52B1E]/35 mx-auto my-2" />
                            <p className="text-[#6b5035] text-sm font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-2xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-[#D52B1E]" />
                            <p className="text-[#D52B1E] font-bold text-xs uppercase tracking-widest">Funcionalidades</p>
                        </div>
                        <h2
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.03em' }}
                            className="text-4xl font-black text-[#1c1208] mb-4"
                        >
                            Todo lo que necesita
                            <br />
                            tu campaña
                        </h2>
                        <p className="text-[#6b5035] text-lg leading-relaxed">
                            Una plataforma completa, pensada para la realidad del trabajo político en Paraguay.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className={`group p-6 border rounded-xl transition-all duration-200 ${'highlight' in f && f.highlight
                                    ? 'sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#D52B1E] to-[#b02318] border-[#D52B1E] hover:from-[#b02318] hover:to-[#8B0000] flex flex-col sm:flex-row sm:items-center gap-5'
                                    : 'bg-[#faf5eb] hover:bg-white border-[#c4a882]/40 hover:border-[#D52B1E]/30 hover:shadow-xl hover:shadow-red-50'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${'highlight' in f && f.highlight
                                    ? 'bg-white/15'
                                    : 'bg-[#f5e8d5] group-hover:bg-[#D52B1E] mb-5'
                                }`}>
                                    <f.icon
                                        size={20}
                                        weight="bold"
                                        className={`${'highlight' in f && f.highlight ? 'text-white' : 'text-[#D52B1E] group-hover:text-white'} transition-colors duration-200`}
                                    />
                                </div>
                                <div>
                                    <h3
                                        style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}
                                        className={`font-bold mb-2 text-base ${'highlight' in f && f.highlight ? 'text-white' : 'text-[#1c1208]'}`}
                                    >
                                        {f.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${'highlight' in f && f.highlight ? 'text-red-100' : 'text-[#6b5035]'}`}>{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Operator in the field ── */}
            <section className="py-24 px-6 bg-[#f3e8d2]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Phone mockup — dark panel on paper */}
                    <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                        <OperatorPhoneMockup />
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-[#D52B1E]" />
                            <p className="text-[#D52B1E] font-bold text-xs uppercase tracking-widest">Panel Operativo</p>
                        </div>
                        <h2
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.03em' }}
                            className="text-4xl font-black text-[#1c1208] mb-5"
                        >
                            El campo, en tiempo real
                        </h2>
                        <p className="text-[#5a3e28] text-lg leading-relaxed mb-8 font-medium">
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
                                <li key={item} className="flex items-start gap-3 text-[#3a2818] text-sm font-medium">
                                    <CheckCircle size={16} weight="fill" className="text-[#D52B1E] shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── Mapa Georreferenciado Spotlight ── */}
            <section className="py-24 px-6 bg-[#ede0c8] border-y border-[#c4a882]/40">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div>
                        <div className="inline-flex items-center gap-2 bg-[#D52B1E]/10 border border-[#D52B1E]/25 text-[#D52B1E] text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D52B1E] live-blip" />
                            Nuevo
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-[#D52B1E]" />
                            <p className="text-[#D52B1E] font-bold text-xs uppercase tracking-widest">Geolocalización</p>
                        </div>
                        <h2
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.03em' }}
                            className="text-4xl font-black text-[#1c1208] mb-5"
                        >
                            Cada elector,
                            <br />
                            en el mapa.
                        </h2>
                        <p className="text-[#5a3e28] text-lg leading-relaxed mb-8 font-medium">
                            El operador marca la ubicación exacta del elector directamente desde su celular al
                            momento de la captación. El coordinador ve todos los pines georreferenciados en tiempo
                            real desde su panel.
                        </p>
                        <ul className="space-y-3">
                            {[
                                'El operador selecciona el punto en el mapa con un toque',
                                'Agrega una referencia libre: portón verde, esquina, etc.',
                                'El panel muestra todos los pines con nombre y operador',
                                'Zoom y centrado automático sobre el área de captación',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[#3a2818] text-sm font-medium">
                                    <CheckCircle size={16} weight="fill" className="text-[#D52B1E] shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Map card — clean, no device frame */}
                    <div>
                        <div
                            style={{
                                border: '1px solid rgba(180,130,70,0.28)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 24px rgba(100,60,20,0.1)',
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                background: '#fefaf4',
                                borderBottom: '1px solid rgba(180,130,70,0.2)',
                                padding: '10px 14px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#3a2818', fontFamily: FONT_DISPLAY, letterSpacing: '-0.01em' }}>
                                    Mapa de Electores
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div className="live-blip" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#D52B1E' }} />
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#D52B1E', fontFamily: FONT_DISPLAY }}>
                                        {MOCK_MAP_PINS.length} ubicaciones activas
                                    </span>
                                </div>
                            </div>

                            {/* Mapa */}
                            <div style={{ height: '340px', position: 'relative' }}>
                                <MapaElectoresPreview />
                            </div>
                        </div>

                        <p className="text-[#9a7a55] text-xs font-medium text-center mt-4">
                            Vista del panel de coordinadores — datos de demostración
                        </p>
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="py-24 px-6 bg-[#f3e8d2]">
                <div className="max-w-5xl mx-auto">
                    <div className="max-w-2xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-[#0038A8]" />
                            <p className="text-[#0038A8] font-bold text-xs uppercase tracking-widest">¿Cómo funciona?</p>
                        </div>
                        <h2
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.03em' }}
                            className="text-4xl font-black text-[#1c1208]"
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
                                    <div className="hidden md:block absolute top-7 left-[calc(50%+36px)] w-[calc(100%-72px)] border-t border-dashed border-[#c4a882]/50" />
                                )}
                                <div
                                    style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.04em' }}
                                    className="text-7xl font-black text-[#0038A8]/25 leading-none mb-5 select-none"
                                >
                                    {step.number}
                                </div>
                                <h3
                                    style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}
                                    className="font-bold text-[#1c1208] text-lg mb-3"
                                >
                                    {step.title}
                                </h3>
                                <p className="text-[#6b5035] text-sm leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── For who ── */}
            <section className="py-24 px-6 bg-[#faf5eb]">
                <div className="max-w-5xl mx-auto">
                    <div className="max-w-2xl mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-px bg-[#D52B1E]" />
                            <p className="text-[#D52B1E] font-bold text-xs uppercase tracking-widest">¿Para quién?</p>
                        </div>
                        <h2
                            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.03em' }}
                            className="text-4xl font-black text-[#1c1208]"
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
                                        ? 'bg-[#D52B1E] border-[#b02318]'
                                        : 'bg-white border-[#c4a882]/40 hover:border-[#D52B1E]/30 hover:shadow-lg hover:shadow-red-50'
                                }`}
                            >
                                <div
                                    className={`w-11 h-11 rounded-lg flex items-center justify-center mb-5 ${
                                        card.featured ? 'bg-white/15' : 'bg-[#ede0c8]'
                                    }`}
                                >
                                    <card.icon
                                        size={22}
                                        weight="bold"
                                        className={card.featured ? 'text-white' : 'text-[#3a2818]'}
                                    />
                                </div>
                                <h3
                                    style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em' }}
                                    className={`font-bold text-lg mb-5 ${card.featured ? 'text-white' : 'text-[#1c1208]'}`}
                                >
                                    {card.role}
                                </h3>
                                <ul className="space-y-2.5">
                                    {card.perks.map((p) => (
                                        <li
                                            key={p}
                                            className={`flex items-start gap-2.5 text-sm font-medium ${
                                                card.featured ? 'text-red-100' : 'text-[#5a3e28]'
                                            }`}
                                        >
                                            <CheckCircle
                                                size={15}
                                                weight="fill"
                                                className={`shrink-0 mt-0.5 ${card.featured ? 'text-red-200' : 'text-[#D52B1E]'}`}
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

            {/* ── Pull quote — warm dark ink ── */}
            <section className="py-20 px-6 bg-[#1c1208] border-y border-[#3d2a18]">
                <div className="max-w-4xl mx-auto">
                    <div
                        style={{ fontFamily: 'Georgia, serif', lineHeight: 0.8 }}
                        className="text-8xl font-black text-[#0038A8]/20 select-none mb-2"
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
                        <div className="w-8 h-px bg-[#0038A8]" />
                        <p className="text-[#6699ff] font-bold text-xs uppercase tracking-widest">
                            SIGELE — Tecnología para campañas que ganan
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="py-24 px-6 bg-[#f3e8d2]">
                <div className="max-w-4xl mx-auto">
                    <div
                        className="relative rounded-2xl p-12 text-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #8B0000 0%, #D52B1E 40%, #0038A8 80%, #001f6e 100%)',
                        }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                                backgroundSize: '32px 32px',
                            }}
                        />
                        <div className="relative">
                            <ShieldCheck size={44} weight="fill" className="text-white/80 mx-auto mb-6" />
                            <h2
                                style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.035em' }}
                                className="text-4xl font-black text-white mb-4"
                            >
                                ¿Listo para digitalizar
                                <br />
                                tu campaña?
                            </h2>
                            <p className="text-white/75 text-lg mb-10 font-medium max-w-xl mx-auto leading-relaxed">
                                Contáctanos hoy por WhatsApp. Te mostramos la plataforma en funcionamiento y diseñamos
                                juntos el plan para tu campaña.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href={WA_DEMO}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-[#D52B1E] font-bold text-base px-8 py-3.5 rounded-xl transition-colors shadow-lg"
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

            {/* ── Footer — warm dark ink ── */}
            <footer className="bg-[#1c1208] border-t border-[#3d2a18]/80 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center">
                        <img src="/logo_letras.png" alt="SIGELE" className="h-7 w-auto" />
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-[#9a7a55]">
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
                    <p className="text-[#4a3020] text-xs">© {new Date().getFullYear()} SIGELE. Paraguay.</p>
                </div>
            </footer>
        </div>
    );
}
