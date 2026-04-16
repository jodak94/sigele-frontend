export interface CandidatoIntendente {
    id: string;
    lista: string;
    partido: string;
    siglas: string,
    colores: string[];   // [primary] o [primary, secondary]
    nombre: string;
    foto?: string;       // URL CloudFront, ej: "https://cdn.sigele.com.py/simulador/naomyferrer/martinez.webp"
}

export interface ListaJunta {
    id: string;
    numero: string;
    partido: string;
    siglas: string;
    color: string;       // color del partido, usado en avatares de candidatos
}

export interface CandidatoJunta {
    opcion: number;
    nombre: string;
    foto?: string;       // URL CloudFront
}

export interface DatosMunicipio {
    municipio: string;
    candidatosIntendente: CandidatoIntendente[];
    listasJunta: ListaJunta[];
    /** Mapa lista.id → candidatos a junta de esa lista */
    candidatosPorLista: Record<string, CandidatoJunta[]>;
}

/** Candidaturas propias del tenant — las demás opciones se muestran deshabilitadas */
export interface ConfigTenant {
    intendenteId: string;         // CandidatoIntendente.id
    listaJuntaId: string;         // ListaJunta.id
    candidatoJuntaOpcion: number; // CandidatoJunta.opcion
}
