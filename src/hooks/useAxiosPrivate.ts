import { useEffect } from 'react'
import { axiosPrivate } from '../api/axios'
import { useAuthStore } from './state'
import useRefreshToken from './useRefreshToken'


export default function useAxiosPrivate() {
    const refresh = useRefreshToken()
    const { token } = useAuthStore((state) => state)


    useEffect(() => {

        const requestIntercept =  axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization'] && token){
                    const parsedToken = JSON.parse(token)
                    config.headers['Authorization'] = `Bearer ${parsedToken.accessToken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                if(error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true
                    const newAccessToken = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }
    }, [token, refresh])

    return axiosPrivate
}
