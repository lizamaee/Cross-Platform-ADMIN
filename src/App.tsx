import LoginPage from "./pages/login"
import {
  Outlet
} from "react-router-dom";

function App() {
  
  return (
    <div className="App">
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default App
