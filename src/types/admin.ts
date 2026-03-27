export interface AdminKpis {
    activos: number;
    candidatosMesa: number;
    requierenTransporte: number;
    borrados: number;
}

export interface OperatorStats {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    registros: number;
    mesa: number;
    tachas: number;
}

export interface OperatorRanking {
    userId: number;
    fullName: string;
    totalElectores: number;
}

export interface OperatorInfo {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    totalElectores: number;
    miembrosMesa: number;
    requierenTransporte: number;
}

export interface CoordinatorPerformance {
    id: number;
    fullName: string;
    cantOperadores: number;
    totalCargados: number;
    miembrosMesa: number;
}

export interface CoordinadorResumen {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    totalOperadores: number;
    totalElectores: number;
    totalMiembrosMesa: number;
}

export interface BarrioStat {
    nombre: string;
    seccional: string;
    total: number;
}

export interface SeccionalStat {
    codigoSeccional: number;
    totalElectores: number;
}

export interface ConsultasStats {
    hoy: number;
    ayer: number;
    ultimosSieteDias: number;
    total: number;
}

export interface PadronPublicoStats {
    totalConsultas: number;
    ultimosSieteDias: number;
    cedulasUnicas: number;
    horarioPico: number;
}

export interface TopLocalItem {
    localVotacion: string;
    totalBusquedas: number;
}

export interface UltimaConsultaItem {
    fechaHora: string;
    cedula: string;
    encontrado: boolean;
}

export interface VoterSearchResult {
    found: boolean;
    cedula: string;
    electorNombre?: string;
    electorApellido?: string;
    operadorNombre?: string;
    operadorId?: number;
}

export interface ElectorEnListaResult {
    electorId: number;
    nombre: string;
    apellido: string;
    numeroCed: number;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
    nroTelefono: string;
    direccionRecogida: string;
    operador: {
        id: number;
        fullName: string;
        email: string;
        phone: string;
    };
}
