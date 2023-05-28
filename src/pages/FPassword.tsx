import { useState } from 'react'
import {ReactComponent as Recoverpass} from '../assets/recoverpass.svg'
import { ZodType, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TbSquareRoundedArrowLeft } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordSendOTP } from '../api/auth';
import { message } from 'antd';
import { useAuthStore } from '../hooks/state';

type NumberFormData = {
  mobile_number: string;
}

export default function FPassword() {
  const [isProcessing, setIsProcessing] = useState(false)

  const navigate = useNavigate()

  const schema: ZodType<NumberFormData> = z.object({
    mobile_number: z.string().regex(/^09\d{9}$/, {message: "Mobile number must be a valid PH Mobile Number",
    }).min(11).max(11)

  })

  const {register, handleSubmit, formState:{errors}} = useForm<NumberFormData>({resolver: zodResolver(schema)})

  const handleNext = async (data: NumberFormData) => {
    try {
      setIsProcessing(true)
      const philFormat = data.mobile_number.slice(1)
      const validNumber = `+63${philFormat}`
      
      const res = await forgotPasswordSendOTP(validNumber) 
      //console.log(res.data);

      if(res.data.message === 'success') {
        setIsProcessing(false)
        message.success("Please confirm the OTP for verification :)", 2.5)
        useAuthStore.setState({ tempMobileNumber: data.mobile_number })
        navigate('/forgot-password-verify', {replace: true})
      }else{
        setIsProcessing(false)
        message.success(`${res.data.message}`, 2.5)
      }
    } catch (error: any) {
        //console.log(err)
        setIsProcessing(false)
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
    <div className='flex flex-col items-center pt-10 px-10'>
      <Link to="/login" className='absolute top-8 left-8 md:top-10 md:left-16'>
        <TbSquareRoundedArrowLeft className='opacity-80 h-9 w-9 md:h-12 md:w-12 text-[#4C7CE5]'/>
      </Link>
      <div className="label-for-number flex items-center flex-col md:w-[70%] py-5">
        <Recoverpass className='h-40 drop-shadow-xl'/>
      </div>
      <form className='flex flex-col md:px-36 md:w-[80%] lg:w-[60%] px-5' >
        <h2 className='text-[#4C7CE5] text-lg md:text-xl pb-10 md:pb-18 text-center pop-bold'>Provide the details below to begin the process</h2>
        <label className="pop-regular text-gray-400 py-3">Mobile Number</label>
        <input
          className="bg-[#E5E0FF] px-4 py-3 mb-2 rounded-lg text-black dark:text-gray-300 text-md md:text-lg pop-medium outline-none  border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] tracking-wider"
          type="text"
          {...register("mobile_number")}
          placeholder="ex. 09123456789"
          maxLength={11}
          minLength={11}
          required
        />
        {errors.mobile_number && <span className="text-red-400 text-center text-sm">{errors.mobile_number.message}</span>}
        <div className="verify-wrapper flex w-full justify-center">
            {!isProcessing ? (
              <button onClick={handleSubmit(handleNext)}
                type="submit"
                disabled={isProcessing}
                className="py-3 flex-1 px-20 mt-10 pop-bold text-white rounded-lg text-lg bg-[#4C7CE5]"
              >
                Next
              </button>
            ) : (
              <button
                disabled={isProcessing}
                className="py-3 flex-1 px-20 mt-10 pop-bold text-white rounded-lg text-lg bg-[#4C7CE5]"
              >
                Loading...
              </button>
            )}
          </div>
      </form>
    </div>

  )
}
