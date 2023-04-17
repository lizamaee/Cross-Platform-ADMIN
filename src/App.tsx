import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    !token ? navigate("/") : navigate("/dashboard");
  }, []);

  return (
    <div className="App">
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
