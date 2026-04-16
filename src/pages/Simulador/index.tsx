import { useState } from 'react';
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

export function SimuladorPage() {
    const [fase, setFase] = useState<Fase>('intro');
    const [intendente, setIntendente] = useState<SeleccionIntendente | null>(null);
    const [listaJunta, setListaJunta] = useState<Lista | null>(null);
    const [junta, setJunta] = useState<SeleccionJunta | null>(null);

    if (!datosSimulador) return <Navigate to="/padron" replace />;

    const { municipio, config } = datosSimulador;

    if (fase === 'intro') return <SimuladorIntro onTerminar={() => setFase('paso1')} />;

    if (fase === 'paso1') return (
        <SimuladorPaso1
            candidatos={municipio.candidatosIntendente}
            intendenteIdActivo={config.intendenteId}
            onAceptar={(sel) => {
                setIntendente(sel);
                setFase('paso2');
            }}
        />
    );

    if (fase === 'paso2') return (
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
    );

    if (fase === 'paso3' && listaJunta) return (
        <SimuladorPaso3
            lista={listaJunta}
            candidatos={municipio.candidatosPorLista[listaJunta.id] ?? []}
            opcionActiva={config.candidatoJuntaOpcion}
            onAceptar={(sel) => {
                setJunta(sel);
                setFase('paso4');
            }}
            onVolver={() => setFase('paso2')}
        />
    );

    if (fase === 'paso4' && intendente && junta) return (
        <SimuladorPaso4
            intendente={intendente}
            junta={junta}
            onModificarIntendente={() => setFase('paso1')}
            onModificarJunta={() => setFase('paso2')}
            onImprimir={() => setFase('paso5')}
        />
    );

    if (fase === 'paso5') return (
        <SimuladorPaso5 onTerminar={() => {
            setIntendente(null);
            setListaJunta(null);
            setJunta(null);
            setFase('intro');
        }} />
    );

    return null;
}
