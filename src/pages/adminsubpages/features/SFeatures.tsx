import { useState } from 'react'
import NavBar from '../../../components/NavBar'
import VoterTab from './VoterTab'
import AdminTab from './AdminTab'

export default function SFeatures() {
  const [voterTab, setVoterTab] = useState(true)
  const [adminTab, setAdminTab] = useState(false)

  function handleVoterTab(){
    setVoterTab(true)
    setAdminTab(false)
  }
  function handleAdminTab(){
    setVoterTab(false)
    setAdminTab(true)
  }

  return (
    <div>
      {/* SFEATURES */}
      <NavBar pageName='Special Features'/>
      {/* SFEATURES */}
      <div className="special-features-page py-5">
        {/* PHASE I */}
        <div className="phase1 overflow-hidden flex lg:gap-10 text-gray-700 dark:text-gray-400 pop-semibold text-xs md:text-sm lg:text:md bg-white dark:bg-[#303030] rounded-t-lg ">
          <nav className='flex gap-5'>
            <button onClick={handleVoterTab} className={`voter outline-none tracking-wide ml-3 py-3 ${voterTab ? `text-[#7a6ff0] dark:text-white border-b-2 border-[#7a6ff0]` : ``}`}>Voter</button>
            <button onClick={handleAdminTab} className={`admin outline-none tracking-wide py-3 ${adminTab ? `text-[#7a6ff0] dark:text-white border-b-2 border-[#7a6ff0]` : ``}`}>Admin</button>
          </nav>
        </div>
        <div className="tab-ouput">
          {voterTab && <VoterTab/>}
          {adminTab && <AdminTab/>}
        </div>
        {/* PHASE I */}
      </div>
    </div>
  )
}

