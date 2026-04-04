import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BrandingData {
    appTitle: string;
    primaryColor: string;
    secondaryColor: string;
    faviconUrl: string;
    candidateImageUrl: string;
    candidateTitle: string;
    zona: string;
}

export const BRANDING_TTL_MS = 60 * 60 * 1000; // 1 hora

interface BrandingStore {
    branding: BrandingData | null;
    cachedAt: number | null;
    setBranding: (data: BrandingData) => void;
}

export const useBrandingStore = create<BrandingStore>()(
    persist(
        (set) => ({
            branding: null,
            cachedAt: null,
            setBranding: (data) => set({ branding: data, cachedAt: Date.now() }),
        }),
        {
            name: `branding:${window.location.hostname}`,
        }
    )
);
