import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "./state";

function App() {
  const navigate = useNavigate();
  const { isNight } = useAuthStore((state) => state)

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    !token ? navigate("/login") : navigate("/");
  }, [token]);

  return (
    <div className={`App`}>
      <div className={`Container ${isNight ? 'night' : 'daylight'}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
