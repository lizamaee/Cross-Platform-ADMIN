import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import useAxiosPrivate from "../useAxiosPrivate";


//QUERY FOR GETTING ALL ELECTIONS
export const useElections = () => {
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
      queryKey: ['elections'], 
      queryFn: async () => {
        try {
          const response = await axiosPrivate.get('/election')
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

//QUERY FOR CREATING A SINGLE ELECTION
export const useCreateElection = () => {
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()

    return useMutation({
        mutationFn: async (newElectionData: {title: string, banner: string, startDate: string, endDate: string}) =>{
            const response = await axiosPrivate.post('/election', newElectionData)
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

//QUERY FOR DELETING A SINGLE ELECTION
export const useDeleteElection = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (id:string) => {
        const response = await axiosPrivate.delete(`/election/${id}`)
        return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Election Deleted :)',
              duration: 2,
          })
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

//QUERY FOR UPDATING A SINGLE ELECTION
export const useUpdateElection = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {id:string, title: string, banner: string, startDate: string, endDate: string}) => {
          const response = await axiosPrivate.patch(`/election/single/${newData.id}`, {
            title: newData.title,
            banner: newData.banner,
            start_date: newData.startDate,
            end_date: newData.endDate,
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Election Updated :)',
              duration: 2,
          })
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