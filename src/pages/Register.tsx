import { useState } from "react";
import tcu from "../images/bg.png";
import { checkStudentID, confirmNumberSendOTP } from "../api/auth"
import { useAuthStore } from "../hooks/state";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash,FaEye } from 'react-icons/fa';
import { message } from 'antd'
import { z, ZodType } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

type RegisterFormData = {
  student_id: string;
  password: string;
  confirmPassword: string;
  mobile_number: string;
}

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showSamePassword, setShowSamePassword] = useState(false);
  const navigate = useNavigate();


  const schema: ZodType<RegisterFormData> = z.object({
    student_id: z.string().regex(/^\d{7}$/, {message: "Student ID must be a valid Student ID"}).min(7).max(7),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*])/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character",
    }).min(14, {message: "Password must contain at least 14 character(s)"}).max(30),
    confirmPassword: z.string(),
    mobile_number: z.string().regex(/^09\d{9}$/, {message: "Mobile number must be a valid PH Mobile Number",
    }).min(11).max(11)

  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
  })

  const {register, handleSubmit, formState:{errors}} = useForm<RegisterFormData>({resolver: zodResolver(schema)})


  const handleRegister = async (data: RegisterFormData) => {
    setError(null)
    setIsLoading(true)
    try {
      const resId = await checkStudentID(data.student_id) 
        .then(() => {
            message.open({
                type: 'loading',
                content: 'Checking Student ID...',
                duration: 2.5,
              }).then(() => message.success("Eligible to Register :)", 2.5))
        })
      
      const philFormat = data.mobile_number.slice(1)

      const resNum = await confirmNumberSendOTP(`+63${philFormat}`)
        .then(() => {
        message.open({
            type: 'loading',
            content: 'Checking Mobile Number...',
            duration: 2.5,
          }).then(() => message.success("Happy Registrations :)", 2.5))
        })

      useAuthStore.setState({ tempMobileNumber: `+63${philFormat}` })
      useAuthStore.setState({ tempPassword: data.password })
      useAuthStore.setState({ student_id: data.student_id })

      //console.log(resId.data)
      //console.log(resNum.data)
      setIsLoading(false)
      navigate('/mobile-verification', {replace: true})

    } catch (err: any) {
        //console.log(err)
        if(err.message === "Network Error"){
          setIsLoading(false)
          setError(err.message)
        }else{
          setIsLoading(false)
          //console.log(err.response.data);
          const philFormat = data.mobile_number.slice(1)
          if(err?.response.data.error === `Invalid parameter \`To\`: +63${philFormat}`){
            setError("Invalid phone number. Please provide a valid Philippine phone number.")
          }else{
            setError(err.response.data.error);
          }
          
        }  
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordToggleSame = () => {
    setShowSamePassword(!showSamePassword);
  };

  return (
    <div className="md:flex md:items-center md:justify-center md:min-h-screen md:p-10 font-medium text-lg">
      <form
        onSubmit={handleSubmit(handleRegister)}
        className=" bg-[#E5E0FF] dark:bg-[#2b2b2b] dark:text-gray-200 md:rounded-3xl overflow-hidden text-[#3C486B] pb-5 md:shadow-2xl md:max-w-md"
      >
        <img className="" src={tcu} height={400} alt="Taguig City University" />
        <div className="inputs-container -translate-y-10 md:translate-y-0 bg-[#E5E0FF] dark:bg-[#2b2b2b] rounded-[50px] md:rounded-t-0">
          <div className=" flex flex-col px-5 pt-5">
            <h2 className="text-3xl py-6 md:py-3 text-center font-sans pop-bold text-[#4C7CE5] dark:text-white tracking-widest">Register</h2>
            {/* STUDENT ID */}
            <label className="pop-regular opacity-80 text-sm">Student ID (required)</label>
            <input
              className="bg-[#E5E0FF] px-4 py-3 mb-2 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] dark:text-white tracking-wider"
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
            {/* PASSWORD */}
            <label className="pop-regular opacity-80 text-sm">Password (required)</label>
            <div className="flex rounded-lg bg-[#E5E0FF] w-full border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a]">
              <input
                className="grow pl-4 py-3 text-black text-md pop-medium outline-none  dark:text-white tracking-wider bg-transparent"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                required
              />
              <button
                className="flex justify-center items-center text-sm font-bold w-14"
                type="button"
                onClick={handlePasswordToggle}
              >
                {showPassword ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
              </button>
            </div>
            {errors.password && <span className="text-red-400 text-center text-sm w-[100%]">{errors.password.message}</span>}
            {/* CONFIRM PASSWORD */}
            <label className="pop-regular opacity-80 text-sm">Confirm Password (required)</label>
            <div className="flex rounded-lg bg-[#E5E0FF] w-full border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a]">
              <input
                className="grow pl-4 py-3 text-black text-md pop-medium outline-none  dark:text-white tracking-wider bg-transparent"
                type={showSamePassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="••••••••"
                required
              />
              <button
                className="flex justify-center items-center text-sm font-bold w-14"
                type="button"
                onClick={handlePasswordToggleSame}
              >
                {showSamePassword ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-red-400 text-center text-sm">{errors.confirmPassword.message}</span>}
            {/* MOBILE NUMBER */}
            <label className="pop-regular opacity-80 text-sm">Mobile Number (required)</label>
            <input
              className="bg-[#E5E0FF] px-4 py-3 mb-2 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] dark:text-white tracking-wider"
              type="text"
              {...register("mobile_number")}
              placeholder="ex. 09123456789"
              maxLength={11}
              minLength={11}
              required
            />
            {errors.mobile_number && <span className="text-red-400 text-center text-sm">{errors.mobile_number.message}</span>}
          </div>
        </div>
        <div className="flex items-center flex-col px-5">
          {error ? (
            <div className="text-red-400 text-center text-sm px-5 py-2 break-words">
              {error}
            </div>
          ) : (
            ""
          )}
          {isLoading ? (<button
            className="text-center text-white mt-2 px-4 py-3 rounded-lg w-[100%] bg-[#4C7CE5] dark:bg-[#4C7CE5] shadow-md break-words shadow-blue-300 dark:shadow-blue-400"
            type="submit"
          >
            Loading...
          </button>)
          :
          (<button
            className="text-center text-white mt-2 px-4 py-3 rounded-lg w-[100%] bg-[#4C7CE5] dark:bg-[#4C7CE5] shadow-md break-words shadow-blue-300 dark:shadow-blue-400"
            type="submit"
          >
            Register
          </button>)}

          <ul className="forgot-register-container flex justify-end w-full dark:text-gray-400">
              <Link to='/login'>
                <p className="pop-regular hover:text-blue-300 text-sm py-4 underline">Login</p>
              </Link>
          </ul>
        </div>
      </form>
    </div>
  );
}