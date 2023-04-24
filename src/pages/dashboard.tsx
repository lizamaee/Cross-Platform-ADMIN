import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { RiSettings2Line } from "react-icons/ri";
import { BiHomeAlt } from "react-icons/bi";
import { BsCalendarEvent,BsListStars, BsSunFill } from "react-icons/bs";
import { CgMenuLeftAlt, CgInfo } from "react-icons/cg";
import {BsFillSunFill,BsMoonFill, BsPersonCircle} from 'react-icons/bs'
import { MdHowToVote } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../state";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageName, setPageName] = useState("Dashboard");
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const { logoutAdmin, isNight, switchMode } = useAuthStore((state) => state) 
  const navigate = useNavigate()
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  function handleLogout(e: any){
    console.log("Logged out")
    logoutAdmin()
    navigate("/login", {replace: true})
  }

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    !token ? navigate('/login') : navigate('/');
  }, [token]);


  return (
    <div className="container md:overflow-hidden h-screen max-w-screen-2xl md:flex bg-[#FFFFFF]">
      <nav
        className={` sidebar fixed md:static w-4/5 h-screen rounded-r-3xl md:rounded-r-lg  ${isNight ? 'bg-[#303030]' : 'bg-[#444A5E]'}  text-white shadow-2xl ${
          isSidebarOpen ? 'translate-x-0 flex-[6]' : '-translate-x-full'
        } transition-all duration-300 ease-in-out md:w-auto md:translate-x-0 md:flex-[2] lg:flex-1`}
      >

        {/* MOBILE AND TABLET VIEW */}
        { isSidebarOpen && (
          <div className="md:hidden">
            <div className="flex items-center justify-between px-5 py-4 shadow-sm">
              <MdHowToVote size={40} className="text-[#7268EF]"/>
              <h3 className="text-2xl pop-bold text-[#ffffff]">VS Admin</h3>
              <button
                className="md:hidden"
                onClick={toggleSidebar}
              >
                {isSidebarOpen && (<RxCross2 size={28} className="text-[#444A5E] bg-white rounded-full"/>)}
              </button>
            </div>

            <ul className="px-3 flex flex-col gap-4 pt-10 pop-medium tracking-wider">
            <NavLink onClick={() => {setPageName("Dashboard")
          setPageTitle("Dashboard") 
          toggleSidebar()}} to="/" className="flex items-center gap-3 hover:bg-[#4d5263]  text-white px-5 py-3 rounded-md">
              <BiHomeAlt size={25}/>
              <h2>Dashboard</h2>
            </NavLink>
            <NavLink onClick={() => {setPageName("Election")
          setPageTitle("Election") 
          toggleSidebar()}} to="/election" className="flex items-center gap-3 hover:bg-[#4d5263] text-white px-5 py-3 rounded-md">
              <BsCalendarEvent size={20}/>
              <h2>Election</h2>
            </NavLink>
            <NavLink onClick={() => {setPageName("Special Features")
          setPageTitle("Special Features") 
          toggleSidebar()}} to="/special-features" className="flex items-center gap-3 hover:bg-[#4d5263]  text-white px-5 py-3 rounded-md">
              <BsListStars size={25}/>
              <h2>Special Features</h2>
            </NavLink>
            <NavLink onClick={() => {setPageName("Settings")
          setPageTitle("Settings") 
          toggleSidebar()}} to="/settings" className="flex items-center gap-3 hover:bg-[#4d5263] text-white px-5 py-3 rounded-md">
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

          <div className="flex items-center gap-2 px-5 py-4 shadow-sm">
            <MdHowToVote size={40} className="text-[#7268EF]"/>
            <h3 className="text-2xl pop-bold text-[#ffffff]">VS Admin</h3>
          </div>

          <ul className="px-3 flex flex-col gap-4 pt-10 pop-medium tracking-wider">
            <NavLink onClick={() => {setPageName("Dashboard") 
            setPageTitle("Dashboard")}} to="/" className="flex items-center gap-3 hover:bg-[#4d5263]  text-white px-5 py-3 rounded-md">
              <BiHomeAlt size={25}/>
              <h2>Dashboard</h2>
            </NavLink>
            <NavLink onClick={() => {setPageName("Election") 
          setPageTitle("Election")}} to="/election" className="flex items-center gap-3 hover:bg-[#4d5263] text-white px-5 py-3 rounded-md">
              <BsCalendarEvent size={20}/>
              <h2>Election</h2>
            </NavLink>
            <NavLink onClick={() => {setPageName("Special Features")
          setPageTitle("Special Features")}} to="/special-features" className="flex items-center gap-3 hover:bg-[#4d5263]  text-white px-5 py-3 rounded-md">
              <BsListStars size={25}/>
              <h2>Special Features</h2>
            </NavLink>
            <NavLink onClick={() => {setPageName("Settings")
          setPageTitle("Settings")}} to="/settings" className="flex items-center gap-3 hover:bg-[#4d5263] text-white px-5 py-3 rounded-md">
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

      <div className={`main flex-[2] md:flex-[6] lg:flex-[4] p-5 md:overflow-y-auto`}>
        <div className="wrapper flex items-center md:block">
          <button
            className="md:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (<RxCross2 size={35}/>) : (<CgMenuLeftAlt size={40} className="text-[#7268EF]" />)}
          </button>
          <div className="navigation flex-1 flex md:block justify-center">
            <h3 className='pop-semibold hidden md:block text-[0.5rem] md:text-[0.7rem] text-sky-800'>Pages / {pageName}</h3>
            <div className="divider flex justify-between">
              <h1 className='text-xl md:text-3xl pop-semibold text-sky-950'>{pageTitle}</h1>
              <div className="hero hidden md:flex gap-5 bg-white items-center py-1 px-3 rounded-full">
                <span onClick={switchMode}>
                  { isNight ? ( <BsFillSunFill className='text-[#bd4141]' size={18}/>) : ( < BsMoonFill className='text-[#a3aed0]' size={18} /> )}
                  
                </span>

                <span>
                  < CgInfo className='text-[#a3aed0]' size={20} />
                </span>

                <span>
                  < BsPersonCircle className='text-[#a3aed0]'  size={20} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
