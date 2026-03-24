import axios from 'axios';

export interface BrandingResponse {
    appTitle: string;
    primaryColor: string;
    secondaryColor: string;
    faviconUrl: string;
    candidateName: string; // URL de la imagen del candidato
    candidateTitle: string;
}

const publicClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const getBranding = (): Promise<BrandingResponse> =>
    publicClient.get<BrandingResponse>('/branding').then((r) => r.data);
