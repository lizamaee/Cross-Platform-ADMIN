import { create } from "zustand"

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    setToken: (token: {}) => void;
    logoutAdmin: () => void;
    isNight: boolean;
    switchMode: () => void;
}

  
export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    token: null,
    isNight: false,
  
    //Login
    setToken: (token: {}) => {
      set({ token: JSON.stringify(token) });
    },
    
    //Logout
    logoutAdmin: () => {
      set({ isAuthenticated: false, token: null });
    },

    //Light Mode / Dark Mode
    switchMode: () => {
      const isNight = useAuthStore.getState().isNight;
      const theme = isNight ? 'light' : 'dark';
      localStorage.theme = theme;
      useAuthStore.setState({ isNight: !isNight });
    }

  }));