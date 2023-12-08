import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { RiSettings2Line } from "react-icons/ri";
import { BiHomeAlt } from "react-icons/bi";
import { BsCalendarEvent,BsFillSunFill, BsMoonFill } from "react-icons/bs";
import { PiShieldStarBold   } from "react-icons/pi";
import { MdOutlineHowToVote } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { Outlet, NavLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { IoMenu } from "react-icons/io5";
import { useAuthStore } from "../hooks/state";
import { CgInfo } from "react-icons/cg";
import DeleteMe from "../components/DeleteMe";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isNight, switchMode } = useAuthStore((state) => state)
  const [isOpenCredit, setIsOpenCredit] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const logout = useLogout()

  async function handleLogout(){
    await logout()
    localStorage.removeItem('student_id')
    window.location.reload()
  }

  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, document.title, window.location.href);
    };

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  return (
    <div className="container md:overflow-hidden h-screen max-w-screen-2xl md:flex">
      <DeleteMe open={isOpenCredit} onClose={() => setIsOpenCredit(false)}>
        <div className="credits p-4 bg-gray-100 dark:bg-[#333333] rounded-xl">
          <h3 className="font-bold dark:text-gray-300 text-base sm:text-lg text-center pb-1 sm:pb-4"><span className="text-purple-500">CICT</span> Voting System</h3>
          <div className="devs text-gray-800 dark:text-gray-300 font-semibold">
            <div className="una flex flex-col text-sm sm:text-base sm:flex-row">
              <h4 className="flex-1 break-words font-normal">Developers:</h4>
              <h4 className="flex-1 break-words pl-3 sm:pl-0">Menard M. Pajares</h4>
            </div>
            <div className="dalawa flex flex-col text-sm sm:text-base sm:flex-row border-b dark:border-zinc-700">
              <h4 className="flex-1 break-words"></h4>
              <h4 className="flex-1 break-words pl-3 sm:pl-0">Liza Mae N. Necerio</h4>
            </div>
            <div className="tatlo flex flex-col text-sm sm:text-base sm:flex-row pt-2">
              <h4 className="flex-1 break-words font-normal">Recipient:</h4>
              <h4 className="flex-1 break-words pl-3 sm:pl-0"><span className="text-purple-500">C</span>ollege of <span className="text-purple-500">I</span>nformation and <span className="text-purple-500">C</span>ommunication <span className="text-purple-500">T</span>echnology <span className="text-red-500">T</span>aguig <span className="text-red-500">C</span>ity <span className="text-red-500">U</span>niversity</h4>
            </div>
          </div>
          <h3 className="text-right pt-4 opacity-60 text-black dark:text-white text-sm sm:text-base">Version 1.0</h3>
        </div>
      </DeleteMe>
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
                {isSidebarOpen && (<RxCross2 size={30} className="text-[#7268EF] shadow-sm rounded-lg p-1 bg-gray-600 dark:bg-zinc-700"/>)}
              </button>
            </div>

            <div className="hero flex justify-end gap-5 items-center py-1 px-3 rounded-full">
              <span className="cursor-pointer" onClick={switchMode}>
                { isNight ? ( <BsFillSunFill className='text-gray-400 hover:text-gray-200' size={18}/>) : ( < BsMoonFill className='text-[#eaefff] hover:text-slate-300' size={18} /> )}
              </span>

              <span onClick={() => setIsOpenCredit(true)} className='flex cursor-pointer'>
                <span style={{ display: 'inline-block' }}>
                  <CgInfo className="text-[#eaefff] dark:text-gray-400 dark:hover:text-gray-300" size={23} />
                </span>
              </span>
            </div>

            <ul className="px-3 flex flex-col gap-4 pt-10 pop-medium tracking-wider">
            <NavLink onClick={() => toggleSidebar()} to="/admin/dashboard" className="flex items-center gap-1 hover:bg-[#4d5263]  text-white px-3 py-3 rounded-md">
              <BiHomeAlt size={25} className="basis-1/4"/>
              <h2 className="basis-3/4">Dashboard</h2>
            </NavLink>
            <NavLink onClick={() => toggleSidebar()} to="/admin/election" className="flex items-center gap-1 hover:bg-[#4d5263] text-white px-3 py-3 rounded-md">
              <BsCalendarEvent size={20} className="basis-1/4"/>
              <h2 className="basis-3/4">Election</h2>
            </NavLink>
            <NavLink onClick={() => toggleSidebar()} to="/admin/special-features" className="flex items-center gap-1 hover:bg-[#4d5263]  text-white px-3 py-3 rounded-md">
              <PiShieldStarBold  size={25} className="basis-1/4"/>
              <h2 className="basis-3/4">Special Features</h2>
            </NavLink>
            <NavLink onClick={() => toggleSidebar()} to="/admin/settings" className="flex items-center gap-1 hover:bg-[#4d5263] text-white px-3 py-3 rounded-md">
              <RiSettings2Line size={25} className="basis-1/4"/>
              <h2 className="basis-3/4">Settings</h2>
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
            <NavLink to="/admin/dashboard" className="flex items-center gap-1 hover:bg-[#4d5263]  text-white px-3 py-3 rounded-md">
              <BiHomeAlt size={25} className="basis-1/4"/>
              <h2 className="basis-3/4">Dashboard</h2>
            </NavLink>
            <NavLink to="/admin/election" className="flex items-center gap-1 hover:bg-[#4d5263] text-white px-3 py-3 rounded-md">
              <BsCalendarEvent size={20} className="basis-1/4"/>
              <h2 className="basis-3/4">Election</h2>
            </NavLink>
            <NavLink to="/admin/special-features" className="flex justify-start items-center gap-1 hover:bg-[#4d5263]  text-white px-3 py-3 rounded-md">
              <PiShieldStarBold  size={25} className="basis-1/4"/>
              <h2 className="basis-3/4">Special Features</h2>
            </NavLink>
            <NavLink to="/admin/settings" className="flex items-center gap-1 hover:bg-[#4d5263] text-white px-3 py-3 rounded-md">
              <RiSettings2Line size={25} className="basis-1/4"/>
              <h2 className="basis-3/4">Settings</h2>
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
