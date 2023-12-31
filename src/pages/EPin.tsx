import { useEffect, useRef, useState } from 'react';
import OtpInput from 'react-otp-input';
import {ReactComponent as Passcode} from '../assets/passcode.svg'
import { useAuthStore } from '../hooks/state';
import { useNavigate } from 'react-router-dom';
import { message, Popover} from 'antd';
import {TbInfoSquareRoundedFilled} from 'react-icons/tb'
import { forgotPinSendOTP, loginFinaly } from '../api/auth';


export default function EPin() {
  const [pin_code, setPin_code] = useState('');
  const {tempPassword,student_id, setToken,tempPin} = useAuthStore((state) => state)
  const navigate = useNavigate()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [open, setOpen] = useState(false);
  const targetRef = useRef(null)

  const [tries, setTries] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [mistakes, setMistakes] = useState(1);
  const [life, setLife] = useState(3)


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


  const handleLogIn = async () => {
    setIsLoggingIn(true)
    if(pin_code.length < 4){
      message.open({
        type: 'warning',
        content: 'PIN code must be 4 digits',
        className: 'custom-class pop-medium',
      });
      setIsLoggingIn(false)
    }else{
        if(tempPin === pin_code){

            const res = await loginFinaly(student_id,tempPassword )
            setToken(res.data)
            
            setIsLoggingIn(false)
            if (res.data.role === 'admin') {
                message.success('Welcome Admin :)')
                useAuthStore.setState({tempPassword: ''})
                localStorage.setItem('student_id', JSON.stringify(res.data.student_id))
                navigate('/admin/dashboard', {replace: true})
            }else if (res.data.role === 'user') {
                message.success('Welcome Student :)')
                useAuthStore.setState({tempPassword: ''})
                localStorage.setItem('student_id', JSON.stringify(res.data.student_id))
                navigate('/voter/dashboard', {replace: true})
            }
            else {
                console.log("No role specified");
            }
        }else{
            setIsLoggingIn(false)
            
            setTries(tries + 1);
            setLife(life - 1)
            if (tries === 3) {
                setMistakes(mistakes + 1)
                if(mistakes > 0){
                console.log("here", mistakes);
                
                setTries(1) //this should be global state in zustand
                setTimeRemaining(60 * mistakes); // increment 1 minute every 3 wrong tries
                setLife(3)
                }else{
                
                setTries(1) //this should be global state in zustand
                setTimeRemaining(60); // Lock for 1 minute (60 seconds)
                setLife(3)
                }
            }else{
                message.open({
                    type: 'error',
                    content: 'Incorrect PIN code',
                    className: 'custom-class pop-medium',
                    duration: 2.5,
                })
            }

        }
    }
  }


  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const [isProcessing, setIsProcessing] = useState(false)

  async function handleChangePin(e:any){
    e.preventDefault()
    try {
      setIsProcessing(true)
      const res = await forgotPinSendOTP(student_id)

      if(res.data.message === 'success') {
        setIsProcessing(false)
        message.success("Please check your Email for OTP code :)", 2.5)
        navigate('/forgot-pin-verify', {replace: true})
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
            if(error.response.data.error === 'No Student with that Email'){
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
    <div className='w-full'>
      <div className="head flex flex-col items-center">
        <Passcode className='w-36 md:w-40 drop-shadow-lg' />
      </div>
      
      <div className="otp-wrapper w-full flex flex-col items-center sm:px-10">
        <div className="otp w-full px-5 sm:w-3/6">
          <h2 className='text-[#4C7CE5] text-sm sm:text-lg md:text-2xl pb-10 md:pb-20 text-center pop-bold'>Enter Your PIN code</h2>
          <div className="subheading-input flex justify-between items-center">
            <h3 className='text-[#3F3D56] dark:text-gray-400 pop-light text-xs sm:text-sm py-3'>Chances: {life}</h3>
            
            <Popover
              content={<div>
                <p>3 PIN code attempts trigger a 1-minute waiting increment.</p>
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
          <div className="otp-codes centered w-full py-3 overflow-x-auto">
            <OtpInput
              value={pin_code}
              onChange={setPin_code}
              numInputs={4}
              renderInput={(props) => 
                <input {...props}
                />}
              containerStyle={"gap-3 md:gap-5 justify-evenly flex grow"}
              inputStyle={"box-content p-3 md:p-4 rounded-lg text-xl md:text-3xl dark:text-gray-400 pop-bold bg-[#D2CEE6] dark:bg-[#232323] shadow-md"}
              inputType='tel'
            />
            <div className="forgotpin flex justify-end dark:text-gray-400 text-right ">
              {isProcessing
                ? <button disabled={isProcessing} className='font-semibold underline text-xs sm:text-base p-1 sm:py-2 my-1 rounded-lg cursor-pointer'>Sending OTP...</button>
                : <button onClick={handleChangePin} className='font-semibold underline text-xs sm:text-base p-1 sm:py-2 my-1 rounded-lg cursor-pointer'>Forgot Pin</button>
              }
            </div>
          </div>

          {timeRemaining > 0 && (
          <div className='text-xs sm:text-sm text-center text-red-400 pt-5'>
              Please wait {formatTime(timeRemaining)} before trying again.
          </div>
          )}

          <div className="login-wrapper flex justify-center">
            {!isLoggingIn
              ? <button disabled={timeRemaining > 0 || isLoggingIn} onClick={handleLogIn} className={`${timeRemaining > 0 ? `cursor-not-allowed` : ``} w-full py-3 sm:px-20 mt-5 pop-bold text-white rounded-lg text-lg bg-[#4C7CE5]`}>Login</button>
              : <button disabled={timeRemaining > 0 || isLoggingIn} className={`${timeRemaining > 0 ? `cursor-not-allowed` : ``} w-full py-3 sm:px-20 mt-5 pop-bold text-white rounded-lg text-lg bg-[#4C7CE5]`}>Logging in...</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
