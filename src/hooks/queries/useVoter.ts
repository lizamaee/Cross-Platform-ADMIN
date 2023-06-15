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

//QUERY FOR DELETING A SINGLE VOTER
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (id:string) => {
          const response = await axiosPrivate.delete(`/admin/delete-account/${id}`)
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Voter Deleted :)',
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


//VOTER
//QUERY FOR UPLOADING VOTER PROFILE PICTURE
export const useUploadVoterPicture = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, profile_picture: string,}) => {
          const response = await axiosPrivate.patch(`/change-student-picture`, {
            student_id: newData.student_id,
            new_profile_picture: newData.profile_picture,
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Profile Picture Uploaded :)',
              duration: 2,
          })
          await queryClient.invalidateQueries({
              queryKey: ['voter'],
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
//QUERY FOR UPLOADING VOTER PROFILE PICTURE
export const useUploadVoterInfo = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, fullname: string,}) => {
          const response = await axiosPrivate.patch(`/new-voter`, {
            student_id: newData.student_id,
            fullname: newData.fullname,
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Profile Picture Uploaded :)',
              duration: 2,
          })
          await queryClient.invalidateQueries({
              queryKey: ['voter'],
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