import { useState } from 'react';
import OtpInput from 'react-otp-input';
import otpImage from '../images/otp.png'

export default function MVerification() {
  const [otp, setOtp] = useState('');
  return (
    <div>
      <div className="head flex flex-col items-center pt-20">
        <img className='w-36 md:w-40' src={otpImage} alt="OTP Image illustration" />
        
      </div>
      
      <div className="otp-wrapper flex flex-col items-center px-10">
        <div className="otp">
          <h2 className='text-[#4C7CE5] text-lg md:text-2xl pb-10 md:pb-20 text-center pop-bold'>Have you recieved a verification code?</h2>
          <h3 className='text-[#3F3D56] dark:text-gray-500 pop-light text-sm py-2'>Enter 6 digits code</h3>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => 
              <input {...props}
              />}
            containerStyle={"gap-3 md:gap-5 flex grow"}
            inputStyle={"box-content p-3 md:p-4 rounded-lg text-xl md:text-3xl dark:text-gray-400 pop-bold bg-[#D2CEE6] dark:bg-[#232323] shadow-md"}
            inputType='tel'
          />
          <div className="resend-wrapper text-sm flex justify-end py-5 pop-semibold  text-[#4C7CE5]">
            <button>Resend code</button>
          </div>
          <div className="verify-wrapper flex justify-center">
            <button className='py-3 px-20 mt-5 pop-bold text-white rounded-lg text-lg bg-[#4C7CE5]'>Verify</button>
          </div>
        </div>
      </div>
    </div>
  )
}
