import type { DatosMunicipio } from '../tipos';

export const datosLimpio: DatosMunicipio = {
    municipio: 'Limpio',

    // ── Candidatos a Intendente ───────────────────────────────────────────────
    candidatosIntendente: [
        {
            id: 'lm1',
            lista: '2A',
            partido: 'HONOR COLORADO A',
            siglas: 'MHC',
            colores: ['#CC0E22'],
            nombre: 'Manuel Aguilar',
            foto: 'https://assets.sigele.com.py/simulador/limpio/i1.webp',
        },
        {
            id: 'lm2',
            lista: '2M',
            partido: 'HONOR COLORADO M',
            siglas: 'MHC',
            colores: ['#CC0E22'],
            nombre: 'Mabel Gomez Jara',
            foto: 'https://assets.sigele.com.py/simulador/limpio/i2.webp',
        },
        {
            id: 'lm3',
            lista: '5',
            partido: 'CAUSA REPUBLICANA',
            siglas: 'MCR',
            colores: ['#CC0E22'],
            nombre: 'Cristhian Reinaldo Miranda Arriola',
            foto: 'https://assets.sigele.com.py/simulador/limpio/i3.webp',
        },
        {
            id: 'lm4',
            lista: '7',
            partido: 'COLORADO RENOVADOR',
            siglas: 'MCR',
            colores: ['#CC0E22'],
            nombre: 'Jesus Maria Martinez Gaona',
            foto: 'https://assets.sigele.com.py/simulador/limpio/i4.webp',
        },
    ],

    // ── Listas participantes a Junta Municipal ────────────────────────────────
    listasJunta: [
        {
            id: 'lm-junta-1',
            numero: '2A',
            partido: 'HONOR COLORADO A',
            siglas: 'MHC',
            color: '#CC0E22',
        },
        {
            id: 'lm-junta-2',
            numero: '2M',
            partido: 'HONOR COLORADO M',
            siglas: 'MHC',
            color: '#CC0E22',
        },
        {
            id: 'lm-junta-3',
            numero: '5',
            partido: 'CAUSA REPUBLICANA',
            siglas: 'MCR',
            color: '#CC0E22',
        },
        {
            id: 'lm-junta-4',
            numero: '7',
            partido: 'COLORADO RENOVADOR',
            siglas: 'MCR',
            color: '#CC0E22',
        },
    ],
    // ── Candidatos por lista ──────────────────────────────────────────────────
    // Clave = lista.id definido arriba en listasJunta
    // Cada lista tiene sus propios candidatos en orden de opción (hasta 24 para el grid 6×4)
    candidatosPorLista: {
    'lm-junta-1': [
        { 
            opcion: 1, nombre: 'Lic. Cesar Mendez', foto: 'https://assets.sigele.com.py/simulador/limpio/jm1.webp' 
        },
        { 
            opcion: 2, nombre: 'Dani Vazquez', foto: 'https://assets.sigele.com.py/simulador/limpio/jm2.webp' 
        },
        { 
            opcion: 3, nombre: 'Lic. Giselle Paredes', foto: 'https://assets.sigele.com.py/simulador/limpio/jm3.webp' 
        },
        { 
            opcion: 4, nombre: 'Roberto Martinez', foto: 'https://assets.sigele.com.py/simulador/limpio/jm4.webp' 
        },
        { 
            opcion: 5, nombre: 'Esmilse Bobadilla', foto: 'https://assets.sigele.com.py/simulador/limpio/jm5.webp' 
        },
        { 
            opcion: 6, nombre: 'Diosnel Ferloni', foto: 'https://assets.sigele.com.py/simulador/limpio/jm6.webp' 
        },
        { 
            opcion: 7, nombre: 'Liza Ruiz Diaz', foto: 'https://assets.sigele.com.py/simulador/limpio/jm7.webp' 
        },
        { 
            opcion: 8, nombre: 'Lic. Carlos Acosta', foto: 'https://assets.sigele.com.py/simulador/limpio/jm8.webp' 
        },
        { 
            opcion: 9, nombre: 'Crio. Julio Diaz', foto: 'https://assets.sigele.com.py/simulador/limpio/jm9.webp' 
        },
        { 
            opcion: 10, nombre: 'Abog. Joel Gomez Mendieta', foto: 'https://assets.sigele.com.py/simulador/limpio/jm10.webp' 
        },
        { 
            opcion: 11, nombre: 'Oliver Rivas', foto: 'https://assets.sigele.com.py/simulador/limpio/jm11.webp' }
            ,
        { 
            opcion: 12, nombre: 'Lic. Adolfo Paredes', foto: 'https://assets.sigele.com.py/simulador/limpio/jm12.webp' 
        },
    ],
    },
};
