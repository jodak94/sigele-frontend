import { getTenant } from '../../../utils/tenant';
import type { DatosMunicipio, ConfigTenant } from './tipos';

// ── Importar un archivo por cada municipio configurado ───────────────────────
import { datosSanLorenzo } from './municipios/sanLorenzo';
import { datosLimpio } from './municipios/limpio';

// ── Configuración por tenant ──────────────────────────────────────────────────
// municipio: datos electorales compartidos entre tenants del mismo municipio
// config:    candidaturas propias del tenant (las demás se muestran deshabilitadas)
const TENANTS: Record<string, { municipio: DatosMunicipio; config: ConfigTenant }> = {
    'naomyferrer': {
        municipio: datosSanLorenzo,
        config: {
            intendenteId: 'sli1',          // Felipito Salomón - Honor Colorado A
            listaJuntaId: 'sl-junta-1',    // Honor Colorado A
            candidatoJuntaOpcion: 10,       // Naomy Ferrer
        },
    },
    'joelgomez': {
        municipio: datosLimpio,
        config: {
            intendenteId: 'lm1',          // Manuel Aguilar - Honor Colorado A
            listaJuntaId: 'lm-junta-1',    // Honor Colorado A
            candidatoJuntaOpcion: 10,       // Joel Gomez
        },
    },
    // 'otro-candidato': {
    //     municipio: datosSanLorenzo,
    //     config: {
    //         intendenteId: 'sli2',
    //         listaJuntaId: 'sl-junta-2',
    //         candidatoJuntaOpcion: 3,
    //     },
    // },
};

export type DatosSimulador = { municipio: DatosMunicipio; config: ConfigTenant };

/**
 * Retorna los datos del municipio y la config del tenant activo.
 * Si el tenant no está configurado, retorna null → redirige a /padron.
 */
export function getDatosSimulador(): DatosSimulador | null {
    const tenant = getTenant();
    if (!tenant) return null;
    return TENANTS[tenant] ?? null;
}
