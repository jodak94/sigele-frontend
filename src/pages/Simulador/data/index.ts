import { getTenant } from '../../../utils/tenant';
import type { DatosTenant, CandidatoIntendente, ListaJunta, CandidatoJunta } from './tipos';

// ── Configuración por tenant ──────────────────────────────────────────────────
// Cuando se migre a API, reemplazar TENANTS por un fetch a /api/simulador/:tenant

const TENANTS: Record<string, DatosTenant> = {

    'naomyferrer': {
        municipio: 'San Lorenzo',
        intendente: {
            id: 'sli1',
            lista: '2A',
            partido: 'HONOR COLORADO A',
            siglas: 'MHC',
            colores: ['#CC0E22'],
            nombre: 'Felipito Salomón',
            foto: 'https://assets.sigele.com.py/simulador/san-lorenzo/i1.webp',
        },
        posicionIntendente: 1,
        totalIntendentes: 2,
        listaJunta: {
            id: 'sl-junta-1',
            numero: '2A',
            partido: 'Honor Colorado A',
            siglas: 'MHC',
            color: '#CC0E22',
        },
        candidatoJunta: { opcion: 10, nombre: 'Naomy Ferrer', foto: 'https://assets.sigele.com.py/simulador/san-lorenzo/jm10.webp' },
        totalCandidatosJunta: 12,
        posicionListaJunta: 1,
        totalListasJunta: 5,
    },

    'joelgomez': {
        municipio: 'Limpio',
        intendente: {
            id: 'lm1',
            lista: '2A',
            partido: 'HONOR COLORADO A',
            siglas: 'MHC',
            colores: ['#CC0E22'],
            nombre: 'Manuel Aguilar',
            foto: 'https://assets.sigele.com.py/simulador/limpio/i1.webp',
        },
        posicionIntendente: 1,
        totalIntendentes: 4,
        listaJunta: {
            id: 'lm-junta-1',
            numero: '2A',
            partido: 'HONOR COLORADO A',
            siglas: 'MHC',
            color: '#CC0E22',
        },
        candidatoJunta: { opcion: 10, nombre: 'Abog. Joel Gomez Mendieta', foto: 'https://assets.sigele.com.py/simulador/limpio/jm10.webp' },
        totalCandidatosJunta: 12,
        posicionListaJunta: 1,
        totalListasJunta: 4,
    },

    'richipavon': {
        municipio: 'Lima',
        intendente: {
            id: 'im3',
            lista: '8',
            partido: 'ROHAYHU LIMA',
            siglas: 'MRL',
            colores: ['#CC0E22'],
            nombre: 'Ing. Julio Franco',
            foto: 'https://assets.sigele.com.py/simulador/lima/i3.webp',
        },
        posicionIntendente: 3,
        totalIntendentes: 3,
        listaJunta: {
            id: 'lm-junta-4',
            numero: '8',
            partido: 'ROHAYHU LIMA',
            siglas: 'MHC',
            color: '#CC0E22',
        },
        candidatoJunta: { opcion: 1, nombre: 'Richi Pavon', foto: 'https://assets.sigele.com.py/simulador/lima/jm28.webp' },
        totalCandidatosJunta: 9,
        posicionListaJunta: 4,
        totalListasJunta: 4,
    },

    'mariajosecardenas': {
        municipio: 'Villeta',
        intendente: {
            id: 'vi1',
            lista: '2R',
            partido: 'HONOR COLORADO R',
            siglas: 'MHC',
            colores: ['#CC0E22'],
            nombre: 'Ricardo Arroyo',
            foto: 'https://assets.sigele.com.py/simulador/villeta/i1.webp',
        },
        posicionIntendente: 1,
        totalIntendentes: 2,
        listaJunta: {
            id: 'vi-junta-1',
            numero: '2R',
            partido: 'HONOR COLORADO R',
            siglas: 'MHC',
            color: '#CC0E22',
        },
        candidatoJunta: { opcion: 8, nombre: 'Maria Jose Cardenas C', foto: 'https://assets.sigele.com.py/simulador/villeta/jm8.webp' },
        totalCandidatosJunta: 12,
        posicionListaJunta: 1,
        totalListasJunta: 3,
    },

    'demo': {
        municipio: 'Demo',
        intendente: {
            id: 'dm2',
            lista: '2',
            partido: 'MOVIMIENTO PROGRESISTA',
            siglas: 'MP',
            colores: ['#1A5C2A'],
            nombre: 'Miguel Ángel Benítez Sosa',
            foto: 'https://assets.sigele.com.py/simulador/demo/i2.webp',
        },
        posicionIntendente: 2,
        totalIntendentes: 3,
        listaJunta: {
            id: 'dm-junta-2',
            numero: '2',
            partido: 'MOVIMIENTO PROGRESISTA',
            siglas: 'MP',
            color: '#1A5C2A',
        },
        candidatoJunta: { opcion: 5, nombre: 'Juan González', foto: 'https://assets.sigele.com.py/simulador/demo/jm5.webp' },
        totalCandidatosJunta: 12,
        posicionListaJunta: 2,
        totalListasJunta: 3,
    },

};

// ── API pública ───────────────────────────────────────────────────────────────

export type { DatosTenant };

export function getDatosSimulador(): DatosTenant | null {
    const tenant = getTenant();
    if (!tenant) return null;
    return TENANTS[tenant] ?? null;
}

export function buildCandidatosIntendente(datos: DatosTenant): CandidatoIntendente[] {
    let nPlaceholder = 0;
    return Array.from({ length: datos.totalIntendentes }, (_, i) => {
        const posicion = i + 1;
        if (posicion === datos.posicionIntendente) return datos.intendente;
        nPlaceholder++;
        return {
            id: `placeholder-i-${nPlaceholder}`,
            lista: '',
            partido: '',
            siglas: '',
            colores: ['#999'],
            nombre: `Candidato ${nPlaceholder}`,
            placeholder: true,
        };
    });
}

export function buildCandidatosJunta(datos: DatosTenant): CandidatoJunta[] {
    let nPlaceholder = 0;
    return Array.from({ length: datos.totalCandidatosJunta }, (_, i) => {
        const opcion = i + 1;
        if (opcion === datos.candidatoJunta.opcion) return datos.candidatoJunta;
        nPlaceholder++;
        return { opcion, nombre: `Candidato ${nPlaceholder}`, placeholder: true };
    });
}

export function buildListasJunta(datos: DatosTenant): ListaJunta[] {
    let nPlaceholder = 0;
    return Array.from({ length: datos.totalListasJunta }, (_, i) => {
        const posicion = i + 1;
        if (posicion === datos.posicionListaJunta) return datos.listaJunta;
        nPlaceholder++;
        return {
            id: `placeholder-l-${nPlaceholder}`,
            numero: '',
            partido: '',
            siglas: '',
            color: '#999',
            placeholder: true,
        };
    });
}
