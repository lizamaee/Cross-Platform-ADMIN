import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { RiHistoryLine, RiSettings2Fill } from "react-icons/ri";
import { BsShieldLockFill } from "react-icons/bs";
import { FaVoteYea } from "react-icons/fa";
import { HiHome, HiOutlineLogout, HiUserGroup } from "react-icons/hi";
import { Outlet, NavLink} from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { useAuthStore } from "../hooks/state";
import { useVoter } from "../hooks/queries/useAdmin";
import { MdOutlineHowToVote } from "react-icons/md";
import { Skeleton } from "antd";
import { IoMenu } from "react-icons/io5";
import blank from '../images/blank.jpg'
import { socket } from "../socket"

export default function VoterDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { student_id } = useAuthStore((state) => state)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const logout = useLogout()

  async function handleLogout(){
    await logout()
    socket.disconnect();
    localStorage.removeItem('student_id')
    window.location.reload()
  }
  
  const voterQuery = useVoter(student_id)

  const firstname = voterQuery?.data?.voter?.firstname 
  const surname = voterQuery?.data?.voter?.surname 
  const profile_picture = voterQuery?.data?.voter?.profile_picture ?? blank
  

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
      <nav
        className={` sidebar fixed md:static w-4/5 h-screen rounded-r-3xl md:rounded-r-lg bg-white dark:bg-[#303030] text-[#414141] shadow-slate-700 shadow-xl  ${
          isSidebarOpen ? 'translate-x-0 flex-[6]' : '-translate-x-full'
        } transition-all duration-200 ease-in-out md:w-auto md:translate-x-0 md:flex-[2] lg:flex-1`}
      >

        {/* MOBILE AND TABLET VIEW */}
        { isSidebarOpen && (
          <div className="md:hidden max-h-screen gap-4 overflow-hidden flex flex-col rounded-r-lg">
            <div className="profile">
              <span className="flex justify-end w-full pr-5 pt-5">
                <button
                    className="md:hidden p-2"
                    onClick={toggleSidebar}
                  >
                    {isSidebarOpen && (<RxCross2 size={30} className="text-[#444A5E] dark:text-gray-400 font-bold shadow-sm rounded-full"/>)}
                </button>
              </span>
              <div className="flex flex-col items-center">
                
                {voterQuery?.isLoading
                  ? <Skeleton.Avatar size={128} active />
                  : <img src={profile_picture} alt="profile" className="w-32 h-32 border-[6px] shadow-md border-[#E5D1FA] dark:border-zinc-700 object-cover rounded-full"/>
                }
                {voterQuery?.isLoading
                  ? <span className='pt-2'>
                      <Skeleton.Input active />
                    </span>
                  : <h3 className="text-md pop-semibold py-2 text-[#414141] dark:text-gray-100 capitalize">{firstname === null ? "John Doe" : firstname + " " + surname}</h3>
                }
              </div>
            </div>

            <ul className="px-3 flex flex-col gap-2 pt-3 pop-medium tracking-wider">
              <NavLink onClick={() => toggleSidebar()} to="/voter/dashboard" className="flex items-center text-sm gap-3 dark:hover:bg-zinc-700 hover:bg-[#C1D0F5] text-gray-700 tracking-wide dark:text-white  px-2 py-2 rounded-md">
                <div className="icon w-6 h-6">
                  <HiHome className="text-gray-400 w-full h-full voter-icon" />
                </div>
                <h2 className="pop-medium">Home</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/cast-vote" className="flex items-center text-sm gap-3 dark:hover:bg-zinc-700 hover:bg-[#C1D0F5] text-gray-700 tracking-wide dark:text-white  px-2 py-2 rounded-md">
                <div className="icon w-6 h-6">
                  <FaVoteYea className="text-gray-400 w-full h-full voter-icon"/>
                </div>
                <h2 className="pop-medium">Cast Vote</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/election-history" className="flex items-center text-sm gap-3 dark:hover:bg-zinc-700 hover:bg-[#C1D0F5] text-gray-700 tracking-wide dark:text-white px-2 py-2 rounded-md">
                <div className="icon w-6 h-6">
                  <RiHistoryLine className="text-gray-400 w-full h-full voter-icon"/>
                </div>
                <h2 className="pop-medium">Election History</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/developers" className="flex items-center text-sm gap-3 dark:hover:bg-zinc-700 hover:bg-[#C1D0F5] text-gray-700 tracking-wide dark:text-white  px-2 py-2 rounded-md">
                <div className="icon w-6 h-6">
                  <HiUserGroup className="text-gray-400 w-full h-full voter-icon"/>
                </div>
                <h2 className="pop-medium">Developers</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/privacy-policy" className="flex items-center text-sm gap-3 dark:hover:bg-zinc-700 hover:bg-[#C1D0F5] text-gray-700 tracking-wide dark:text-white  px-2 py-2 rounded-md">
                <div className="icon w-6 h-6">
                  <BsShieldLockFill className="text-gray-400 w-full h-full voter-icon"/>
                </div>
                <h2 className="pop-medium">Privacy Policy</h2>
              </NavLink>
              <NavLink onClick={() => toggleSidebar()} to="/voter/settings" className="flex items-center text-sm gap-3 dark:hover:bg-zinc-700 hover:bg-[#C1D0F5] text-gray-700 tracking-wide dark:text-white px-2 py-2 rounded-md">
                <div className="icon w-6 h-6">
                  <RiSettings2Fill className="text-gray-400 w-full h-full voter-icon"/>
                </div>
                <h2 className="pop-medium">Settings</h2>
              </NavLink>
            </ul>
            
            <div className="logout-container px-3 bottom-0 mt-8">
            <button onClick={handleLogout} className="logout w-full text-md dark:hover:bg-zinc-700 hover:bg-[#C1D0F5] rounded-md flex justify-between items-center pop-semibold p-5">
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
          
          <div className="logout-container px-3 bottom-0 mt-16">
            <button onClick={handleLogout} className="logout w-full text-md  rounded-md flex justify-between items-center pop-semibold p-5">
              <h3 className="text-gray-700 tracking-wide dark:text-white">Logout</h3>
              <HiOutlineLogout size={25} className="text-gray-400 voter-icon"/>
            </button>
          </div>
          
        </div>

      </nav>

      <div className={`main flex-[2] md:flex-[6] lg:flex-[4] p-5 md:overflow-y-auto bg-[#E5E0FF] dark:bg-[#2B2B2B]`}>
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
