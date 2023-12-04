import { useAuthStore } from "../hooks/state"
import { CgInfo } from "react-icons/cg";
import {BsFillSunFill,BsMoonFill, BsPersonCircle} from 'react-icons/bs'
import { Link } from "react-router-dom";
import { useState } from "react";
import DeleteMe from "./DeleteMe";

interface navProp {
    pageName?: string;
}

export default function NavBar({ pageName}: navProp) {
  const [isOpenCredit, setIsOpenCredit] = useState(false);
  const {  isNight, switchMode } = useAuthStore((state) => state)

  return (
    <div className="navigation flex-1 flex md:block justify-center">
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
      <h3 className='pop-semibold hidden md:block text-[0.5rem] md:text-[0.7rem] text-sky-800 dark:text-sky-200'>Home / {pageName}</h3>
      <div className="divider flex justify-between">
        <h1 className='text-xl md:text-3xl pop-semibold text-sky-950 dark:text-sky-100'>{pageName}</h1>
        <div className="hero hidden md:flex gap-5 bg-white dark:bg-[#333333] items-center py-1 px-3 rounded-full">
          <span onClick={switchMode}>
            { isNight ? ( <BsFillSunFill className='text-gray-400 hover:text-gray-200' size={18}/>) : ( < BsMoonFill className='text-[#a3aed0] hover:text-slate-500' size={18} /> )}
          </span>

          <span onClick={() => setIsOpenCredit(true)} className='flex cursor-pointer'>
            <span style={{ display: 'inline-block' }}>
              <CgInfo className="text-[#a3aed0]" size={23} />
            </span>
          </span>

          <span>
            <Link to='/admin/settings'>
              < BsPersonCircle className='text-[#a3aed0]'  size={20} />
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
