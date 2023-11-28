import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import useAxiosPrivate from "../useAxiosPrivate";
import { useNavigate } from "react-router-dom";


//QUERY FOR RECOVERING A VOTER ACCOUNT
export const useRecoverAccount = () => {
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    return useMutation({
        mutationFn:async (newData: {student_id: string, new_password: string, email: string, pin_code: string}) => {
            const response = await axiosPrivate.patch(`/recover-account`, {
              student_id: newData.student_id,
              new_password: newData.new_password,
              email: newData.email,
              pin_code: newData.pin_code
            } )
            return response.data
        },
        onSuccess: async (data) => {
          if(data.message === "success"){
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
//QUERY FOR UPLOADING VOTER INFORMATION
export const useUploadVoterInfo = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, firstname: string, surname: string, age: string, year_level: string}) => {
          const response = await axiosPrivate.patch(`/new-voter`, {
            student_id: newData.student_id,
            firstname: newData.firstname,
            surname: newData.surname,
            age: newData.age,
            year_level: newData.year_level,
          } )
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Information Uploaded :)',
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

//QUERY FOR GETTING ALL ONGOING ELECTIONS
export const useOngoingElections = () =>{
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
      queryKey: ['ongoings'], 
      queryFn: async () => {
        try {
          const response = await axiosPrivate.get('/election/status/ongoing')
          return response.data
        } catch (error:any) {
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
      },
  }) 
} 

//QUERY FOR GETTING ALL PARTICIPATED ELECTIONS (For History)
export const useHistory = (student_id:string) =>{
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
      queryKey: ['history'], 
      queryFn: async () => {
        try {
          const response = await axiosPrivate.get(`election/participated-election-history/${student_id}`)
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

//QUERY FOR CASTING CONNECTIONS & VOTES
export const useCastVote= () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
      mutationFn: async (castVoteData: {student_id: string, organization_id: string, vote: {}}) =>{
          const response = await axiosPrivate.post('/cast-connection', castVoteData)
          return response.data
      },
      onSuccess: async () => {
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Voted Successfully',
              duration: 2,
          });
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

//QUERY FOR UPDATING VOTER IMAGE
export const useUpdateImage = () => {
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
              content: 'Profile Picture Updated :)',
              duration: 5,
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

//QUERY FOR UPDATING STUDENT PROFILE
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {
        student_id:string, 
        firstname: string, 
        surname: string, 
        age: string, 
        year_level: string,}) => {
          const response = await axiosPrivate.patch(`/student-profile`, {
            student_id: newData.student_id,
            firstname: newData.firstname,
            surname: newData.surname,
            age: newData.age,
            year_level: newData.year_level,
          } )
          return response.data
      },
      onSuccess: async (data) => {
        if(data.message === "success"){
          message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Profile information saved',
              duration: 5,
          })
          await queryClient.invalidateQueries({
              queryKey: ['voter'],
              exact: true
          })
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


//QUERY FOR CHANGING STUDENT EMAIL (SEND OTP)
export const useVoterSendOTPEmail = () => {
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn: async (newEmail: {student_id: string, new_email: string}) =>{
          const response = await axiosPrivate.post('/change-email', newEmail)
          return response.data
      },
      onSuccess: async (data) => {
          if(data.message === "success"){
              message.open({
                  key: 'successCreation',
                  type: 'success',
                  content: 'OTP Sent',
                  duration: 5,
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

//QUERY FOR CHANGING STUDENT EMAIL (CONFIRM OTP)
export const useVoterConfirmOTP = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn: async (newMobileNumber: {student_id: string, email: string, otp_code: string}) =>{
          const response = await axiosPrivate.patch('/change-email-confirm', newMobileNumber)
          return response.data
      },
      onSuccess: async (data) => {
          if(data.message === "success"){
            message.open({
              key: 'successCreation',
              type: 'success',
              content: 'Email Successfully Changed',
              duration: 5,
            });
            await queryClient.invalidateQueries({
              queryKey: ['voter'],
              exact: true
            })
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

//QUERY FOR UPDATING STUDENT PIN
export const useChangePin = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, new_pin_number: string,}) => {
          const response = await axiosPrivate.patch(`/change-student-pin-number`, {
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
              duration: 5,
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


//QUERY FOR UPDATING STUDENT PASSWORD
export const useChangePassword = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {student_id:string, current_password: string, new_password: string}) => {
          const response = await axiosPrivate.patch(`/change-student-password`, {
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
              duration: 5,
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

//QUERY FOR RESETTING ACTUAL STUDENT PASSWORD
export const useVoterResetPassword = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {email:string, new_password: string}) => {
          const response = await axiosPrivate.patch(`/forgot-password`, {
            email: newData.email,
            new_password: newData.new_password
          } )
          return response.data
      },
      onSuccess: async (data) => {
          if(data.message === "success"){
            message.open({
                key: 'successCreation',
                type: 'success',
                content: 'Password Changed Successfully :)',
                duration: 2,
            })
            await queryClient.invalidateQueries({
              queryKey: ['voter'],
              exact: true
            })
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
            } else if(error.response.data){
              message.open({
                type: 'error',
                content: `${error.response.data}`,
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
export const useDeleteVoterAccount = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  return useMutation({
      mutationFn:async (id:string) => {
          const response = await axiosPrivate.delete(`/delete-account/${id}`)
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
          queryKey: ['voter', 'users'],
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

//QUERY FOR GETTING A SINGLE BALLOT RESULT
export const useSingleBallotResult = () => {
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (id:string) => {
          const response = await axiosPrivate.get(`/seat/get-all-positions/${id}`)
          return response.data
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