import { useEffect, useRef, useState } from 'react'
import {ReactComponent as Recoverpass} from '../assets/recoverpass.svg'
import { ZodType, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TbInfoSquareRoundedFilled, TbSquareRoundedArrowLeft } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordSendOTP } from '../api/auth';
import { Popover, message } from 'antd';
import { useAuthStore } from '../hooks/state';

type NumberFormData = {
  mobile_number: string;
}

export default function FPassword() {
  const [isProcessing, setIsProcessing] = useState(false)
  const targetRef = useRef(null)
  const [openAtNumber, setOpenAtNumber] = useState(false);
  const handleOpenChangeAtNumber = (newOpen: boolean) => {
    setOpenAtNumber(newOpen);
  };

  const navigate = useNavigate()

  const [tries, setTries] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [mistakes, setMistakes] = useState(1);
  const [life, setLife] = useState(5)


  let interval: number;
  useEffect(() => {
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timeRemaining, tries]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

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
            if(error.response.data.error === 'No Student with that Number'){
              setTries(tries + 1);
              setLife(life - 1)
              if (tries === 5) {
                  setMistakes(mistakes + 1)
                  if(mistakes > 0){
                  console.log("here", mistakes);
                  
                  setTries(1) //this should be global state in zustand
                  setTimeRemaining(60 * 5); 
                  setLife(5)
                  }else{
                  setTries(1) //this should be global state in zustand
                  setTimeRemaining(0);
                  setLife(5)
                  }
              }else{
                message.open({
                  type: 'error',
                  content: `${error.response.data.error}`,
                  className: 'custom-class pop-medium',
                  duration: 2.5,
                });
              }
            }
        }else if(error.response.data){
          message.open({
            type: 'error',
            content: `${error.response.data}`,
            className: 'custom-class pop-medium',
            duration: 2.5,
          })

        }else {
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
    <div className='flex w-full flex-col items-center pt-14 sm:px-10'>
      <Link to="/login" className='absolute top-8 left-8 md:top-10 md:left-16'>
        <TbSquareRoundedArrowLeft className='opacity-80 h-9 w-9 md:h-12 md:w-12 text-[#4C7CE5]'/>
      </Link>
      <div className="label-for-number flex items-center flex-col md:w-[70%] pt-10">
        <Recoverpass className='h-32 sm:h-40 drop-shadow-xl'/>
      </div>
      <form className='flex flex-col md:px-36 md:w-[80%] lg:w-[60%] px-5' >
        <h2 className='text-[#4C7CE5] text-sm sm:text-lg md:text-xl pb-10 md:pb-18 text-center pop-bold'>Provide the details below to begin the process</h2>
        <div className="label-for-change-number items-center flex py-1">
                  <label className="pop-medium text-gray-600 flex-1 opacity-80 text-xs md:text-md">Mobile Number</label>
                  <Popover
                    content={<div>
                      <p>A 5-Minute Pause after 5 requests</p>
                      </div>}
                    title="Optimizing Security Measures"
                    open={openAtNumber}
                    onOpenChange={handleOpenChangeAtNumber}
                  >
                    <span ref={targetRef}>
                      <TbInfoSquareRoundedFilled size={22} className='text-[#4C7CE5] p1'/>
                    </span>
                  </Popover>
                </div>
        
        <div className="input flex">
          <input
            className="bg-[#E5E0FF] text-sm sm:text-md w-full  px-4 py-3 mb-2 rounded-lg text-black dark:text-gray-300 text-md md:text-lg pop-medium outline-none border-2  border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] tracking-wider"
            type="text"
            {...register("mobile_number")}
            placeholder="ex. 09123456789"
            maxLength={11}
            minLength={11}
            required
          />
        </div>
        {errors.mobile_number && <span className="text-red-400 text-center text-sm">{errors.mobile_number.message}</span>}
        {timeRemaining > 0 && (
            <div className='text-sm text-center text-red-500 pt-5'>
                Please wait {formatTime(timeRemaining)} before trying again.
            </div>
            )}
        <div className="verify-wrapper flex w-full justify-center">
            {!isProcessing ? (
              <button onClick={handleSubmit(handleNext)}
                type="submit"
                disabled={isProcessing || timeRemaining > 0}
                className="py-3 flex-1 overflow-hidden sm:px-20 mt-10 pop-bold text-white rounded-lg text-lg bg-[#4C7CE5]"
              >
                Next
              </button>
            ) : (
              <button
                disabled={isProcessing || timeRemaining > 0}
                className="py-3 flex-1 overflow-hidden sm:px-20 mt-10 pop-bold text-white rounded-lg text-lg bg-[#4C7CE5]"
              >
                Loading...
              </button>
            )}
          </div>
      </form>
    </div>

  )
}
