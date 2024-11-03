import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
	user: { name: string; email: string } | null;
	login: (name: string, email: string) => void;
	logout: () => void;
}

export const useAuthStore = create(persist(
	(set, get) => ({
		user: null,  // Initial state: no user is logged in
		login: (name: string, email: string) => set({ user: { name, email } }),
		logout: () => set({ user: null })
	}),
	{
		name: 'auth-storage',  // Name of the storage item
		storage: createJSONStorage(() => sessionStorage),  // Define the type of storage
	}
));
