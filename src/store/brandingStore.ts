import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BrandingData {
    appTitle: string;
    primaryColor: string;
    secondaryColor: string;
    faviconUrl: string;
    candidateImageUrl: string;
    candidateTitle: string;
}

interface BrandingStore {
    branding: BrandingData | null;
    setBranding: (data: BrandingData) => void;
}

export const useBrandingStore = create<BrandingStore>()(
    persist(
        (set) => ({
            branding: null,
            setBranding: (data) => set({ branding: data }),
        }),
        {
            name: `branding:${window.location.hostname}`,
        }
    )
);
