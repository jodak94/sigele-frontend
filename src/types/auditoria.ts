export interface AuditoriaPoint {
    operadorId: number;
    operadorNombre: string;
    operadorEmail: string;
    electorId: number;
    electorNombre: string;
    electorApellido: string;
    electorCedula: number;
    lat: number;
    lng: number;
    descripcion: string;
    creadoEn: string;
}

export interface AlertaOperador {
    operadorId: number;
    operadorNombre: string;
    operadorEmail: string;
}

export interface AlertaItem {
    tipoAlerta: string;
    descripcion: string;
    operador: AlertaOperador;
}

export interface AlertaCaptacion {
    electorNombre: string;
    electorApellido: string;
    cedulaElector: number;
    createdAt: string;
}
