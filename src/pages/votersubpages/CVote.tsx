import { BsFillChatSquareDotsFill, BsFillSunFill, BsMoonFill } from "react-icons/bs";
import { FiBell } from "react-icons/fi";
import { useAuthStore } from "../../hooks/state";
import { useCastVote, useOngoingElections } from "../../hooks/queries/useVoter";
import { useState } from "react";
import VoteModal from "../../components/VoteModal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Tag, message } from "antd";

type Position = {
  id:string;
  position: string;
  requiredWinner: string;
  candidates: [];
}

export default function CVote() {
  const [activeOrgs, setActiveOrgs] = useState([])
  const [isActiveOrgs, setIsActiveOrgs] = useState<boolean>(false)
  const { isNight, student_id, switchMode} = useAuthStore((state) => state)
  const [selectedOrganizationID, setSelectedOrganizationID] = useState<string>('') 
  const [selectedElectionID, setSelectedElectionID] = useState<string>('')

  //ONGOING ELECTIONS QUERY HOOK
  const ongoingElectionsQuery = useOngoingElections()

  //SHOW ORGANIZATIONS
  const handleActiveOrganizations = (id: string) => {
    setSelectedElectionID(id)
    const orgs = ongoingElectionsQuery?.data?.filter((elec:any) => elec.id === id)
    setActiveOrgs(orgs[0]?.organizations);
    setIsActiveOrgs(true)
  }

  //GET BALLOT
  const axiosPrivate = useAxiosPrivate()
  //Vote Modal state
  const [openModal, setOpenModal] = useState<boolean>(false)

  const [selectedCandidates, setSelectedCandidates] = useState({});

  const [positions, setPositions] = useState<Position[]>([]);
  
  const handleCandidateSelection = (event: React.ChangeEvent<HTMLInputElement>, positionName: string) => {
    const selectedCandidateId = event.target.value;
    const position = positions.find((pos) => pos.position === positionName);
  
    if (!position) {
      console.error(`Position '${positionName}' not found.`);
      return;
    }
  
    setSelectedCandidates((prevSelectedCandidates:any) => {
      const prevSelectedCandidatesForPosition = prevSelectedCandidates[positionName] || [];
      const isSelected = prevSelectedCandidatesForPosition.includes(selectedCandidateId);
      let updatedSelectedCandidatesForPosition;
  
      if (isSelected) {
        // Deselect the candidate
        updatedSelectedCandidatesForPosition = prevSelectedCandidatesForPosition.filter((id:any) => id !== selectedCandidateId);
      } else {
        // Check if the selection limit has been reached
        const selectionLimitReached = prevSelectedCandidatesForPosition.length >= position.requiredWinner;
  
        if (selectionLimitReached) {
          // You can display an error message or take appropriate action here
          message.open({
            type: 'warning',
            content: `You can only select ${position.requiredWinner} candidate(s) for ${positionName}`,
            className: 'custom-class pop-medium',
            duration: 2.5,
          });
          return prevSelectedCandidates;
        }
  
        // Select the candidate
        updatedSelectedCandidatesForPosition = [...prevSelectedCandidatesForPosition, selectedCandidateId];
      }
  
      return {
        ...prevSelectedCandidates,
        [positionName]: updatedSelectedCandidatesForPosition,
      };
    });
  };

  const renderCandidates = (position:any, selectedCandidates:any) => {
    const candidateElements = position.candidates.map((candidate:any) => (
      <label htmlFor={`candidate_${candidate.id}`} key={candidate.id} className="candidate flex flex-col mb-3 bg-white dark:bg-[#313131] shadow-md p-4 rounded-2xl cursor-pointer">
        {/* Render candidate information */}
        <div className="c flex gap-5">
          <div className="candidate-profile py-2">
            <img
              src={candidate.imageUrl}
              alt={candidate.fullname + " " + "Profile"}
              className="object-cover border-[4px] w-24 h-24 rounded-full"
            />
          </div>
          <div className="candidate-about flex flex-col flex-grow">
            <h6 className="text-right dark:bg-[#313131] text-xs">
              <Tag color="magenta">{candidate.party}</Tag>
            </h6>
            <div className="name-btn flex flex-grow items-center gap-2 pb-3">
              <h4 className="pop-medium text-sm md:text-md capitalize dark:text-gray-200">{candidate.fullname}</h4>
              <div className="vote">
                <input
                  type="radio"
                  id={`candidate_${candidate.id}`}
                  value={candidate.id}
                  checked={selectedCandidates[position.position]?.includes(candidate.id)}
                  onChange={(event:any) => handleCandidateSelection(event, position.position)}
                />
              </div>
              <div className="platform flex flex-col items-center flex-grow pb-3">
                <div className="platform-btn flex justify-center">
                  <button className="px-3 py-1 bg-slate-100 dark:bg-zinc-700 dark:text-gray-300 rounded-md pop-regular text-xs">
                    Platform
                  </button>
                </div>
                <p className="text-xs pt-2 dark:text-gray-300 ">
                  {candidate.platform}
                </p>
              </div>
            </div>
           
          </div>
        </div>
        
        {/* Render other candidate details */}
      </label>
    ));
  
  
    return candidateElements;
  };
  

  const [resultBallot, setResultBallot] = useState<Position[]>([])
  
  const [openModalResult, setOpenModalResult] = useState<boolean>(false)


  const handleGetBallot = async (ballots: any, orgId:string) => {
    try {
      setSelectedOrganizationID(orgId)
      const isVoted = await axiosPrivate.get('/election/check/check-if-voted-organization', {params: {
        student_id,
        organizationId: orgId
      }})

      if(isVoted?.data?.length === 0){
        const response = await axiosPrivate.get(`/seat/get-all-positions/${ballots.id}`);
        const data = response.data;
        setPositions(data)
        // setBallotID(ballots.id);
        setOpenModal(true);
      }else{
        // message.open({
        //   type: 'warning',
        //   content: "You already voted there :)",
        //   className: 'custom-class pop-medium',
        //   duration: 2.5,
        // });
        const response = await axiosPrivate.get(`/seat/get-all-positions/${ballots.id}`);
        const data = response.data;
        setResultBallot(data)
        setOpenModalResult(true);
      }
    } catch (error) {
      // Handle error here
      console.error(error);
    }
  }

  //CAST VOTE HOOK
  const {mutate:castVote, isLoading: isCastingVote} = useCastVote()

  //CAST VOTE FUNCTION
  const handleCastVote = (e:any) => {
    e.preventDefault()
    
    const idArray = Object.values(selectedCandidates).flatMap(ids => ids)

     // Check if the user has voted for all positions
    const hasVotedForAllPositions = positions?.every((position) =>
      selectedCandidates.hasOwnProperty(position.position)
    );

    if (hasVotedForAllPositions) {
      // Proceed with submitting the votes
      castVote({student_id, organization_id: selectedOrganizationID, candidate_ids: idArray})

      if(!isCastingVote){
        setOpenModal(false)
      } 
    } else {
      // Display an error message or take appropriate action
      message.open({
        type: 'warning',
        content: 'Please vote to all positions before sending votes.',
        className: 'custom-class pop-medium',
        duration: 2.5,
      });
    }
    
  }



  return (
    <div>
      <h1 className='text-[#1c295d] dark:text-gray-300 text-xl pt-1 md:pt-5 text-center pop-bold'>Cast Vote</h1>
      {/* NOTIFICATION HEADER */}
      <div className="notification pt-3 flex justify-end">
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

      {/* SHOW ONGOING ELECTIONS */}
      {ongoingElectionsQuery?.isLoading
        ? <div className="loadin flex flex-col gap-3 items-center dark:text-gray-400 justify-center mt-6">
            <h3 className='pop-semibold'>Loading...</h3>
          </div>
        : <div className="elections-body shadow-md bg-white dark:bg-[#313131] mt-3 rounded-lg">
              <div className="ongoing flex justify-between p-5">
                <h4 className='pop-medium dark:text-gray-300 text-md md:text-lg'>Ongoing Elections</h4>
                <button>
                  <BsFillChatSquareDotsFill className='text-[#7268EF] w-7 h-7 md:w-8 md:h-8' />
                </button>
              </div>

              <div className="elections p-5">
                {ongoingElectionsQuery?.data === undefined
                  ? <div className="no-ongoingx">
                      <div className="h4 text-gray-400 pop-regular text-sm text-center ">No ongoing Election.</div>
                    </div>
                  : <div className="elections-cards grid md:grid-cols-3 lg:grid-cols-4 gap-5">
                      { ongoingElectionsQuery?.data?.map((ongoing:any, index:any) => (
                          <div key={index} onClick={() => handleActiveOrganizations(ongoing.id)
                          } className="ongoing cursor-pointer dark:bg-zinc-700 bg-gray-100 shadow-md rounded-xl overflow-hidden">
                            <img src="https://shorturl.at/oqs68" alt="cict logo" className='object-cover w-full h-32' />
                            <h4 className='text-center py-3 pop-semibold dark:text-gray-200 text-lg'>{ongoing.title}</h4>
                            {/* DATE DISPLAY */}
                            <div className="dates flex text-xs gap-3 items-center justify-center text-gray-600 dark:text-gray-400 pb-5 pop-regular">
                              <p className="">
                                {new Date(ongoing.startDate).toLocaleDateString("en-US", {
                                  timeZone: "Asia/Manila",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              <span>-</span>
                              <p className="text-right">
                                {new Date(ongoing.endDate).toLocaleDateString("en-US", {
                                  timeZone: "Asia/Manila",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            {/* DATE DISPLAY */}
                          </div>
                      ))}
                  </div>
                }
              </div>
            </div>
      }
      {/* SHOW ONGOING ELECTIONS */}

      {/* SHOW ACTIVE ORGANIZATIONS ELECTION */}
      {isActiveOrgs && (
        <div className="active-organization rounded-lg shadow-xl mt-4 bg-white dark:bg-[#313131] p-5">
          <h2 className="py-4 text-center dark:text-gray-200 pop-semibold">Active Organizations</h2>
          <div className="all-org grid p-5 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {activeOrgs?.length === 0
              ? <h3>No Active Organizations</h3>
              : activeOrgs?.map((org:any, index: any) => (
                <div key={index} onClick={() => handleGetBallot(org.ballots[0], org.id)} className="org bg-gray-100 dark:bg-zinc-700 flex flex-col p-4 shadow-md rounded-2xl items-center">
                  <img src={org.logo_url} alt={org.org_name + " "+ "Logo"} className='object-cover w-24 h-24 rounded-full' />
                  <h2 className="pop-medium pt-3 dark:text-gray-300 text-sm">{org.org_name}</h2>
                  {/* DATE DISPLAY */}
                  <div className="dates flex text-xs gap-3 pt-4 items-center justify-center text-gray-600 dark:text-gray-400 pb-2 pop-regular">
                    <p className="">
                      {new Date(org.startDate).toLocaleDateString("en-US", {
                        timeZone: "Asia/Manila",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <span>-</span>
                    <p className="text-right">
                      {new Date(org.endDate).toLocaleDateString("en-US", {
                        timeZone: "Asia/Manila",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {/* DATE DISPLAY */}
                </div>
              ))
            }
          </div>
        </div>
      )}
      {/* SHOW ACTIVE ORGANIZATIONS ELECTION */}


      {/* CAST VOTE MODAL */}
      <VoteModal open={openModal} onClose={() => setOpenModal(false)} >
            <div className="Ballot p-5">
              <h1 className="text-center text-xl dark:text-gray-100 pb-5 pop-bold uppercase tracking-[.4rem]">Ballot</h1>
              <form onSubmit={handleCastVote}>
                {positions?.map((position: Position) => (
                  <div key={position.position} className={`position gap-10 p-5 mb-10  odd:bg-blue-100 dark:odd:bg-[#343256] even:bg-red-100 dark:even:bg-[#563232] shadow-2xl rounded-lg`}>
                    <h3 className="pop-semibold bg-gray-500 dark:bg-gray-600 text-white text-center py-3 rounded-lg mb-2 text-lg">
                      {position.position} 
                      <span className="text-gray-100 pop-medium text-sm tracking-widest">{ position.requiredWinner === '1' ? "  ( Select " + position.requiredWinner + " candidate )" :  "  ( Select " + position.requiredWinner + " candidates ) "}</span>
                    </h3>
                    {renderCandidates(position, selectedCandidates)}
                  </div>
                ))}

                <div className="btn flex justify-center px-10 py-6">
                  {isCastingVote
                    ? <button disabled={isCastingVote} className="bg-blue-600 text-lg text-white pop-semibold py-3 px-6 rounded-full">Casting Vote...</button>
                    : <button disabled={isCastingVote} type="submit" className="bg-blue-600 text-lg text-white pop-semibold py-3 px-6 rounded-full">Cast Vote</button>
                  }
                  
                </div>
              </form>

            </div>
      </VoteModal>
      {/* CAST VOTE MODAL */}


      {/* RESULT BALLOT MODAL */}
      <VoteModal open={openModalResult} onClose={() => setOpenModalResult(false)}>
        <div className="result-ballot">
          <h1 className="text-center text-xl dark:text-gray-100 pb-5 pop-bold uppercase tracking-[.4rem]">Result</h1>
          {resultBallot?.map((result: Position, index: any) => (
            <div key={index} className={`result gap-10 p-5 mb-10  odd:bg-blue-100 dark:odd:bg-[#242526] even:bg-red-100 dark:even:bg-[#3a3b3c] shadow-2xl rounded-lg`}>
              <h3 className="pop-semibold bg-gray-500 dark:bg-gray-700 text-white text-center py-3 rounded-lg mb-2 text-lg">
                {result.position} 
              </h3>
              <div className="candidates-result flex flex-col gap-3">
                {result?.candidates?.sort((a: any, b: any) => b.count - a.count).map((candidate:any, index:any) => (
                  <div key={index} className="candidate bg-white dark:bg-[#313131] py-3 px-6 rounded-xl flex items-center justify-between dark:text-gray-100">
                    <div className="candidate-profile py-2 flex items-center gap-2 md:gap-6">
                      <img
                        src={candidate.imageUrl}
                        alt={candidate.fullname + " " + "Profile"}
                        className="object-cover w-10 h-10 rounded-full"
                      />
                      <h3 className="pop-semibold text-sm md:text-md">{candidate.fullname}</h3>
                    </div>
                    <div className="candidate-votes flex flex-col items-center">
                      <h4 className="pop-bold text-xl" >{candidate.count}</h4>
                      <h5 className="pop-semibold text-sm">votes</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </VoteModal>
      {/* RESULT BALLOT MODAL */}


    </div>
  )
}
