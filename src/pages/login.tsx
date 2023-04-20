import { useEffect, useState } from "react";
import tcu from "../images/bg.png";
import { loginadmin } from "../api/auth"
import { useAuthStore } from "../state";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash,FaEye } from 'react-icons/fa';


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    token ? navigate('/') : navigate('/login');
  }, [navigate, token]);



  const handleLogin = async (e: any) => {
    e.preventDefault();
    //console.log(username, password);
    setIsLoading(true)

    try {
      const res = await loginadmin(username, password)
      setIsLoading(false)
      loginAdmin(res.data.token)
      //console.log(res.data.token);
      //navigate to dashboard
      navigate("/", {replace: true})
      console.log("Login Successfully");
      
    } catch (err: any) {
      setIsLoading(false)
      setError(err.response.data.error);
      console.log(err)
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen p-10 font-medium text-lg">
      <form
        onSubmit={handleLogin}
        className=" bg-[#F0F0F0] rounded-lg overflow-hidden text-[#3C486B] pb-5 shadow-2xl md:max-w-md"
      >
        <img className="" src={tcu} height={400} alt="Taguig City University" />
        <div className="flex flex-col p-5">
          <h2 className="text-2xl text-center font-sans font-bold">LOGIN</h2>
          <label>Username</label>
          <input
            className="px-4 py-3 rounded-lg text-black text-md font-medium outline-none border-solid border-2 border-gray-300"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col px-5">
          <label>Password</label>
          <div className="pb-7">
            <input
              className="w-full px-4 py-3 rounded-lg text-black text-md font-medium outline-none border-solid border-2 border-gray-300"
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
            className="text-center text-white px-4 py-2 rounded-lg w-[30%] bg-[#F45050] break-words"
            type="submit"
          >
            Loading...
          </button>)
          :
          (<button
            className="text-center text-white px-4 py-2 rounded-lg w-[40%] bg-[#F45050] shadow-md shadow-red-300"
            type="submit"
          >
            Login
          </button>)}
        </div>
      </form>
    </div>
  );
}