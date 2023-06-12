import { useState } from 'react'
import NavBar from '../../../components/NavBar'
import AccountTab from './AccountTab'

export default function SFeatures() {
  const [account, setAccount] = useState(true)

  function handleAccountTab(){
    setAccount(true)
  }

  return (
    <div>
      {/* SFEATURES */}
      <NavBar pageName='Settings'/>
      {/* SFEATURES */}
      <div className="special-features-page md:flex md:gap-20 pt-10">
        {/* PHASE I */}
        <div className="phase1 flex text-gray-700 dark:text-gray-400 pop-semibold text-xs md:text-sm lg:text:md rounded-t-lg ">
          <nav className='flex flex-col flex-grow-0 border-r-[1px] dark:border-zinc-700 pr-3 md:pr-7 gap-3'>
            <button onClick={handleAccountTab} className={`election outline-none tracking-wide  p-3 ${account ? `text-[#7a6ff0] bg-white dark:bg-transparent border-[1px] border-gray-300 dark:border-zinc-700 rounded-full` : ``}`}>Account Settings</button>
          </nav>
        </div>
        <div className="tab-ouput flex-grow">
          {account && <AccountTab/>}
        </div>
        {/* PHASE I */}
      </div>
    </div>
  )
}

