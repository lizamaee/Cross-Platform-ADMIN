import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPrivate } from "../../api/axios";
import { message } from "antd";

const fetchElections = async () => {
    try {
        const response = await axiosPrivate.get('/election')
        //console.log(response.data);
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
}

export const useElections = () => 
    useQuery({
        queryKey: ['elections'], 
        queryFn: () => fetchElections(),
    }) 
export const useAvailableOrganizations = () => 
    useQuery({
        queryKey: ['null-orgs'], 
        queryFn: async () => {
            try {
                const response = await axiosPrivate.get(`organization/null`)
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


export const useCreateElection = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newEelectionData: {title: string, startDate: string, endDate: string}) =>{
            const response = await axiosPrivate.post('/election', newEelectionData)
            return response.data
        },
        onSuccess: async () => {
            message.open({
                key: 'successCreation',
                type: 'success',
                content: 'Created Successfully',
                duration: 2,
            }); 
            await queryClient.invalidateQueries({
                queryKey: ['elections'],
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

export const useDeleteElection = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:async (id:string) => {
            const response = await axiosPrivate.delete(`/election/${id}`)
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['elections'],
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