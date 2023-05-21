import axios from "../api/axios"
import { useAuthStore } from "./state"


export default function useLogout() {
    const {setToken, student_id} = useAuthStore((state) => state)

    const logout = async () => {
        setToken({})
        try {
            const response = await axios.post('/logout',{student_id}, {
                withCredentials: true
            })
        } catch (error) {
            console.error(error);
            
        }
    }
  return logout
}
