import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { SimuladorIntro } from './SimuladorIntro';
import { SimuladorPaso1 } from './SimuladorPaso1';
import { SimuladorPaso2 } from './SimuladorPaso2';
import { SimuladorPaso3 } from './SimuladorPaso3';
import { SimuladorPaso4 } from './SimuladorPaso4';
import { SimuladorPaso5 } from './SimuladorPaso5';
import { getDatosSimulador } from './data';
import type { SeleccionIntendente } from './SimuladorPaso1';
import type { Lista } from './SimuladorPaso2';
import type { SeleccionJunta } from './SimuladorPaso3';

type Fase = 'intro' | 'paso1' | 'paso2' | 'paso3' | 'paso4' | 'paso5';

const datosSimulador = getDatosSimulador();

// Dimensiones de referencia del diseño desktop
const REF_W = 1024;
const REF_H = 768;

/* ── Wrapper que escala el simulador en móvil manteniendo proporciones exactas ── */
function ScaledSimulador({ children }: { children: React.ReactNode }) {
    const [scale, setScale] = useState(() => Math.min(window.innerWidth / REF_W, window.innerHeight / REF_H));
    const isMobile = window.innerWidth < REF_W;
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const update = () => {
            setScale(Math.min(window.innerWidth / REF_W, window.innerHeight / REF_H));
        };
        const handler = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(update);
        };
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('resize', handler);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Desktop: contenedor que provee las dimensiones de referencia sin escalar
    if (!isMobile) {
        return (
            <div style={{ width: '100%', height: '100dvh' }}>
                {children}
            </div>
        );
    }

    // Móvil: REF_W × REF_H escalado para caber en pantalla, centrado sobre fondo negro
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}>
            <div style={{
                width: REF_W,
                height: REF_H,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                flexShrink: 0,
                overflow: 'hidden',
            }}>
                {children}
            </div>
        </div>
    );
}

export function SimuladorPage() {
    const [fase, setFase] = useState<Fase>('intro');
    const [intendente, setIntendente] = useState<SeleccionIntendente | null>(null);
    const [listaJunta, setListaJunta] = useState<Lista | null>(null);
    const [junta, setJunta] = useState<SeleccionJunta | null>(null);

    if (!datosSimulador) return <Navigate to="/padron" replace />;

    const { municipio, config } = datosSimulador;

    // Intro y Paso5: responsive sin escalar
    if (fase === 'intro') return <SimuladorIntro onTerminar={() => setFase('paso1')} />;

    if (fase === 'paso5') return (
        <SimuladorPaso5 onTerminar={() => {
            setIntendente(null);
            setListaJunta(null);
            setJunta(null);
            setFase('intro');
        }} />
    );

    // Pasos 1–4: escalados en móvil
    return (
        <ScaledSimulador>
            {fase === 'paso1' && (
                <SimuladorPaso1
                    candidatos={municipio.candidatosIntendente}
                    intendenteIdActivo={config.intendenteId}
                    onAceptar={(sel) => { setIntendente(sel); setFase('paso2'); }}
                />
            )}
            {fase === 'paso2' && (
                <SimuladorPaso2
                    listas={municipio.listasJunta}
                    listaIdActiva={config.listaJuntaId}
                    onAceptar={(lista) => {
                        if (lista === 'blanco') {
                            setListaJunta(null);
                            setJunta({ partido: 'VOTO EN BLANCO', lista: '', nombre: '', opcion: 0 });
                            setFase('paso4');
                        } else {
                            setListaJunta(lista);
                            setFase('paso3');
                        }
                    }}
                    onVolver={() => setFase('paso1')}
                />
            )}
            {fase === 'paso3' && listaJunta && (
                <SimuladorPaso3
                    lista={listaJunta}
                    candidatos={municipio.candidatosPorLista[listaJunta.id] ?? []}
                    opcionActiva={config.candidatoJuntaOpcion}
                    onAceptar={(sel) => { setJunta(sel); setFase('paso4'); }}
                    onVolver={() => setFase('paso2')}
                />
            )}
            {fase === 'paso4' && intendente && junta && (
                <SimuladorPaso4
                    intendente={intendente}
                    junta={junta}
                    onModificarIntendente={() => setFase('paso1')}
                    onModificarJunta={() => setFase('paso2')}
                    onImprimir={() => setFase('paso5')}
                />
            )}
        </ScaledSimulador>
    );
}
