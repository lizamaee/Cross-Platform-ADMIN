import { useState } from "react";
import tcu from "../images/bg.png";
import { checkStudentID, confirmNumberSendOTP } from "../api/auth"
import { useAuthStore } from "../hooks/state";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash,FaEye } from 'react-icons/fa';
import { message } from 'antd'


export default function Login() {
  const [id, setId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState(""); 
  const [samePassword, setSamePassword] = useState(""); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showSamePassword, setShowSamePassword] = useState(false);
  const navigate = useNavigate();



  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError(null)
    setIsLoading(true)
    try {
      const resId = await checkStudentID(id) 
        .then(() => {
            message.open({
                type: 'loading',
                content: 'Checking Student ID...',
                duration: 2.5,
              }).then(() => message.success("Eligible to Register :)", 2.5))
        })
      

      const philFormat = mobileNumber.slice(1)

      const resNum = await confirmNumberSendOTP(`+63${philFormat}`)
        .then(() => {
        message.open({
            type: 'loading',
            content: 'Checking Mobile Number...',
            duration: 2.5,
          }).then(() => message.success("Happy Registrations :)", 2.5))
        })

      useAuthStore.setState({ tempMobileNumber: mobileNumber })
      useAuthStore.setState({ tempPassword: password })
      useAuthStore.setState({ student_id: id })

      //console.log(resId.data)
      //console.log(resNum.data)
      setIsLoading(false)
      navigate('/verify-number', {replace: true})

    } catch (err: any) {
        //console.log(err)
        if(err.message === "Network Error"){
          setIsLoading(false)
          setError(err.message)
        }else{
          setIsLoading(false)
          //console.log(err.response.data);
          const philFormat = mobileNumber.slice(1)
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
        onSubmit={handleRegister}
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
              value={id}
              placeholder="ex. 1234567"
              onChange={(e) => setId(e.target.value)}
              maxLength={7}
              minLength={7}
              required
            />
          </div>

          <div className="flex flex-col px-5">
            {/* PASSWORD */}
            <label className="pop-regular opacity-80 text-sm">Password (required)</label>
            <div className="pb-2">
              <input
                className="bg-[#E5E0FF] w-full px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] dark:text-white tracking-wider"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="text-sm font-bold absolute -translate-x-10 translate-y-4"
                type="button"
                onClick={handlePasswordToggle}
              >
                {showPassword ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
              </button>
            </div>
            {/* CONFIRM PASSWORD */}
            <label className="pop-regular opacity-80 text-sm">Confirm Password (required)</label>
            <div className="pb-2">
              <input
                className="bg-[#E5E0FF] w-full px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] dark:text-white tracking-wider"
                type={showSamePassword ? "text" : "password"}
                value={samePassword}
                placeholder="••••••••"
                onChange={(e) => setSamePassword(e.target.value)}
                required
              />
              <button
                className="text-sm font-bold absolute -translate-x-10 translate-y-4"
                type="button"
                onClick={handlePasswordToggleSame}
              >
                {showSamePassword ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
              </button>
            </div>
            {/* MOBILE NUMBER */}
            <label className="pop-regular opacity-80 text-sm">Mobile Number (required)</label>
            <input
              className="bg-[#E5E0FF] px-4 py-3 md:mb-2 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] dark:text-white tracking-wider"
              type="text"
              value={mobileNumber}
              placeholder="ex. 09123456789"
              onChange={(e) => setMobileNumber(e.target.value)}
              maxLength={11}
              minLength={11}
              required
            />
          </div>
        </div>
        <div className="flex items-center flex-col px-5">
          {error ? (
            <div className="text-red-400 text-center px-5 py-3 break-words">
              {error}
            </div>
          ) : (
            ""
          )}
          {isLoading ? (<button
            className="text-center text-white px-4 py-3 rounded-lg w-[100%] bg-[#4C7CE5] dark:bg-[#4C7CE5] shadow-md break-words shadow-blue-300 dark:shadow-blue-400"
            type="submit"
          >
            Loading...
          </button>)
          :
          (<button
            className="text-center text-white px-4 py-3 rounded-lg w-[100%] bg-[#4C7CE5] dark:bg-[#4C7CE5] shadow-md break-words shadow-blue-300 dark:shadow-blue-400"
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