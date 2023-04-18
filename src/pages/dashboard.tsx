import { useState } from "react";
import { RxCross2,RxHamburgerMenu } from "react-icons/rx";
import { BiHomeAlt } from "react-icons/bi";
import { MdHowToVote } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { Outlet, NavLink } from "react-router-dom";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="container min-h-screen max-w-screen-2xl flex bg-[#F0F0F0]">
      <nav
        className={` sidebar bg-white text-black shadow-2xl ${
          isSidebarOpen ? 'translate-x-0 flex-[6]' : '-translate-x-full'
        } transition-all duration-300 ease-in-out md:translate-x-0 md:flex-[2] lg:flex-1`}
      >

        {/* MOBILE AND TABLET VIEW */}
        { isSidebarOpen && (
          <ul className="md:hidden">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
          </ul>
        )}

        {/* DESKTOP VIEW */}
        <div className="hidden md:block min-h-screen">

          <div className="flex items-center gap-2 px-5 py-4 shadow-sm">
            <MdHowToVote size={40} className="text-[#7268EF]"/>
            <h3 className="text-2xl pop-bold text-[#2A2F4F]">VS Admin</h3>
          </div>

          <ul className="px-3 pt-10 pop-medium tracking-wider">
            <li className="flex items-center gap-3 bg-gradient-to-r from-[#7268EF] to-[#9D93F6] text-white px-5 py-3 rounded-md">
              <BiHomeAlt size={25}/>
              <NavLink to="/">Dashboard</NavLink>
            </li>
          </ul>
          
          <div className="logout w-full text-lg flex justify-between items-center pop-semibold absolute p-5 bottom-0">
            <h3 className="text-[#2D2727]">Logout</h3>
            <HiOutlineLogout size={25} className="text-[#2D2727]"/>
          </div>
          
        </div>

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
