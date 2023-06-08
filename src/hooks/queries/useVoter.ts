import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import useAxiosPrivate from "../useAxiosPrivate";


//QUERY FOR RECOVERING A VOTER ACCOUNT
export const useRecoverAccount = () => {
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    return useMutation({
        mutationFn:async (newData: {student_id: string, new_password: string, mobile_number: string, pin_code: string}) => {
            const response = await axiosPrivate.patch(`/recover-account`, {
              student_id: newData.student_id,
              new_password: newData.new_password,
              mobile_number: newData.mobile_number,
              pin_code: newData.pin_code
            } )
            return response.data
        },
        onSuccess: async () => {
            message.open({
                key: 'successCreation',
                type: 'success',
                content: 'Account Recovered :)',
                duration: 2,
            })
            await queryClient.invalidateQueries({
                queryKey: ['users'],
                exact: true
            })
        },
        onError: (error:any) => {
            if (error.message === 'Network Error') {
                message.open({
                  type: 'error',
                  content: 'Server Unavailable',
                  className: 'custom-class pop-medium',
                  duration: 2.5,
                });
              } else if(error.response.data?.error){
                message.open({
                  type: 'error',
                  content: `${error.response.data.error}`,
                  className: 'custom-class pop-medium',
                  duration: 2.5,
                });
              }else {
                // Handle other errors
                error.response.data.errors?.map((err:any) => {
                  message.open({
                    type: 'error',
                    content: `${err.msg}`,
                    className: 'custom-class pop-medium',
                    duration: 2.5,
                  })
                })
              }
        }
    })
  }