import { useState } from "react";
import { RxCross2,RxHamburgerMenu } from "react-icons/rx";
import { Outlet, NavLink } from "react-router-dom";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="container min-h-screen max-w-screen-2xl flex bg-white">
      <nav
        className={` sidebar bg-[#262A56] shadow-2xl ${
          isSidebarOpen ? 'translate-x-0 flex-[6]' : '-translate-x-full'
        } transition-all duration-300 ease-in-out md:translate-x-0 md:flex-[2] lg:flex-1`}
      >

        {/* MOBILE AND TABLET VIEW */}
        { isSidebarOpen && (
          <ul className="lg:hidden text-white">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
          </ul>
        )}

        {/* DESKTOP VIEW */}
        <ul className="hidden lg:block text-white">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
        </ul>

      </nav>

      <div className="main flex-[2] md:flex-[6] lg:flex-[4] p-5 ">
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
