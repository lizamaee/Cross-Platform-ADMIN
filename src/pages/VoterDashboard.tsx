import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { RiHistoryLine, RiSettings2Fill,RiLogoutCircleRFill } from "react-icons/ri";
import { BsShieldLockFill } from "react-icons/bs";
import { CgMenuLeftAlt } from "react-icons/cg";
import { FaVoteYea } from "react-icons/fa";
import { HiHome, HiUserGroup } from "react-icons/hi";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

export default function VoterDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate()
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const logout = useLogout()

  async function handleLogout(){
    await logout()
    console.log("Logged out")
    navigate("/login", {replace: true})
  }

  return (
    <div className="container md:overflow-hidden h-screen max-w-screen-2xl md:flex">
      <nav
        className={` sidebar fixed md:static w-4/5 h-screen rounded-r-3xl md:rounded-r-lg bg-[#E5E0FF] dark:bg-[#303030] text-[#414141] shadow-md  ${
          isSidebarOpen ? 'translate-x-0 flex-[6]' : '-translate-x-full'
        } transition-all duration-300 ease-in-out md:w-auto md:translate-x-0 md:flex-[2] lg:flex-1`}
      >

        {/* MOBILE AND TABLET VIEW */}
        { isSidebarOpen && (
          <div className="md:hidden">
            <span className="flex justify-end w-full pr-5 pt-5">
              <button
                  className="md:hidden p-2"
                  onClick={toggleSidebar}
                >
                  {isSidebarOpen && (<RxCross2 size={28} className="text-[#444A5E] font-bold rounded-full"/>)}
              </button>
            </span>

            <div className="flex flex-col items-center">
              <img src="https://bit.ly/3WdAOb5" alt="profile" className="w-20 rounded-full"/>
              <h3 className="text-md pop-semibold py-2 text-[#414141]">Wall E</h3>
            </div>

            <ul className="px-3 flex flex-col gap-2 pt-5 pop-medium tracking-wider">
              <NavLink onClick={() => toggleSidebar()} to="/voter/dashboard" className="flex items-center gap-3 hover:bg-[#C1D0F5]  text-[#414141] px-5 py-3 rounded-md">
                <HiHome size={25} className="text-[#4C7CE5] voter-icon" />
                <h2 className="pop-medium">Home</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/cast-vote" className="flex items-center gap-3 hover:bg-[#C1D0F5] text-[#414141] px-5 py-3 rounded-md">
                <FaVoteYea size={25} className="text-[#4C7CE5] voter-icon"/>
                <h2 className="pop-medium">Cast Vote</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/election-history" className="flex items-center gap-3 hover:bg-[#C1D0F5]  text-[#414141] px-5 py-3 rounded-md">
                <RiHistoryLine size={25} className="text-[#4C7CE5] voter-icon"/>
                <h2 className="pop-medium">Election History</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/developers" className="flex items-center gap-3 hover:bg-[#C1D0F5] text-[#414141] px-5 py-3 rounded-md">
                <HiUserGroup size={25} className="text-[#4C7CE5] voter-icon"/>
                <h2 className="pop-medium">Developers</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/privacy-policy" className="flex items-center gap-3 hover:bg-[#C1D0F5] text-[#414141] px-5 py-3 rounded-md">
                <BsShieldLockFill size={23} className="text-[#4C7CE5] voter-icon"/>
                <h2 className="pop-medium">Privacy Policy</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/settings" className="flex items-center gap-3 hover:bg-[#C1D0F5] text-[#414141] px-5 py-3 rounded-md">
                <RiSettings2Fill size={25} className="text-[#4C7CE5] voter-icon"/>
                <h2 className="pop-medium">Settings</h2>
              </NavLink>
            </ul>
            
            <div className="logout-container px-3 bottom-0 mt-16">
            <button onClick={handleLogout} className="logout w-full text-md hover:bg-[#C1D0F5] rounded-md flex justify-between items-center pop-semibold p-5">
              <h3 className="text-[#414141]">Logout</h3>
              <RiLogoutCircleRFill size={25} className="text-[#4C7CE5] voter-icon"/>
            </button>
          </div>
          </div>
        )}

        {/* DESKTOP VIEW */}
        <div className="hidden md:block min-h-screen">

          <div className="flex flex-col items-center pt-5 ">
            <img src="https://bit.ly/3WdAOb5" alt="profile" className="w-32 rounded-full"/>
            <h3 className="text-md pop-semibold py-2 text-[#414141]">Wall E</h3>
          </div>

          <ul className="px-3 flex flex-col gap-2 pt-5 pop-medium tracking-wider">
            <NavLink to="/voter/dashboard" className="flex items-center gap-3 hover:bg-[#C1D0F5]  text-[#414141] px-5 py-3 rounded-md">
              <HiHome size={25} className="text-[#4C7CE5] voter-icon" />
              <h2 className="pop-medium">Home</h2>
            </NavLink>
            <NavLink to="/voter/cast-vote" className="flex items-center gap-3 hover:bg-[#C1D0F5] text-[#414141] px-5 py-3 rounded-md">
              <FaVoteYea size={25} className="text-[#4C7CE5] voter-icon"/>
              <h2 className="pop-medium">Cast Vote</h2>
            </NavLink>
            <NavLink to="/voter/election-history" className="flex items-center gap-3 hover:bg-[#C1D0F5]  text-[#414141] px-5 py-3 rounded-md">
              <RiHistoryLine size={25} className="text-[#4C7CE5] voter-icon"/>
              <h2 className="pop-medium">Election History</h2>
            </NavLink>
            <NavLink to="/voter/developers" className="flex items-center gap-3 hover:bg-[#C1D0F5] text-[#414141] px-5 py-3 rounded-md">
              <HiUserGroup size={25} className="text-[#4C7CE5] voter-icon"/>
              <h2 className="pop-medium">Developers</h2>
            </NavLink>
            <NavLink to="/voter/privacy-policy" className="flex items-center gap-3 hover:bg-[#C1D0F5] text-[#414141] px-5 py-3 rounded-md">
              <BsShieldLockFill size={25} className="text-[#4C7CE5] voter-icon"/>
              <h2 className="pop-medium">Privacy Policy</h2>
            </NavLink>
            <NavLink to="/voter/settings" className="flex items-center gap-3 hover:bg-[#C1D0F5] text-[#414141] px-5 py-3 rounded-md">
              <RiSettings2Fill size={25} className="text-[#4C7CE5] voter-icon"/>
              <h2 className="pop-medium">Settings</h2>
            </NavLink>
          </ul>
          
          <div className="logout-container px-3 bottom-0 mt-8">
            <button onClick={handleLogout} className="logout w-full text-md hover:bg-[#C1D0F5] rounded-md flex justify-between items-center pop-semibold p-5">
              <h3 className="text-[#414141]">Logout</h3>
              <RiLogoutCircleRFill size={25} className="text-[#4C7CE5] voter-icon"/>
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
