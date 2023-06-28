import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import useAxiosPrivate from "../useAxiosPrivate";
import { useNavigate } from "react-router-dom";

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

//QUERY FOR UPLOADING A SINGLE STUDENT ID
export const useUploadId = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
      mutationFn: async (newStudentId: {student_id: string}) =>{
          const response = await axiosPrivate.post('/id', newStudentId)
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'ID Uploaded Successfully',
              duration: 2,
          });
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

//QUERY FOR UPLOADING MULTIPLE STUDENT ID
export const useUploadIds = () => {
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
      mutationFn: async (newStudentIds: {student_ids: string}) =>{
          const response = await axiosPrivate.post('/id/multiple', newStudentIds)
          return response.data
      },
      onSuccess: async (data) => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: `${data.message} Successfully`,
              duration: 2,
          });
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
//QUERY FOR DEMOTING/PROMOTING ADMIN
export const useChangeRole = () => {
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
              content: 'Success :)',
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
//QUERY FOR UPDATING ADMIN PROFILE
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, firstname: string, surname: string, age: string, year_level: string, new_student_id: string}) => {
          const response = await axiosPrivate.patch(`/admin-profile`, {
            student_id: newData.student_id,
            firstname: newData.firstname,
            surname: newData.surname,
            age: newData.age,
            year_level: newData.year_level,
            new_student_id: newData.new_student_id
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Profile Updated :)',
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

//QUERY FOR UPDATING ADMIN IMAGE
export const useUpdateImage = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, profile_picture: string,}) => {
          const response = await axiosPrivate.patch(`/change-admin-picture`, {
            student_id: newData.student_id,
            new_profile_picture: newData.profile_picture,
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Profile Picture Updated :)',
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

//QUERY FOR CHANGING ADMIN MOBILE NUMBER (SEND OTP)
export const useAdminSendOTP = () => {
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn: async (newMobileNumber: {student_id: string, new_mobile_number: string}) =>{
          const response = await axiosPrivate.get('/admin/check-mobile-number', { params: newMobileNumber })
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'OTP Sent',
              duration: 3,
          });
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

//QUERY FOR CHANGING ADMIN MOBILE NUMBER (CONFIRM OTP)
export const useAdminConfirmOTP = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn: async (newMobileNumber: {student_id: string, new_mobile_number: string, new_otp_code: string}) =>{
          const response = await axiosPrivate.post('/admin/confirm-mobile-number', newMobileNumber)
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Mobile Number Successfully Change',
              duration: 3,
          });
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
//QUERY FOR UPDATING ADMIN PIN
export const useChangePin = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, new_pin_number: string,}) => {
          const response = await axiosPrivate.patch(`/admin/change-student-pin-number`, {
            student_id: newData.student_id,
            new_pin_number: newData.new_pin_number,
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Pin Code Changed :)',
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

//QUERY FOR UPDATING ADMIN PASSWORD
export const useChangePassword = () => {
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, current_password: string, new_password: string}) => {
          const response = await axiosPrivate.patch(`/change-admin-password`, {
            student_id: newData.student_id,
            current_password: newData.current_password,
            new_password: newData.new_password,
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Password Changed :)',
              duration: 2,
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

//QUERY FOR RESETTING ADMIN PASSWORD (SEND OTP)
export const useAdminResetSendOTP = () => {
  const axiosPrivate = useAxiosPrivate()  
  return useMutation({
      mutationFn: async (newMobileNumber: {mobile_number: string}) =>{
          const response = await axiosPrivate.get('/forgot-password-send', {params: newMobileNumber})
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'OTP has been Sent :)',
              duration: 3,
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
//QUERY FOR RESETTING ADMIN PASSWORD (CONFIRM OTP)
export const useAdminResetConfirmOTP = () => {
  const axiosPrivate = useAxiosPrivate()  
  return useMutation({
      mutationFn: async (newMobileNumber: {mobile_number: string, otp_code: string}) =>{
          const response = await axiosPrivate.post('/otp/verify', newMobileNumber)
          return response.data
      },
      onSuccess: async (data) => {
          if(data?.check_status?.status === 'approved'){
            message.open({
                key: 'successCreation',
                type: 'success',
                content: 'OTP Verified :)',
                duration: 3,
            })
          }else{
            message.open({
              type: 'error',
              content: `Incorrect OTP code`,
              className: 'custom-class pop-medium',
              duration: 2.5,
            });
          }
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
//QUERY FOR RESETTING ACTUAL ADMIN PASSWORD
export const useAdminResetPassword = () => {
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {mobile_number:string, new_password: string}) => {
          const response = await axiosPrivate.patch(`/admin/forgot-password`, {
            mobile_number: newData.mobile_number,
            new_password: newData.new_password
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Password Changed Successfully :)',
              duration: 2,
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


//QUERY FOR DELETING ADMIN ACCOUNT
export const useDeleteAdminAccount = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  return useMutation({
      mutationFn:async (id:string) => {
          const response = await axiosPrivate.delete(`/admin/delete-account/${id}`)
          return response.data
      },
      onSuccess: async () => {
        message.open({
            key: 'successCreation',
            type: 'success',
            content: 'Account Deleted !',
            duration: 2,
        })
        navigate("/login", {replace: true})
        
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


//QUERY FOR ACTIVATING SINGLE ELECTION
export const useActivateElection = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (id:string) => {
          const response = await axiosPrivate.patch(`/election/status/to-ongoing/${id}`)
          return response.data
      },
      onSuccess: async () => {
        message.open({
            key: 'successCreation',
            type: 'success',
            content: 'Activated!',
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

//QUERY FOR GETTING SINGLE VOTER
export const useVoter = (student_id:string) =>{
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
      queryKey: ['voter'], 
      queryFn: async () => {
        try {
          const response = await axiosPrivate.get(`/get-voter/${student_id}`)
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