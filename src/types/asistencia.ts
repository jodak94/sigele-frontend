export interface AsistenciaElector {
    userId: number;
    cedula: number;
    nombreApellido: string;
    telefono: string;
    localVotacion: string | null;
    operadorResponsable: string | null;
    asistio: boolean;
    asistioMarcadoEn: string | null;
}

export interface AsistenciaResumen {
    totalElectores: number;
    totalAsistieron: number;
    totalFaltantes: number;
    porcentajeAsistencia: number;
}
