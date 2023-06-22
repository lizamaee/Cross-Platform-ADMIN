import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { RiSettings2Line } from "react-icons/ri";
import { BiHomeAlt } from "react-icons/bi";
import { BsCalendarEvent,BsListStars } from "react-icons/bs";
import { MdOutlineHowToVote } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { IoMenu } from "react-icons/io5";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate()
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const logout = useLogout()

  async function handleLogout(){
    await logout()
    localStorage.removeItem('student_id')
    console.log("Logged out")
    navigate("/login", {replace: true})
  }


  return (
    <div className="container md:overflow-hidden h-screen max-w-screen-2xl md:flex">
      <nav
        className={` sidebar overflow-hidden z-20 fixed md:static w-4/5 h-screen rounded-r-3xl md:rounded-r-lg bg-[#444A5E] dark:bg-[#303030] text-white shadow-2xl ${
          isSidebarOpen ? 'translate-x-0 flex-[6]' : '-translate-x-full'
        } transition-all duration-300 ease-in-out md:w-auto md:translate-x-0 md:flex-[2] lg:flex-1`}
      >

        {/* MOBILE AND TABLET VIEW */}
        { isSidebarOpen && (
          <div className="md:hidden">
            <div className="flex items-center justify-between px-5 py-4 shadow-sm">
              <div className="title-container sm:ml-10 flex items-center gap-1">
                <MdOutlineHowToVote className="text-[#6c63ff] h-10 w-10 md:h-16 md:w-16"/>
                <div className="title-box">
                  <h2 className='text-xl pop-bold text-[#6c63ff]'>CICT</h2>
                  <h3 className='text-xs pop-regular'>Voting System</h3>
                </div>
              </div>
              <button
                className="md:hidden"
                onClick={toggleSidebar}
              >
                {isSidebarOpen && (<RxCross2 size={35} className="text-[#7268EF] shadow-sm rounded-lg bg-gray-600 dark:bg-zinc-700"/>)}
              </button>
            </div>

            <ul className="px-3 flex flex-col gap-4 pt-10 pop-medium tracking-wider">
            <NavLink onClick={() => toggleSidebar()} to="/admin/dashboard" className="flex items-center gap-3 hover:bg-[#4d5263]  text-white px-5 py-3 rounded-md">
              <BiHomeAlt size={25}/>
              <h2>Dashboard</h2>
            </NavLink>
            <NavLink onClick={() => toggleSidebar()} to="/admin/election" className="flex items-center gap-3 hover:bg-[#4d5263] text-white px-5 py-3 rounded-md">
              <BsCalendarEvent size={20}/>
              <h2>Election</h2>
            </NavLink>
            <NavLink onClick={() => toggleSidebar()} to="/admin/special-features" className="flex items-center gap-3 hover:bg-[#4d5263]  text-white px-5 py-3 rounded-md">
              <BsListStars size={25}/>
              <h2>Special Features</h2>
            </NavLink>
            <NavLink onClick={() => toggleSidebar()} to="/admin/settings" className="flex items-center gap-3 hover:bg-[#4d5263] text-white px-5 py-3 rounded-md">
              <RiSettings2Line size={25}/>
              <h2>Settings</h2>
            </NavLink>
          </ul>
            
            <button onClick={handleLogout} className="logout w-full text-lg flex justify-between items-center pop-semibold absolute p-5 bottom-0">
              <h3 className="text-[#ffffff]">Logout</h3>
              <HiOutlineLogout size={25} className="text-[#ffffff]"/>
            </button>
          </div>
        )}

        {/* DESKTOP VIEW */}
        <div className="hidden md:block min-h-screen">

          <div className="flex items-center justify-center gap-2 px-5 py-4 shadow-sm">
              <div className="title-container flex items-center gap-1">
                <MdOutlineHowToVote className="text-[#6c63ff] h-10 w-10"/>
                <div className="title-box">
                  <h2 className='text-xl pop-bold text-[#6c63ff]'>CICT</h2>
                  <h3 className='text-xs pop-regular'>Voting System</h3>
                </div>
              </div>
          </div>

          <ul className="px-3 flex flex-col gap-4 pt-10 pop-medium tracking-wider">
            <NavLink to="/admin/dashboard" className="flex items-center gap-3 hover:bg-[#4d5263]  text-white px-5 py-3 rounded-md">
              <BiHomeAlt size={25}/>
              <h2>Dashboard</h2>
            </NavLink>
            <NavLink to="/admin/election" className="flex items-center gap-3 hover:bg-[#4d5263] text-white px-5 py-3 rounded-md">
              <BsCalendarEvent size={20}/>
              <h2>Election</h2>
            </NavLink>
            <NavLink to="/admin/special-features" className="flex items-center gap-3 hover:bg-[#4d5263]  text-white px-5 py-3 rounded-md">
              <BsListStars size={25}/>
              <h2>Special Features</h2>
            </NavLink>
            <NavLink to="/admin/settings" className="flex items-center gap-3 hover:bg-[#4d5263] text-white px-5 py-3 rounded-md">
              <RiSettings2Line size={25}/>
              <h2>Settings</h2>
            </NavLink>
          </ul>
          
          <button onClick={handleLogout} className="logout w-full text-lg hover:bg-[#4d5263] flex justify-between items-center pop-semibold absolute p-5 bottom-0">
            <h3 className="text-[#ffffff]">Logout</h3>
            <HiOutlineLogout size={25} className="text-[#ffffff]"/>
          </button>
          
        </div>

      </nav>

      <div className={`main flex-[2] md:flex-[6] lg:flex-[4] p-5 md:overflow-y-auto bg-[#f4f7ff] dark:bg-[#2B2B2B]`}>
        <div className="wrapper absolute flex items-center md:block">
          <button
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <IoMenu size={37} className="text-[#7268EF] shadow-sm rounded-lg bg-white dark:bg-zinc-700" />
          </button>

        </div>
        <div>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
