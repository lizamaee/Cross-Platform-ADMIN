import { useEffect, useState } from "react";
import tcu from "../images/bg.png";
import { loginadmin } from "../api/auth"
import { useAuthStore } from "../state";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash,FaEye } from 'react-icons/fa';


export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if(token){
      const parsedToken = JSON.parse(token)
      
      if (parsedToken.role === "admin") {
        navigate('/admin/dashboard');
      }else {
        navigate('/');
      }
    }else{
      console.log("No token found");
      
    }
  }, []);
  



  const handleLogin = async (e: any) => {
    e.preventDefault();
    //console.log(username, password);
    setIsLoading(true)

    try {
      const res = await loginadmin(id, password)
      setIsLoading(false)
      loginAdmin(res.data)
      console.log(res.data);
      //navigate to dashboard
      if(res.data.role === 'admin'){
        navigate("/admin/dashboard", {replace: true})
      }else{
        navigate("/", {replace: true})
      }
      console.log("Login Successfully");
      
    } catch (err: any) {
      console.log(err.message)

      if(err.message === "Network Error"){
        setIsLoading(false)
        setError(err.message)
      }else{
        setIsLoading(false)
        console.log(err.response);
        
        setError(err.response.data.message);
      }  
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-10 font-medium text-lg">
      <form
        onSubmit={handleLogin}
        className=" bg-[#F0F0F0] dark:bg-[#333333] dark:text-gray-200 rounded-3xl overflow-hidden text-[#3C486B] pb-5 shadow-2xl md:max-w-md"
      >
        <img className="" src={tcu} height={400} alt="Taguig City University" />
        <div className="flex flex-col p-5">
          <h2 className="text-2xl text-center font-sans pop-bold dark:text-white tracking-widest">LOGIN</h2>
          <label className="pop-regular opacity-80 text-sm">Student ID</label>
          <input
            className="px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] dark:text-white tracking-wider"
            type="text"
            value={id}
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
              className="w-full px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a] dark:text-white tracking-wider"
              type={showPassword ? "text" : "password"}
              value={password}
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
        <div className="flex items-center flex-col">
          {error ? (
            <div className="text-red-400 text-center px-5 py-3 break-words">
              {error}
            </div>
          ) : (
            ""
          )}
          {isLoading ? (<button
            className="text-center text-white px-4 py-2 rounded-lg w-[30%] bg-[#F45050] dark:bg-red-600 shadow-md break-words shadow-red-300 dark:shadow-red-700"
            type="submit"
          >
            Loading...
          </button>)
          :
          (<button
            className="text-center text-white px-4 py-2 rounded-lg w-[40%] bg-[#F45050] dark:bg-red-600 shadow-md break-words shadow-red-300 dark:shadow-red-700"
            type="submit"
          >
            Login
          </button>)}
        </div>
      </form>
    </div>
  );
}