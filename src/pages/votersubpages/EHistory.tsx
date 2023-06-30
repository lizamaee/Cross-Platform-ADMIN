import { useAuthStore } from "../../hooks/state"
import { BsFillSunFill, BsMoonFill } from 'react-icons/bs'
import {FiBell} from 'react-icons/fi'

export default function EHistory() {
  
  const { isNight, switchMode, student_id } = useAuthStore((state) => state)
  return (
    <div>
      <h1 className='text-[#1c295d] dark:text-gray-300 text-xl pt-1 md:pt-3 text-center pop-bold'>Election History</h1>
      {/* NOTIFICATION HEADER */}
      <div className="notification flex justify-end">
        <div className="icons flex items-center bg-white dark:bg-[#313131] shadow-md py-1 px-2 rounded-full justify-center gap-5">
          <div className="bg-[#e1e1e1] dark:bg-[#3a3a3a] rounded-full p-1" onClick={switchMode}>
              { isNight ? ( <BsFillSunFill className='text-gray-400 hover:text-gray-200' size={20}/>) : ( < BsMoonFill className='text-[#a3aed0] hover:text-slate-500' size={20} /> )}
          </div>
          <div className="bell bg-[#e1e1e1] dark:bg-[#3a3a3a] rounded-full p-1">
            <FiBell className='text-[#a3aed0] dark:text-gray-400  dark:hover:text-gray-200 hover:text-slate-500' size={20}/>
          </div>
        </div>
      </div>
      {/* NOTIFICATION HEADER */}

      <div className="history p-5 mt-3 rounded-lg dark:text-gray-300 bg-white dark:bg-[#313131]">
        <div className="elections p-5">
          <div className="h3 pop-medium">No election history.</div>
        </div>
      </div>

    </div>
  )
}
