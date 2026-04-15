import { TenantPublicPage } from '../../components/TenantPublicPage';

const perfil = {
    habilitado: true,
    nombre: 'Juan González',
    cargo: 'Candidato a Concejal',
    ciudad: 'San Lorenzo',
    mainImage: 'https://assets.sigele.com.py/tenants/cdemo/candidate.png',
    foto: '',
    colores: {
        primary: '#dc2626',
        primaryDark: '#b91c1c',
        primaryDarker: '#991b1b',
    },
    bio: 'Vecino de San Lorenzo, padre de familia y referente comunitario con más de 10 años de trabajo en el barrio. Me postulo para ser la voz de los que siempre fueron ignorados: los vecinos, las familias y los jóvenes que merecen una ciudad mejor.',
    secciones: [
        {
            tipo: 'texto',
            titulo: 'Mi propuesta',
            contenido: 'Voy a trabajar para que San Lorenzo tenga calles iluminadas, plazas seguras y un municipio que atienda de verdad a sus vecinos. Propongo crear un programa de empleo joven, mejorar el acceso a los servicios básicos en los barrios más alejados y abrir una oficina de atención ciudadana abierta todos los días de la semana.',
        },
        {
            tipo: 'texto',
            titulo: '¿Por qué me postulo?',
            contenido: 'Porque conozco los problemas de nuestra ciudad desde adentro. Caminé cada barrio, escuché cada queja, viví cada carencia. No vengo a hacer política por un cargo: vengo porque creo que San Lorenzo merece concejales que trabajen, no que cobren.',
        },
        {
            tipo: 'lista',
            titulo: 'Trayectoria',
            items: [
                'Presidente de la Comisión Vecinal del Barrio San Miguel (2018–2022)',
                'Coordinador del programa municipal de huertos comunitarios (2020)',
                'Voluntario en el comedor infantil "Niños de Luz" por más de 8 años',
                'Licenciado en Administración Pública — Universidad Nacional de Asunción',
                'Capacitador en talleres de emprendimiento (SNPP, 2021–2023)',
            ],
        },
        {
            tipo: 'lista',
            titulo: 'Ejes de mi campaña',
            items: [
                'Seguridad vecinal: más iluminación y cámaras en zonas de riesgo',
                'Empleo joven: convenios con empresas locales para primeros empleos',
                'Salud cercana: ampliar horarios de los centros de salud barriales',
                'Transparencia: publicar en línea todos los gastos del municipio',
                'Deporte y cultura: recuperar las canchas y espacios públicos abandonados',
            ],
        },
    ],
    redesSociales: {
        facebook: 'https://facebook.com/juangonzalez2026',
        instagram: 'https://instagram.com/juangonzalez2026',
    },
};

export default function DemoPage() {
    return <TenantPublicPage perfil={perfil} />;
}
