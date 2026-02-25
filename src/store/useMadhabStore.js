import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMadhabStore = create(
    persist(
        (set) => ({
            selectedMadhab: null,
            userName: 'Seeker',
            setMadhab: (madhab) => set({ selectedMadhab: madhab }),
            setUserName: (name) => set({ userName: name }),
            clearMadhab: () => set({ selectedMadhab: null }),
        }),
        {
            name: 'islam101-madhab',
        }
    )
);

