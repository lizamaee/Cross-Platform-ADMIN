import { z, ZodType } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react';
import { FaEyeSlash,FaEye } from 'react-icons/fa';
import {ReactComponent as Newpass} from '../assets/newpass.svg'
import { forgotPassword } from '../api/auth';
import { useAuthStore } from '../hooks/state';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

type ResetPasswortForm = {
    password: string;
    confirmPassword: string;
}

export default function RPassword() {
    const [isConfirming, setIsConfirming] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showSamePassword, setShowSamePassword] = useState(false);
    const {tempMobileNumber} = useAuthStore((state)=> state)
    const navigate = useNavigate()

    const schema: ZodType<ResetPasswortForm> = z.object({
    password: z.string().min(4, {message: "Password must contain at least 4 character(s)"}).max(30),
    confirmPassword: z.string(),

    }).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
    })

    const {register, handleSubmit, formState:{errors}} = useForm<ResetPasswortForm>({resolver: zodResolver(schema)})
    const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
    };
    const handlePasswordToggleSame = () => {
    setShowSamePassword(!showSamePassword);
    };

    const handleConfirm = async (data: ResetPasswortForm) => {
        try {
          setIsConfirming(true)
          
          const res = await forgotPassword(tempMobileNumber,data.password) 
          //console.log(res.data);
    
          if(res.data.message === 'success') {
            setIsConfirming(false)
            message.success("Password reset Successfully :)", 2.5)
            useAuthStore.setState({ tempMobileNumber: ''})
            navigate('/login', {replace: true})
          }
        } catch (error: any) {
            //console.log(err)
            setIsConfirming(false)
            if (error.message === 'Network Error') {
              message.open({
                type: 'error',
                content: 'Server Unavailable',
                className: 'custom-class pop-medium',
                duration: 2.5,
              });
            } else if(error.response.data.error){
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

    }



  return (
    <div className="flex justify-center">
      <div className=" flex flex-col sm:px-5 w-5/6 md:w-[40%] pt-16">
        <div className="new-pass-wrapper flex justify-center">
            <Newpass className='w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 drop-shadow-lg'/>
        </div>
        <h2 className="text-[#4C7CE5] sm:text-lg md:text-2xl  text-center pop-bold">
          Change your password
        </h2>
        <div className='text-gray-900 text-center opacity-90 dark:text-gray-500 pop-medium pt-3 pb-10 md:pb-18 text-sm sm:text-md'>
            Enter a new password below to change your password
           
          </div>
        <form onSubmit={handleSubmit(handleConfirm)} className="flex flex-col">
          {/* PASSWORD */}
          <label className="pop-regular opacity-80 text-sm text-gray-800 pb-1 pt-3 dark:text-gray-400">New password:</label>
          <div className="flex rounded-lg relative bg-[#E5E0FF] w-full border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a]">
            <input
              className="w-5/6 sm:w-full pl-4 py-3 text-black text-md pop-medium outline-none  dark:text-white tracking-wider bg-transparent"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              required
            />
            <button
              className="flex text-gray-800 dark:text-gray-400 absolute sm:static z-20 top-3 right-0 justify-center items-center text-sm font-bold w-14"
              type="button"
              onClick={handlePasswordToggle}
            >
              {showPassword ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
            </button>
          </div>
            
          {errors.password && <span className="text-red-400 text-center text-xs sm:text-sm w-[100%]">{errors.password.message}</span>}
          {/* CONFIRM PASSWORD */}
          <label className="pop-regular opacity-80 text-sm text-gray-800 pb-1 pt-3 dark:text-gray-400">Confirm password:</label>
          <div className="sm:flex rounded-lg relative bg-[#E5E0FF] w-full border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a]">
            <input
              className="w-5/6 sm:w-full pl-4 py-3 text-black text-md pop-medium outline-none  dark:text-white tracking-wider bg-transparent"
              type={showSamePassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="••••••••"
              required
            />
            <button
              className="flex text-gray-800 dark:text-gray-400 absolute sm:static z-20 top-3 right-0 justify-center items-center text-sm font-bold w-14"
              type="button"
              onClick={handlePasswordToggleSame}
            >
              {showSamePassword ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
            </button>
          </div>
          {errors.confirmPassword && <span className="text-red-400 text-center text-xs sm:text-sm">{errors.confirmPassword.message}</span>}
          <div className="reset-password-wrapper w-full flex justify-center">
            {!isConfirming ? (
              <button
                type="submit"
                disabled={isConfirming}
                className="py-3 mt-5 pop-bold w-full text-center text-white rounded-lg sm:text-lg bg-[#4C7CE5]"
              >
                Confirm
              </button>
            ) : (
              <button
                disabled={isConfirming}
                className="py-3 mt-5 pop-bold w-full text-center text-white rounded-lg sm:text-lg bg-[#4C7CE5]"
              >
                Confirming...
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
