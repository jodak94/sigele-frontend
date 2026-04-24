export interface CandidatoIntendente {
    id: string;
    lista: string;
    partido: string;
    siglas: string;
    colores: string[];
    nombre: string;
    foto?: string;
    placeholder?: boolean;
}

export interface ListaJunta {
    id: string;
    numero: string;
    partido: string;
    siglas: string;
    color: string;
    placeholder?: boolean;
}

export interface CandidatoJunta {
    opcion: number;
    nombre: string;
    foto?: string;
    placeholder?: boolean;
}

/** Datos del tenant — única fuente de candidatos reales */
export interface DatosTenant {
    municipio: string;
    intendente: CandidatoIntendente;
    /** Posición (1-based) del intendente del tenant en la boleta */
    posicionIntendente: number;
    /** Total de candidatos a intendente en el municipio */
    totalIntendentes: number;
    listaJunta: ListaJunta;
    /** Candidato propio del tenant en la lista de junta */
    candidatoJunta: CandidatoJunta;
    /** Total de candidatos en la lista (incluyendo el del tenant) */
    totalCandidatosJunta: number;
    /** Posición (1-based) de la lista del tenant en la boleta */
    posicionListaJunta: number;
    /** Total de listas participantes a junta en el municipio */
    totalListasJunta: number;
}
