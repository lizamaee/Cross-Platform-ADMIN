import { create } from "zustand"

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    loginAdmin: (token: {}) => void;
    logoutAdmin: () => void;
    isNight: boolean;
    switchMode: () => void;
}

  
export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    token: null,
    isNight: false,
  
    //Login
    loginAdmin: (token: {}) => {
      localStorage.setItem('token', JSON.stringify(token));
      set({ isAuthenticated: true, token: JSON.stringify(token) });
    },
    
    //Logout
    logoutAdmin: () => {
      localStorage.removeItem('token');
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