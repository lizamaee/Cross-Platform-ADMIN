import { create } from "zustand"

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    student_id: string;
    setToken: (token: {}) => void;
    setStudentID: (id: string) => void;
    isNight: boolean;
    switchMode: () => void;
    tempPassword: string;
    tempMobileNumber: string;
    tempPin: string;
}

  
export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    token: null,
    student_id: '',
    isNight: false,
    tempMobileNumber: '',
    tempPassword: '',
    tempPin: '',
  
    //Login
    setToken: (token: {}) => {
      set({ token: JSON.stringify(token) });
    },

    setStudentID: (id: string) =>{
      set({student_id: id})
    },

    //Light Mode / Dark Mode
    switchMode: () => {
      const isNight = useAuthStore.getState().isNight;
      const theme = isNight ? 'light' : 'dark';
      localStorage.theme = theme;
      useAuthStore.setState({ isNight: !isNight });
    }

  }));