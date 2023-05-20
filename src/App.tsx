import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "./hooks/state";

function App() {
  const navigate = useNavigate();
  const { isNight, token } = useAuthStore((state) => state)


  useEffect(() => {
    if(token){
      const parsedToken = JSON.parse(token)
      
      if (parsedToken.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }else{
      console.log("No token found");
      
    }

    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      useAuthStore.setState({isNight: true})
    } else {
      document.documentElement.classList.remove('dark')
      useAuthStore.setState({isNight: false})
    }

  }, [isNight]);

  return (
    <div className="App bg-[#f4f7ff] dark:bg-[#2B2B2B]">
      <div className="Container bg-[#f4f7ff] dark:bg-[#2B2B2B] min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
