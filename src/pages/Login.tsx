import { useState } from "react";
import tcu from "../images/bg.png";
import { loginadmin } from "../api/auth"
import { useAuthStore } from "../hooks/state";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEyeSlash,FaEye } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import { z, ZodType } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { message } from "antd";

type LoginFormData = {
  student_id: string;
  password: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const schema: ZodType<LoginFormData> = z.object({
    student_id: z.string().regex(/^\d{7}$/, {message: "Student ID must be a valid Student ID"}).min(7).max(7),
    password: z.string().min(14, {message: "Password must contain at least 14 character(s)"}).max(30),

  })

  const {register, handleSubmit, formState:{errors}} = useForm<LoginFormData>({resolver: zodResolver(schema)})

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
        const respo = await loginadmin(data.student_id, data.password)
        setIsLoading(false)

        if(respo.data.message === 'success') {
          useAuthStore.setState({tempPin: respo.data.pin})
          useAuthStore.setState({student_id: data.student_id})
          useAuthStore.setState({tempPassword: data.password})
          navigate('/enter-pin')
          message.success("Please Enter Your PIN code :)", 2.5)
        }else{
          console.log(respo.data);
          
        }

    } catch (error: any) {
        setIsLoading(false)
        //console.log(error.response);
        
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
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="md:flex md:items-center md:justify-center md:min-h-screen md:p-10 font-medium text-lg">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className=" bg-[#E5E0FF] dark:bg-[#2b2b2b] dark:text-gray-200 md:rounded-3xl overflow-hidden text-[#3C486B] pb-5 md:shadow-2xl md:max-w-md"
      >
        <img className="" src={tcu} height={400} alt="Taguig City University" />
        <div className="inputs-container -translate-y-10 md:translate-y-0 bg-[#E5E0FF] dark:bg-[#2b2b2b] rounded-[50px] md:rounded-t-0">
          <div className=" flex flex-col p-5">
            <h2 className="text-3xl py-6 md:py-3 text-center font-sans pop-bold text-[#4C7CE5] dark:text-white tracking-widest">Login</h2>
            <label className="pop-regular opacity-80 text-sm">Student ID</label>
            <input
              className="bg-[#E5E0FF] px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] dark:text-white tracking-wider focus:bg-transparent"
              type="text"
              {...register("student_id")}
              placeholder="ex. 1234567"
              maxLength={7}
              minLength={7}
              required
            />
            {errors.student_id && <span className="text-red-400 text-center text-sm">{errors.student_id.message}</span>}
          </div>

          <div className="flex flex-col px-5">
            <label className="pop-regular opacity-80 text-sm">Password</label>
            <div className="flex rounded-lg relative bg-[#E5E0FF] w-full border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a]">
              <input
                className="w-5/6 sm:w-full pl-4 py-3 text-black text-md pop-medium outline-none  dark:text-white tracking-wider bg-transparent"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                required
              />
              <button
                className="flex absolute sm:static z-20 top-4 right-0 justify-center items-center text-sm font-bold w-14"
                type="button"
                onClick={handlePasswordToggle}
              >
                {showPassword ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
              </button>
            </div>
            {errors.password && <span className="text-red-400 md:py-2 text-center text-sm">{errors.password.message}</span>}
          </div>
        </div>
        <div className="flex items-center flex-col px-5">
          {isLoading ? <button
            className="text-center text-white px-4 py-3 rounded-lg md:mt-5 w-[100%] bg-[#4C7CE5] dark:bg-[#4C7CE5] shadow-md break-words shadow-blue-300 dark:shadow-blue-400"
            type="submit"
            disabled={isLoading ? true : false}
          >
            Loading...
          </button>
          :
          (<button
            className="text-center text-white px-4 py-3 rounded-lg md:mt-5 w-[100%] bg-[#4C7CE5] dark:bg-[#4C7CE5] shadow-md break-words shadow-blue-300 dark:shadow-blue-400"
            type="submit"
            disabled={isLoading ? true : false}
          >
            Login
          </button>)}

          <ul className="forgot-register-container flex justify-between w-full dark:text-gray-400">
              <NavLink to='/forgot-password'>
                <p className="pop-semibold text-sm py-4 underline">Forgot Password</p>
              </NavLink>
              <NavLink to='/register'>
                <p className="pop-semibold text-sm py-4 underline">Register</p>
              </NavLink>
          </ul>
        </div>
      </form>
    </div>
  );
}
