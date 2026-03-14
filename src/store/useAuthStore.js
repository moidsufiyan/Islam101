import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../utils/api';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isLoading: false,
            error: null,

            // ── Register a new user ───────────────────────────────────────────
            register: async (name, email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const data = await authAPI.register(name, email, password);
                    if (data.success) {
                        localStorage.setItem('islam101_token', data.token);
                        set({ token: data.token, user: data.user, isLoading: false });
                        return { success: true };
                    } else {
                        set({ error: data.message, isLoading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err) {
                    set({ error: 'Network error. Is the server running?', isLoading: false });
                    return { success: false, message: 'Network error' };
                }
            },

            // ── Login an existing user ────────────────────────────────────────
            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const data = await authAPI.login(email, password);
                    if (data.success) {
                        localStorage.setItem('islam101_token', data.token);
                        set({ token: data.token, user: data.user, isLoading: false });
                        return { success: true };
                    } else {
                        set({ error: data.message, isLoading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err) {
                    set({ error: 'Network error. Is the server running?', isLoading: false });
                    return { success: false, message: 'Network error' };
                }
            },

            // ── Verify token on page reload ───────────────────────────────────
            checkAuth: async () => {
                const token = localStorage.getItem('islam101_token');
                if (!token) {
                    set({ token: null, user: null });
                    return;
                }
                try {
                    const data = await authAPI.me();
                    if (data.success) {
                        set({ token, user: data.user });
                    } else {
                        localStorage.removeItem('islam101_token');
                        set({ token: null, user: null });
                    }
                } catch {
                    // Server might be offline — keep the token, user will retry
                }
            },

            // ── Logout ────────────────────────────────────────────────────────
            logout: () => {
                localStorage.removeItem('islam101_token');
                set({ token: null, user: null, error: null });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'islam101-auth',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
            }),
        }
    )
);
