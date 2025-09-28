import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    role: null,
    cart: [],
    setUser: (user, role) => set({ user, role }),
    clearUser: () => set({ user: null, role: null }),
    setCart: (cart) => set(cart),
    clearCart: () => set({ cart: null })
}));

export default useAuthStore;