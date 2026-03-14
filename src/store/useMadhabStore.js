import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMadhabStore = create(
    persist(
        (set) => ({
            // Tracks whether user has completed onboarding (used as the gate in App.jsx)
            selectedMadhab: null, // keeping the key name so localStorage doesn't break
            userName: 'Seeker',
            setMadhab: () => set({ selectedMadhab: 'unified' }), // always "unified" now
            setUserName: (name) => set({ userName: name }),
            clearMadhab: () => set({ selectedMadhab: null }),
            completeOnboarding: () => set({ selectedMadhab: 'unified' }),
        }),
        {
            name: 'islam101-madhab',
        }
    )
);
