import { create } from "zustand"

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    loginAdmin: (token: string) => void;
    logoutAdmin: () => void;
    isNight: boolean;
    switchMode: () => void;
}

  
export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    token: null,
    isNight: false,
  
    //Login
    loginAdmin: (token: string) => {
      localStorage.setItem('adminToken', token);
      set({ isAuthenticated: true, token });
    },
    
    //Logout
    logoutAdmin: () => {
      localStorage.removeItem('adminToken');
      set({ isAuthenticated: false, token: null });
    },

    //Light Mode / Dark Mode
    switchMode: () => {
      if (useAuthStore.getState().isNight) {
        localStorage.theme = 'light';
        useAuthStore.setState({ isNight: false })
      } else {
        localStorage.theme = 'dark';
        useAuthStore.setState({ isNight: true })
      }
    }

  }));