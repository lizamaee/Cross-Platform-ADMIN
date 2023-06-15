import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { RiHistoryLine, RiSettings2Fill } from "react-icons/ri";
import { BsFillSunFill, BsMoonFill, BsShieldLockFill } from "react-icons/bs";
import { CgMenuLeftAlt } from "react-icons/cg";
import { FaVoteYea } from "react-icons/fa";
import { HiHome, HiOutlineLogout, HiUserGroup } from "react-icons/hi";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { useAuthStore } from "../hooks/state";
import { useVoter } from "../hooks/queries/useAdmin";
import { MdOutlineHowToVote } from "react-icons/md";

export default function VoterDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {  isNight, switchMode, student_id } = useAuthStore((state) => state)
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
  
  const voterQuery = useVoter(student_id)

  const fullname = voterQuery?.data?.voter?.fullname ?? "John Doe"
  const profile_picture = voterQuery?.data?.voter?.profile_picture ?? "https://shorturl.at/tJU24"
  

  return (
    <div className="container md:overflow-hidden h-screen max-w-screen-2xl md:flex">
      <nav
        className={` sidebar fixed md:static w-4/5 h-screen rounded-r-3xl md:rounded-r-lg bg-white dark:bg-[#303030] text-[#414141] shadow-md  ${
          isSidebarOpen ? 'translate-x-0 flex-[6]' : '-translate-x-full'
        } transition-all duration-200 ease-in-out md:w-auto md:translate-x-0 md:flex-[2] lg:flex-1`}
      >

        {/* MOBILE AND TABLET VIEW */}
        { isSidebarOpen && (
          <div className="md:hidden rounded-r-lg">
            <span className="flex justify-end w-full pr-5 pt-5">
              <button
                  className="md:hidden p-2"
                  onClick={toggleSidebar}
                >
                  {isSidebarOpen && (<RxCross2 size={28} className="text-[#444A5E] dark:text-gray-400 font-bold rounded-full"/>)}
              </button>
            </span>
            <span className="absolute top-16 left-5" onClick={switchMode}>
              { isNight ? ( <BsFillSunFill className='text-gray-400 hover:text-gray-200' size={18}/>) : ( < BsMoonFill className='text-[#a3aed0] hover:text-slate-500' size={18} /> )}
              
            </span>
            <div className="flex flex-col items-center">
              <img src={profile_picture} alt="profile" className="w-20 border-[6px] shadow-md border-white dark:border-zinc-700 object-cover rounded-full"/>
              <h3 className="text-md pop-semibold py-2 text-[#414141] dark:text-gray-100">{fullname}</h3>
            </div>

            <ul className="px-3 flex flex-col gap-2 pt-5 pop-medium tracking-wider">
              <NavLink onClick={() => toggleSidebar()} to="/voter/dashboard" className="flex items-center gap-3 text-gray-700 tracking-wide dark:text-white  px-5 py-3 rounded-md">
                <HiHome size={25} className="text-gray-400 voter-icon" />
                <h2 className="pop-medium">Home</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/cast-vote" className="flex items-center gap-3 text-gray-700 tracking-wide dark:text-white  px-5 py-3 rounded-md">
                <FaVoteYea size={25} className="text-gray-400 voter-icon"/>
                <h2 className="pop-medium">Cast Vote</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/election-history" className="flex items-center gap-3 text-gray-700 tracking-wide dark:text-white px-5 py-3 rounded-md">
                <RiHistoryLine size={25} className="text-gray-400 voter-icon"/>
                <h2 className="pop-medium">Election History</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/developers" className="flex items-center gap-3 text-gray-700 tracking-wide dark:text-white  px-5 py-3 rounded-md">
                <HiUserGroup size={25} className="text-gray-400 voter-icon"/>
                <h2 className="pop-medium">Developers</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/privacy-policy" className="flex items-center gap-3 text-gray-700 tracking-wide dark:text-white  px-5 py-3 rounded-md">
                <BsShieldLockFill size={23} className="text-gray-400 voter-icon"/>
                <h2 className="pop-medium">Privacy Policy</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/settings" className="flex items-center gap-3 text-gray-700 tracking-wide dark:text-white px-5 py-3 rounded-md">
                <RiSettings2Fill size={25} className="text-gray-400 voter-icon"/>
                <h2 className="pop-medium">Settings</h2>
              </NavLink>
            </ul>
            
            <div className="logout-container px-3 bottom-0 mt-16">
            <button onClick={handleLogout} className="logout w-full text-md hover:bg-[#C1D0F5] rounded-md flex justify-between items-center pop-semibold p-5">
              <h3 className="text-gray-700 tracking-wide dark:text-white ">Logout</h3>
              <HiOutlineLogout size={25} className="text-gray-400 voter-icon"/>
            </button>
          </div>
          </div>
        )}

        {/* DESKTOP VIEW */}
        <div className="hidden md:block min-h-screen">

          <div className="title-container flex items-center justify-center pt-10 mb-10">
            <MdOutlineHowToVote className="text-[#6c63ff] h-10 w-10"/>
            <div className="title-box">
              <h2 className='text-xl pop-bold text-[#6c63ff]'>CICT</h2>
              <h3 className='text-xs pop-regular dark:text-gray-300'>Voting System</h3>
            </div>
          </div>

          <ul className="px-3 flex flex-col gap-2 pt-5 pop-medium tracking-wider">
            <NavLink to="/voter/dashboard" className="flex items-center gap-3   text-gray-700 tracking-wide dark:text-white px-5 py-3 rounded-md">
              <HiHome size={25} className="text-gray-400 voter-icon" />
              <h2 className="pop-medium">Home</h2>
            </NavLink>
            <NavLink to="/voter/cast-vote" className="flex items-center gap-3  text-gray-700 tracking-wide dark:text-white px-5 py-3 rounded-md">
              <FaVoteYea size={25} className="text-gray-400 voter-icon"/>
              <h2 className="pop-medium">Cast Vote</h2>
            </NavLink>
            <NavLink to="/voter/election-history" className="flex items-center gap-3   text-gray-700 tracking-wide dark:text-white px-5 py-3 rounded-md">
              <RiHistoryLine size={25} className="text-gray-400 voter-icon"/>
              <h2 className="pop-medium">Election History</h2>
            </NavLink>
            <NavLink to="/voter/developers" className="flex items-center gap-3  text-gray-700 tracking-wide dark:text-white px-5 py-3 rounded-md">
              <HiUserGroup size={25} className="text-gray-400 voter-icon"/>
              <h2 className="pop-medium">Developers</h2>
            </NavLink>
            <NavLink to="/voter/privacy-policy" className="flex items-center gap-3  text-gray-700 tracking-wide dark:text-white px-5 py-3 rounded-md">
              <BsShieldLockFill size={25} className="text-gray-400 voter-icon"/>
              <h2 className="pop-medium">Privacy Policy</h2>
            </NavLink>
            <NavLink to="/voter/settings" className="flex items-center gap-3  text-gray-700 tracking-wide dark:text-white px-5 py-3 rounded-md">
              <RiSettings2Fill size={25} className="text-gray-400 voter-icon"/>
              <h2 className="pop-medium">Settings</h2>
            </NavLink>
          </ul>
          
          <div className="logout-container px-3 bottom-0 mt-8">
            <button onClick={handleLogout} className="logout w-full text-md  rounded-md flex justify-between items-center pop-semibold p-5">
              <h3 className="text-gray-700 tracking-wide dark:text-white">Logout</h3>
              <HiOutlineLogout size={25} className="text-gray-400 voter-icon"/>
            </button>
          </div>
          
        </div>

      </nav>

      <div className={`main flex-[2] md:flex-[6] lg:flex-[4] p-5 md:overflow-y-auto bg-[#E5E0FF] dark:bg-[#2B2B2B]`}>
        <div className="wrapper flex items-center md:block">
          <button
            className="md:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (<RxCross2 size={35}/>) : (<CgMenuLeftAlt size={40} className="text-[#7268EF]" />)}
          </button>

        </div>
        <div>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
