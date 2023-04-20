import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    !token ? navigate("/login") : navigate("/");
  }, [navigate,token]);

  return (
    <div className="App">
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
