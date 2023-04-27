
import { useState } from 'react'
import NavBar from '../../components/NavBar'
import ElectionTab from '../../components/ElectionTab'
import OrganizationTab from '../../components/OrganizationTab'
import CandidateTab from '../../components/CandidateTab'
import PositionTab from '../../components/PositionTab'

export default function Election() {
  const [electionTab, setElectionTab] = useState(true)
  const [organizationTab, setOrganizationTab] = useState(false)
  const [positionTab, setPositionTab] = useState(false)
  const [candidateTab, setCandidateTab] = useState(false)


  function handleElectionTab(){
    setElectionTab(true)
    setOrganizationTab(false)
    setPositionTab(false)
    setCandidateTab(false)
  }
  function handleOrganizationTab(){
    setElectionTab(false)
    setOrganizationTab(true)
    setPositionTab(false)
    setCandidateTab(false)
  }
  function handlePositionTab(){
    setElectionTab(false)
    setOrganizationTab(false)
    setPositionTab(true)
    setCandidateTab(false)
  }
  function handleCandidateTab(){
    setElectionTab(false)
    setOrganizationTab(false)
    setPositionTab(false)
    setCandidateTab(true)
  }


  return (
    <div>
      {/* ELECTION */}
        <NavBar pageName='Election'/>
      {/* ELECTION */}
      <div className="election-page py-5">
        {/* PHASE I */}
        <div className="phase1 flex lg:gap-10 text-gray-700 pop-semibold text-xs md:text-sm lg:text:md bg-white rounded-t-lg ">
          <nav className='flex gap-5'>
            <button onClick={handleElectionTab} className={`election outline-none tracking-wide ml-3 py-3 ${electionTab ? `text-[#7a6ff0] border-b-2 border-[#7a6ff0]` : ``}`}>Election</button>
            <button onClick={handleOrganizationTab} className={`organization outline-none tracking-wide py-3 ${organizationTab ? `text-[#7a6ff0] border-b-2 border-[#7a6ff0]` : ``}`}>Organization</button>
            <button onClick={handlePositionTab} className={`posion outline-none tracking-wide py-3 ${positionTab ? `text-[#7a6ff0] border-b-2 border-[#7a6ff0]` : ``}`}>Position</button>
            <button onClick={handleCandidateTab} className={`candidate outline-none tracking-wide py-3 ${candidateTab ? `text-[#7a6ff0] border-b-2 border-[#7a6ff0]` : ``}`}>Candidate</button>
          </nav>
        </div>
        <div className="tab-ouput">
          {electionTab && <ElectionTab/>}
          {organizationTab && <OrganizationTab/>}
          {positionTab && <PositionTab/>}
          {candidateTab && <CandidateTab/>}
        </div>
        {/* PHASE I */}
      </div>
    </div>
  )
}
