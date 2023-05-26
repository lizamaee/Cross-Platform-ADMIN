import axios from "../api/axios"
import { useAuthStore } from "./state"


export default function useLogout() {
    const {setToken} = useAuthStore((state) => state)
    const id = localStorage.getItem('student_id')
    const logout = async () => {
        setToken({})
        try {
            if(id){
                const student_id = JSON.parse(id)
                const response = await axios.post('/logout',{student_id}, {
                    withCredentials: true
                })
            }
        } catch (error) {
            console.error(error);
        }
    }
  return logout
}
