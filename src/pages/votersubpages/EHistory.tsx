import { useAuthStore } from "../../hooks/state"
import { BsFillSunFill, BsMoonFill } from 'react-icons/bs'
import {FiBell} from 'react-icons/fi'
import {  useHistory } from "../../hooks/queries/useVoter"
import { FaAngleRight } from "react-icons/fa"

export default function EHistory() {
  
  const { isNight, switchMode, student_id } = useAuthStore((state) => state)

  //PARTICIPATED ELECTIONS QUERY HOOK
  const participatedElectionsQuery = useHistory(student_id)
  
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

      <div className="history shadow-md overflow-hidden sm:p-5 mt-3 rounded-lg text-gray-800 dark:text-gray-300 bg-white dark:bg-[#313131]">
        <div className="elections sm:p-5">
          <div className="h3 pop-medium">
            {participatedElectionsQuery?.data?.length === 0 
              ? <h3 className='text-center text-gray-400'>No election history</h3>
              : participatedElectionsQuery?.data?.map((election:any) => (
                
                <div key={election.id} className="election hover:opacity-90 shadow-md pop-medium flex flex-col px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-700">
                  <p className="text-[10px]">Title</p>
                  <div className="title w-full pb-1 flex justify-between items-baseline">
                    <h3 className='pop-semibold'>{election.title}</h3>
                    <FaAngleRight className="w-6 h-6 text-gray-400"/>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-xs pop-light opacity-70 ">
                      {new Date(election.startDate).toLocaleDateString(
                        "en-US",
                        {
                          timeZone: "Asia/Manila",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <h5 className={`capitalize py-1 px-2 rounded-xl text-right text-sm ${election.status === "ended" ? 'text-gray-100 dark:text-gray-300 bg-red-300 dark:bg-red-700' : 'text-gray-100 dark:text-gray-300 bg-sky-300 dark:bg-sky-700'}`}>{election.status}</h5>

                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
