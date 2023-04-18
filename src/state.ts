import { create } from "zustand"

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    loginAdmin: (token: string) => void;
    logoutAdmin: () => void;
}

  
export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    token: null,
  
    //Login
    loginAdmin: (token: string) => {
      localStorage.setItem('adminToken', token);
      set({ isAuthenticated: true, token });
    },
    
    //Logout
    logoutAdmin: () => {
      localStorage.removeItem('adminToken');
      set({ isAuthenticated: false, token: null });
    }
  }));