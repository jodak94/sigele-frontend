import type { DatosMunicipio } from '../tipos';

export const datosDemo: DatosMunicipio = {
    municipio: 'Demo',

    // ── Candidatos a Intendente ───────────────────────────────────────────────
    candidatosIntendente: [
        {
            id: 'dm1',
            lista: '1',
            partido: 'MOVIMIENTO RENOVACIÓN',
            siglas: 'MR',
            colores: ['#1B3A6B'],
            nombre: 'Carlos Alberto Rodríguez',
            foto: 'https://assets.sigele.com.py/simulador/demo/i1.webp',
        },
        {
            id: 'dm2',
            lista: '2',
            partido: 'MOVIMIENTO PROGRESISTA',
            siglas: 'MP',
            colores: ['#1A5C2A'],
            nombre: 'Miguel Ángel Benítez Sosa',
            foto: 'https://assets.sigele.com.py/simulador/demo/i2.webp',
        },
        {
            id: 'dm3',
            lista: '5',
            partido: 'MOVIMIENTO TRADICIÓN',
            siglas: 'MT',
            colores: ['#7B1A1A'],
            nombre: 'María Elena Cabrera Romero',
            foto: 'https://assets.sigele.com.py/simulador/demo/i3.webp',
        },
    ],

    // ── Listas participantes a Junta Municipal ────────────────────────────────
    listasJunta: [
        {
            id: 'dm-junta-1',
            numero: '1',
            partido: 'MOVIMIENTO RENOVACIÓN',
            siglas: 'MR',
            color: '#1B3A6B',
        },
        {
            id: 'dm-junta-2',
            numero: '2',
            partido: 'MOVIMIENTO PROGRESISTA',
            siglas: 'MP',
            color: '#1A5C2A',
        },
        {
            id: 'dm-junta-3',
            numero: '5',
            partido: 'MOVIMIENTO TRADICIÓN',
            siglas: 'MT',
            color: '#7B1A1A',
        },
    ],

    // ── Candidatos por lista ──────────────────────────────────────────────────
    candidatosPorLista: {
        'dm-junta-2': [
            { opcion: 1,  nombre: 'Lic. Roberto Fernández',     foto: 'https://assets.sigele.com.py/simulador/demo/jm1.webp' },
            { opcion: 2,  nombre: 'Dra. Sandra López Vera',     foto: 'https://assets.sigele.com.py/simulador/demo/jm2.webp' },
            { opcion: 3,  nombre: 'Ing. Diego Martínez',        foto: 'https://assets.sigele.com.py/simulador/demo/jm3.webp' },
            { opcion: 4,  nombre: 'Abog. Luis Ramírez Duarte',  foto: 'https://assets.sigele.com.py/simulador/demo/jm4.webp' },
            { opcion: 5,  nombre: 'Juan González',              foto: 'https://assets.sigele.com.py/simulador/demo/jm5.webp' },
            { opcion: 6,  nombre: 'Prof. Ana Giménez Sánchez',  foto: 'https://assets.sigele.com.py/simulador/demo/jm6.webp' },
            { opcion: 7,  nombre: 'Carlos Villalba',            foto: 'https://assets.sigele.com.py/simulador/demo/jm7.webp' },
            { opcion: 8,  nombre: 'Lic. Patricia Núñez Acosta', foto: 'https://assets.sigele.com.py/simulador/demo/jm8.webp' },
            { opcion: 9,  nombre: 'Lorena Escobar',             foto: 'https://assets.sigele.com.py/simulador/demo/jm9.webp' },
            { opcion: 10, nombre: 'Abog. Héctor Ríos Benítez',  foto: 'https://assets.sigele.com.py/simulador/demo/jm10.webp' },
            { opcion: 11, nombre: 'Lic. Andrés Paredes',        foto: 'https://assets.sigele.com.py/simulador/demo/jm11.webp' },
            { opcion: 12, nombre: 'Oscar Medina Cáceres',       foto: 'https://assets.sigele.com.py/simulador/demo/jm12.webp' },
        ],
    },
};