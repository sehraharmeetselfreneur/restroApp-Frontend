import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    role: null,
    setUser: (user, role) => set({ user, role }),
    clearUser: () => set({ user: null, role: null })
}));

export default useAuthStore;