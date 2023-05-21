import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "./hooks/state";
import useRefreshToken from "./hooks/useRefreshToken";
import Lottie from "lottie-react";
import ballot from "./assets/ballot.json"

function App() {
  const navigate = useNavigate();
  const { isNight, token } = useAuthStore((state) => state)
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();


  useEffect(() => {
    let isMounted = true;
  
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !token ? verifyRefreshToken() : setIsLoading(false)
  
  
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      useAuthStore.setState({ isNight: true });
    } else {
      document.documentElement.classList.remove('dark');
      useAuthStore.setState({ isNight: false });
    }
  
    return () => {
      isMounted = false;
    };
  }, [isNight]);
  

  useEffect(() => {
    //console.log(`isLoading: ${isLoading}`)
    if(token){ 
        const parsed = JSON.parse(token);
        //console.log(`aT: ${JSON.stringify(parsed?.accessToken)}`)
        //console.log(`ROLE: ${JSON.stringify(parsed?.role)}`)
      
        if (parsed.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (parsed.role === 'user') {
          navigate('/dashboard');
        }else {
          console.log("Here App component");
          
        }
    }else{
        //console.log("No token found");
        navigate('/login')
    }
    
  }, [isLoading, token])

  return (
    <div className="App bg-[#f4f7ff] dark:bg-[#2B2B2B]">
      <div className="Container bg-[#f4f7ff] dark:bg-[#2B2B2B] min-h-screen">
        {isLoading 
          ? <div className="div w-full h-screen absolute flex justify-center items-center">
              <Lottie animationData={ballot} loop={true} />
            </div>
          : <Outlet />}
      </div>
    </div>
  );
}

export default App;
