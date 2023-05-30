import axios from "../api/axios"
import { useAuthStore } from "./state"

export default function useRefreshToken() {
  const {setToken} = useAuthStore((state) => state)

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true,
    })
    //console.log(response.data);
    setToken(response.data)
    useAuthStore.setState({student_id: response.data.student_id});
    return response.data.accessToken
  }
  return refresh
}
