import { useEffect, useRef, useState } from 'react';
import OtpInput from 'react-otp-input';
import otpImage from '../images/otp.png'
import { confirmNumberVerifyOTP, forgotPasswordSendOTP } from '../api/auth';
import { useAuthStore } from '../hooks/state';
import { useNavigate } from 'react-router-dom';
import { message, Popover, Modal, Button  } from 'antd';
import {TbInfoSquareRoundedFilled} from 'react-icons/tb'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

type EmailFormData = {
  email: string;
}

export default function FVerification() {
  const [otp, setOtp] = useState('');
  const {tempMobileNumber} = useAuthStore((state) => state)
  const navigate = useNavigate()
  const [isResending, setIsResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(60);
  const [isCoundownDone, setIsCountdownDone] = useState(true)
  const [open, setOpen] = useState(false);
  const [openAtNumber, setOpenAtNumber] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false)
  const targetRef = useRef(null)


  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }else{
      setIsCountdownDone(true)
    }
  }, [countdown]);


  const handlerVerify = async () => {
    setIsVerifying(true)
    if(otp.length < 6){
      message.open({
        type: 'warning',
        content: 'OTP must be 6 digits',
        className: 'custom-class pop-medium',
      });
      setIsVerifying(false)
    }else{
      try {
        const res = await confirmNumberVerifyOTP(tempMobileNumber, otp)

        if(res.data?.message === "success"){
          setIsVerifying(false)
          message.success('OTP Confirmed!')
          navigate('/reset-password', {replace: true})
        }else{
          setIsVerifying(false)
          message.open({
            type: 'error',
            content: 'OTP Invalid!',
            className: 'custom-class pop-medium',
            duration: 2.5,
          });
        }
        
      } catch (error:any) {

        setIsVerifying(false)
        //Handle error
        if (error.message === 'Network Error') {
          message.open({
            type: 'error',
            content: 'Server Unavailable',
            className: 'custom-class pop-medium',
            duration: 2.5,
          });
        }else if(error.response.data.error){
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
  }

  const handleResend = async () => {
    try {
      setIsResending(true)
      const resendotp = await forgotPasswordSendOTP(tempMobileNumber)
      if(resendotp?.data?.message === "success"){
        message.success('OTP Resent')
        setIsResending(false)
        setCountdown(60);
      }
    
    } catch (error:any) {
      setIsResending(false)
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

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const handleOpenChangeAtNumber = (newOpen: boolean) => {
    setOpenAtNumber(newOpen);
  };

  const schema: ZodType<EmailFormData> = z.object({
    email: z.string().email()
  })


  const {register, handleSubmit, formState:{errors}} = useForm<EmailFormData>({resolver: zodResolver(schema)})

  const handleChangeNumber = async (data: EmailFormData) => {
    try {
      setConfirmLoading(true);
      const res = await forgotPasswordSendOTP(data.email) 
      //console.log(res.data);

      if(res.data.message === 'success') {
        setConfirmLoading(false);
        setOpenModal(false);
        setOpenAtNumber(false)
        message.success('OTP Sent to email.')
        setCountdown(60);
        useAuthStore.setState({ tempMobileNumber: data.email })
      }else{
        setConfirmLoading(false)
        message.success(`${res.data.message}`, 2.5)
      }
      
    } catch (error:any) {
      setConfirmLoading(false)
      console.log(error);
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

  const showModal = () => {
    setOpenModal(true);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <div className='h-full w-full sm:px-3'>
      <div className="head flex flex-col items-center pt-20">
        <img className='w-36 md:w-40' src={otpImage} alt="OTP Image illustration" />
        
      </div>
      
      <div className="otp-wrapper w-full flex flex-col items-center">
        <div className="otp w-5/6 sm:w-4/6 lg:w-3/6">
          <div className="title w-full">
            <h2 className='text-[#4C7CE5] text-sm sm:text-lg md:text-2xl pb-5 text-center pop-bold'>OTP Verification</h2>
          </div>
          <div className='text-gray-900 break-words text-center text-sm sm:text-lg dark:text-gray-500 pop-semibold pb-10 md:pb-18'>
            Enter OTP sent to
            <span className='dark:text-gray-400 text-xs sm:text-sm px-3'>{`${tempMobileNumber}`}</span>
          </div>
          <div className="subheading-input flex gap-5 items-center">
            <h3 className='text-[#3F3D56] dark:text-gray-400 pop-light text-xs sm:text-sm py-3'>Enter 6 digits code</h3>
            
            <Popover
              content={<div>
                <p>A 10-Minute Pause after 5 OTP Verification Tries</p>
                </div>}
              title="Optimizing Security Measures"
              open={open}
              onOpenChange={handleOpenChange}
            >
              <span ref={targetRef}>
                <TbInfoSquareRoundedFilled size={22} className='text-[#4C7CE5]'/>
              </span>
            </Popover>
          </div>
          <div className="otp overflow-x-auto w-full py-4 centered">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => 
                <input {...props}
                />}
              containerStyle={"gap-2 flex justify-evenly grow"}
              inputStyle={"box-content p-3 sm:p-4 rounded-lg text-sm sm:text-xl md:text-3xl dark:text-gray-400 pop-bold bg-[#D2CEE6] dark:bg-[#232323] shadow-md"}
              inputType='tel'
            />
          </div>
          <div className="resend-wrapper text-xs sm:text-sm flex justify-between pop-semibold  text-[#4C7CE5]">
            <button onClick={showModal} className='opacity-80 focus:outline-none '>Change email</button>
            <Modal
              className=''
              title={<h2 className='pop-semibold text-[#4C7CE5]'>Change Email Address</h2>}
              open={openModal}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>
              ]}
            >
              <form className='flex flex-col' >
                <div className="label-for-change-number flex md:w-[70%] py-1">
                  <label className="pop-regular flex-1 opacity-80 text-xs">Email Address (required)</label>
                  <Popover
                    content={<div>
                      <p>A 10-Minute Pause after 5 consecutive changes</p>
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
                <input
                  className="bg-[#E5E0FF] px-4 md:w-[70%] py-3 mb-2 rounded-lg text-black text-md md:text-lg pop-medium outline-none  border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] tracking-wider"
                  type="text"
                  {...register("email")}
                  placeholder="ex. youremail@gmail.com"
                  required
                  />

                {errors.email && <span className="md:w-[70%] text-red-400 text-center text-xs md:text-sm">{errors.email.message}</span>}

                {!confirmLoading
                    ? <button onClick={handleSubmit(handleChangeNumber)} disabled={countdown > 0} className={`md:w-[70%] py-3 mt-5 pop-bold text-white rounded-lg text-sm sm:text-lg bg-[#4C7CE5] ${countdown > 0 ? 'cursor-not-allowed': ''}`}>Confirm</button>
                    : <button disabled={confirmLoading} className='md:w-[70%] py-3  mt-5 pop-bold text-white rounded-lg text-sm sm:text-lg bg-[#4C7CE5]'>Confirming...</button>
                }
              </form>
            </Modal>
            {!isResending 
              ? countdown > 0 
                  ? <button disabled={isCoundownDone} className={`py-5 ${countdown > 0 ? 'opacity-50' : ''}`} onClick={handleResend}>Resend code({countdown})</button>
                  : <button className='py-5' disabled={isResending} onClick={handleResend}>Resend code</button>
              : <button className='py-5' disabled={isResending}>Resending code...</button>
            }
          </div>
          <div className="verify-wrapper w-full flex justify-center">
            {!isVerifying
              ? <button onClick={handlerVerify} className='py-2 sm:py-3 sm:px-20 w-full mt-5 pop-bold text-white rounded-lg text-sm md:text-lg bg-[#4C7CE5]'>Verify</button>
              : <button className='py-2 sm:py-3 sm:px-20 w-full mt-5 pop-bold text-white rounded-lg text-sm md:text-lg bg-[#4C7CE5]'>Verifying...</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
