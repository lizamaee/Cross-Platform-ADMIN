import { useState } from "react";
import tcu from "../../public/images/bg.png";

function login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log(username, password);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen px-5 font-medium text-lg">
      <form
        onSubmit={handleLogin}
        className=" bg-[#F0F0F0] rounded-lg overflow-hidden text-[#3C486B] pb-5 shadow-2xl"
      >
        <img className="" src={tcu} height={400} alt="Taguig City University" />
        <div className="flex flex-col p-5">
          <h2 className="text-2xl text-center font-sans">Login</h2>
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
          <input
            className="px-4 py-3 rounded-lg text-black text-md font-medium outline-none border-solid border-2 border-gray-300"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="text-sm font-bold text-right"
            type="button"
            onClick={handlePasswordToggle}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="max-w-sm flex items-center flex-col">
          {error ? (
            <div className="text-red-400 text-center px-5 py-3 break-words">
              {error}
            </div>
          ) : (
            ""
          )}
          <button
            className="text-center text-white px-4 py-2 rounded-lg w-[30%] bg-[#F45050]"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default login;
