import axios from "../api/axios"
import { useAuthStore } from "./state"


export default function useRefreshToken() {
  const {token, setToken} = useAuthStore((state) => state)

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true,
    })
    if(token){
      const parsedToken = JSON.parse(token)
      console.log(parsedToken);
    }else{
      console.log("No token found");
    } 
    
    setToken(response.data)
    console.log(response.data.accessToken);

    return response.data.accessToken
    
    
  }


  return refresh
}
