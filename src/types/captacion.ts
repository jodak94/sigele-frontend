export interface Ubicacion {
    lat: number;
    lng: number;
    descripcion: string;
}

export interface ElectorUbicacion {
    electorId: number;
    nombre: string;
    apellido: string;
    numeroCed: number;
    lat: number;
    lng: number;
    descripcion: string;
    operadorNombre: string;
}

export interface CaptacionRecord {
    electorId: number;
    nombre: string;
    apellido: string;
    numeroCed: number;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
    nroTelefono: string;
    direccionRecogida: string;
    ubicacion?: Ubicacion;
}

export interface CreateCaptacionRequest {
    electorId: number;
    nroTelefono: string;
    direccionRecogida?: string;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
    ubicacion?: Ubicacion;
    operadorUbicacion: Ubicacion | null;
    solicitudAlquiler?: boolean;
    capacidadVehiculo?: number;
    montoAlquilerVehiculo?: number;
}

export interface UpdateCaptacionRequest {
    nroTelefono: string;
    direccionRecogida?: string;
    disponibleMiembroMesa: boolean;
    requiereTransporte: boolean;
    ubicacion?: Ubicacion;
}

export interface ReporteElectorItem {
    nroDocumento: number;
    nombre: string;
    apellido: string;
    localVotacion: string;
    mesa: number;
    orden: number;
}

export interface ReporteElectoresResponse {
    operadorNombre: string;
    electores: ReporteElectorItem[];
}

export interface ReporteOperadorItem {
    nombreOperador: string;
    telefono: string;
    electoresCaptados: number;
    miembrosMesaDisp: number;
    reqTransporte: number;
}

export interface ReporteCandidatoMesa {
    nombreApellido: string;
    nroCedula: number;
    telefono: string;
    mesa: number;
    operadorResponsable: string;
}

export interface ReporteCandidatosMesaLocal {
    localVotacion: string;
    candidatos: ReporteCandidatoMesa[];
}

export interface ReporteCandidatosMesaResponse {
    locales: ReporteCandidatosMesaLocal[];
}

export interface ReporteCoordinadorInfo {
    id: number;
    nombre: string;
    telefono: string;
}

export interface ReporteDiaDElector {
    mesa: number;
    orden: number;
    nroCedula: number;
    nombreApellido: string;
    telefono: string;
    direccionRecogida: string | null;
    requiereTransporte: boolean;
    operadorResponsable: string;
}

export interface ReporteDiaDLocal {
    localVotacion: string;
    electores: ReporteDiaDElector[];
}

export interface ReporteDiaDResponse {
    locales: ReporteDiaDLocal[];
}

export interface ReporteResumenOperadoresResponse {
    operadores: ReporteOperadorItem[];
    totales: {
        electoresCaptados: number;
        miembrosMesaDisp: number;
        reqTransporte: number;
    };
    coordinador: ReporteCoordinadorInfo | string | null;
}
