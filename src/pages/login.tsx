import { useState } from "react";
import tcu from "../images/bg.png";
import { loginadmin } from "../api/auth"
import { useAuthStore } from "../hooks/state";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEyeSlash,FaEye } from 'react-icons/fa';
import { NavLink } from "react-router-dom";


export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const { setToken,setStudentID } = useAuthStore((state) => state);
  const navigate = useNavigate();
  const location = useLocation()
  const from = location.state?.from?.pathname || ""



  const handleLogin = async (e: any) => {
    e.preventDefault();
    //console.log(username, password);
    setStudentID(id)
    setIsLoading(true)
    try {
      const res = await loginadmin(id, password)
      setIsLoading(false)
      setToken(res.data)
      //console.log(res.data.role);
      //navigate to dashboard
      if (res.data.role === 'admin') {
        navigate(from, {replace: true});
      }else if (res.data.role === 'user') {
        navigate('/dashboard');
      }
      else {
        console.log("Here Login function");
      }
      console.log("Login Successfully"); 
    } catch (err: any) {
        //console.log(err)
        if(err.message === "Network Error"){
          setIsLoading(false)
          setError(err.message)
        }else{
          setIsLoading(false)
          //console.log(err.response);
          setError(err.response.data.message);
        }  
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="md:flex md:items-center md:justify-center md:min-h-screen md:p-10 font-medium text-lg">
      <form
        onSubmit={handleLogin}
        className=" bg-[#E5E0FF] dark:bg-[#2b2b2b] dark:text-gray-200 md:rounded-3xl overflow-hidden text-[#3C486B] pb-5 md:shadow-2xl md:max-w-md"
      >
        <img className="" src={tcu} height={400} alt="Taguig City University" />
        <div className="inputs-container -translate-y-10 md:translate-y-0 bg-[#E5E0FF] dark:bg-[#2b2b2b] rounded-[50px] md:rounded-t-0">
          <div className=" flex flex-col p-5">
            <h2 className="text-3xl py-6 md:py-3 text-center font-sans pop-bold text-[#4C7CE5] dark:text-white tracking-widest">Login</h2>
            <label className="pop-regular opacity-80 text-sm">Student ID</label>
            <input
              className="bg-[#E5E0FF] px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] dark:text-white tracking-wider"
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
            <label className="pop-regular opacity-80 text-sm">Password</label>
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
            Login
          </button>)}

          <ul className="forgot-register-container flex justify-between w-full dark:text-gray-400">
              <NavLink to='/forgot-password'>
                <p className="pop-regular text-sm py-4 underline">Forgot Password</p>
              </NavLink>
              <NavLink to='/register'>
                <p className="pop-regular text-sm py-4 underline">Register</p>
              </NavLink>
          </ul>
        </div>
      </form>
    </div>
  );
}