import { useState } from "react";
import { RxCross2,RxHamburgerMenu } from "react-icons/rx";
import { Outlet, NavLink } from "react-router-dom";
export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="container min-h-screen max-w-screen-2xl flex bg-[#E1E1E1]">
      <nav
        className={` sidebar p-2  bg-[#262A56] ${
          isSidebarOpen ? 'translate-x-0 flex-[6] shadow-2xl' : '-translate-x-full'
        } transition-all duration-300 ease-in-out md:translate-x-0 md:flex-[2] lg:flex-1`}
      ></nav>
      <div className="main flex-[2] md:flex-[6] lg:flex-[4] p-5">
        <button
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (<RxCross2 size={35}/>) : (<RxHamburgerMenu size={35}/>)}
        </button>
        <div>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
