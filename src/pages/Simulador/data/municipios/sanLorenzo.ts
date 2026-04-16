import type { DatosMunicipio } from '../tipos';

export const datosSanLorenzo: DatosMunicipio = {
    municipio: 'San Lorenzo',

    // ── Candidatos a Intendente ───────────────────────────────────────────────
    // foto: URL CloudFront, ej: "https://cdn.sigele.com.py/simulador/sanlorenzo/apellido.webp"
    candidatosIntendente: [
        {
            id: 'sli1',
            lista: '2A',
            partido: 'HONOR COLORADO A',
            siglas: 'MHC',
            colores: ['#CC0E22'],
            nombre: 'Felipito Salomón',
            foto: 'https://assets.sigele.com.py/simulador/san-lorenzo/i1.webp',
        },
        {
            id: 'sli2',
            lista: '2E',
            partido: 'HONOR COLORADO E',
            siglas: 'MHC',
            colores: ['#CC0E22'],
            nombre: 'Edgar Lopez',
            foto: 'https://assets.sigele.com.py/simulador/san-lorenzo/i2.webp',
        },
    ],

    // ── Listas participantes a Junta Municipal ────────────────────────────────
    listasJunta: [
        {
            id: 'sl-junta-1',
            numero: '2A',
            partido: 'Honor Colorado A',
            siglas: 'MHC',
            color: '#CC0E22',
        },
        {
            id: 'sl-junta-2',
            numero: '2E',
            partido: 'Honor Colorado E',
            siglas: 'MHC',
            color: '#CC0E22',
        },
        {
            id: 'sl-junta-3',
            numero: '11',
            partido: 'Sanlo Para Todos',
            siglas: 'MSPT',
            color: '#CC0E22',
        },
        {
            id: 'sl-junta-4',
            numero: '14',
            partido: 'Patriotismo Colorado',
            siglas: 'MPC',
            color: '#CC0E22',
        },
        {
            id: 'sl-junta-5',
            numero: '35',
            partido: 'Colorados Sanlorenzanos de Bien',
            siglas: 'MCSB',
            color: '#CC0E22',
        },
    ],
    // ── Candidatos por lista ──────────────────────────────────────────────────
    // Clave = lista.id definido arriba en listasJunta
    // Cada lista tiene sus propios candidatos en orden de opción (hasta 24 para el grid 6×4)
    candidatosPorLista: {
        'sl-junta-1': [
            { 
                opcion: 1,  
                nombre: 'Lilo Dominguez',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm1.webp"
            },
            { 
                opcion: 2,
                nombre: 'Ignacio Britez',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm2.webp"
            },
            { 
                opcion: 3,
                nombre: 'Derlis Acuña',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm3.webp"
            },
            { 
                opcion: 4,
                nombre: 'Lic. Myriam Fernandez',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm4.webp"
            },
            { 
                opcion: 5,
                nombre: 'Pedro Martinez',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm5.webp"
            },
            { 
                opcion: 6,
                nombre: 'Hugo Lezcano',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm6.webp"
            },
            { 
                opcion: 7,
                nombre: 'Koke Nuñez',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm7.webp"
            },
            { 
                opcion: 8,
                nombre: 'Steven Barreto',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm8.webp"
            },
            { 
                opcion: 9,
                nombre: 'Clarita Gomez',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm9.webp"
            },
            { 
                opcion: 10,
                nombre: 'Naomy Ferrer',            
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm10.webp"
            },
            { 
                opcion: 11,
                nombre: 'Omarcito Benitez',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm11.webp"
            },
            { 
                opcion: 12,
                nombre: 'Shaka Gonzalez Meyer',
                foto: "https://assets.sigele.com.py/simulador/san-lorenzo/jm12.webp"
            },
        ],
    },
};
