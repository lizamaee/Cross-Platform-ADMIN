import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import useAxiosPrivate from "../useAxiosPrivate";

//QUERY FOR GETTING ALL ORGANIZATIONS
export const useOrganizations = () =>{
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
      queryKey: ['organizations'], 
      queryFn: async () => {
        try {
          const response = await axiosPrivate.get('/organization')
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

//QUERY FOR CREATING A SINGLE ORGANIZATION
export const useCreateOrganization = () => {
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()

    return useMutation({
        mutationFn: async (newOrganizationData: {org_name: string, logo_url: string, startDate: string, endDate: string}) =>{
            const response = await axiosPrivate.post('/organization', newOrganizationData)
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
                queryKey: ['organizations'],
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

//QUERY FOR DELETING A SINGLE ORGANIZATION
export const useDeleteOrganization = () => {
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    return useMutation({
        mutationFn:async (id:string) => {
            const response = await axiosPrivate.delete(`/organization/${id}`)
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['organizations'],
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

//QUERY FOR UPDATING A SINGLE ORGANIZATION
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {id:string, org_name: string, logo_url: string, startDate: string, endDate: string}) => {
          const response = await axiosPrivate.patch(`organization/${newData.id}`, {
            org_name: newData.org_name,
            logo_url: newData.logo_url,
            startDate: newData.startDate,
            endDate: newData.endDate,
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Organization Updated :)',
              duration: 2,
          })
          await queryClient.invalidateQueries({
              queryKey: ['organizations'],
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