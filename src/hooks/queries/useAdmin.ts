import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import useAxiosPrivate from "../useAxiosPrivate";

//QUERY FOR GETTING ALL USER
export const useUsers = () =>{
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
      queryKey: ['users'], 
      queryFn: async () => {
        try {
          const response = await axiosPrivate.get('/get-all-voters')
          return response.data
        } catch (error:any) {
            if (error.message === 'Network Error') {
                message.open({
                  type: 'error',
                  content: 'Server Unavailable',
                  className: 'custom-class pop-medium',
                  duration: 2.5,
                });
              } else if(error.response.data?.message){
                message.open({
                  type: 'error',
                  content: `${error.response.data.message}`,
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
      },
  }) 
} 

//QUERY FOR DEMOTING ADMIN
export const useDemoteAdmin = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, new_role: string}) => {
          const response = await axiosPrivate.patch(`/change-role`, {
            student_id: newData.student_id,
            new_role: newData.new_role
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Admin Demoted :)',
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
            } else if(error.response.data?.message){
              message.open({
                type: 'error',
                content: `${error.response.data.message}`,
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