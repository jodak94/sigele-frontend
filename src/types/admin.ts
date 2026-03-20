export interface AdminKpis {
    totalActivos: number;
    candidatosMesa: number;
    requierenTransporte: number;
    tachados: number;
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

export interface CoordinatorPerformance {
    id: number;
    fullName: string;
    cantOperadores: number;
    totalCargados: number;
    miembrosMesa: number;
}

export interface BarrioStat {
    nombre: string;
    seccional: string;
    total: number;
}

export interface ConsultasStats {
    hoy: number;
    ayer: number;
    ultimosSieteDias: number;
    total: number;
}

export interface VoterSearchResult {
    found: boolean;
    cedula: string;
    electorNombre?: string;
    electorApellido?: string;
    operadorNombre?: string;
    operadorId?: number;
}
