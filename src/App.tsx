import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "./state";

function App() {
  const navigate = useNavigate();
  const { isNight } = useAuthStore((state) => state)

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    !token ? navigate("/login") : navigate("/");

    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      useAuthStore.setState({isNight: true})
    } else {
      document.documentElement.classList.remove('dark')
      useAuthStore.setState({isNight: false})
    }

  }, [token, isNight]);

  return (
    <div className="App bg-[#f4f7ff] dark:bg-[#2B2B2B]">
      <div className="Container bg-[#f4f7ff] dark:bg-[#2B2B2B] min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
