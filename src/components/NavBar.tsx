import { useAuthStore } from "../hooks/state"
import { CgInfo } from "react-icons/cg";
import {BsFillSunFill,BsMoonFill, BsPersonCircle} from 'react-icons/bs'
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { useRef } from "react";

interface navProp {
    pageName: string;
}

export default function NavBar({ pageName}: navProp) {

    const {  isNight, switchMode } = useAuthStore((state) => state)

  return (
    <div className="navigation flex-1 flex md:block justify-center">
    <h3 className='pop-semibold hidden md:block text-[0.5rem] md:text-[0.7rem] text-sky-800 dark:text-sky-200'>Home / {pageName}</h3>
    <div className="divider flex justify-between">
      <h1 className='text-xl md:text-3xl pop-semibold text-sky-950 dark:text-sky-100'>{pageName}</h1>
      <div className="hero hidden md:flex gap-5 bg-white dark:bg-[#333333] items-center py-1 px-3 rounded-full">
        <span onClick={switchMode}>
          { isNight ? ( <BsFillSunFill className='text-gray-400 hover:text-gray-200' size={18}/>) : ( < BsMoonFill className='text-[#a3aed0] hover:text-slate-500' size={18} /> )}
          
        </span>

        <span className='flex'>
          <Tooltip
            placement="bottom"
            title="This system is developed by Menard M. Pajares for CICT department of Taguig City University."
          >
            <span style={{ display: 'inline-block' }}>
              <CgInfo className="text-[#a3aed0]" size={23} />
            </span>
          </Tooltip>
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
