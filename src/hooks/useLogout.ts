import { useQueryClient } from "@tanstack/react-query"
import axios from "../api/axios"
import { useAuthStore } from "./state"


export default function useLogout() {
    const {setToken, student_id} = useAuthStore((state) => state)
    const queryClient = useQueryClient()
    const logout = async () => {
        setToken({})
        try {
            if(student_id){
                const response = await axios.post('/logout',{student_id}, {
                    withCredentials: true
                })
                await queryClient.invalidateQueries({
                    queryKey: ['voter'],
                    exact: true
                })
            }
            useAuthStore.setState({student_id: ''})
        } catch (error) {
            console.error(error);
        }
    }
  return logout
}
