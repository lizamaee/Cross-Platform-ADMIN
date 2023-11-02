import { useAuthStore } from "../../hooks/state"
import { BsFillSunFill, BsFillTrophyFill, BsMoonFill } from 'react-icons/bs'
import {FiBell} from 'react-icons/fi'
import {  useHistory, useSingleBallotResult} from "../../hooks/queries/useVoter"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"
import { useState } from "react"
import { axiosPrivate } from "../../api/axios"
import { message } from "antd"
import VoteModal from "../../components/VoteModal"
import {winner} from "../../BMAlgorithm"

type Position = {
  id: string;
  position: string;
  requiredWinner: string;
  candidates: [];
  voted_candidates: string[];
};

export default function EHistory() {
  const { isNight, switchMode, student_id } = useAuthStore((state) => state)
  const [isOrgSliderOpen, setIsOrgSliderOpen] = useState<boolean>(false)
  const [gettedOrganizations, setGettedOrganizations] = useState([])
  const [openModalResult, setOpenModalResult] = useState<boolean>(false);

  //PARTICIPATED ELECTIONS QUERY HOOK
  const participatedElectionsQuery = useHistory(student_id)

  const {
    mutate: getSingleResultBallot,
    isLoading: isResultBallotLoading,
    data: resultBallotData,
  } = useSingleBallotResult()

  
  const handleSingleHistory = async (id: string, status: string) => {
    if(status === 'ended') {
      //get election results from db
      setIsOrgSliderOpen(true)
    }
    await getAllOrganizationsOfAnElection(id)
  }

  //GET ALL ORGANIZATIONS BASED ON SINGLE ELECTION ID
  const getAllOrganizationsOfAnElection = async (election_id: string) => {

    await axiosPrivate.get(`/election/elec-organizations/${election_id}`)
    .then((response) => {
      setGettedOrganizations(response.data)
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
          message.open({
            type: 'error',
            content: 'Server Unavailable',
            className: 'custom-class pop-medium',
            duration: 2.5,
          });
        } else if(error.response.data?.message){
          message.open({
            type: 'error',
            content: `${error.response.data.message}`,
            className: 'custom-class pop-medium',
            duration: 2.5,
          });
        }else {
          // Handle other errors
          error.response.data.errors?.map((err:any) => {
            message.open({
              type: 'error',
              content: `${err.msg}`,
              className: 'custom-class pop-medium',
              duration: 2.5,
            })
          })
        }
      })
    }

  const resultHandler = async (ballots:any) => {
    getSingleResultBallot(ballots.id)
    setOpenModalResult(true)
  }

  
  return (
    <div>
      <h1 className='text-[#1c295d] dark:text-gray-300 text-xl pt-1 md:pt-3 text-center pop-bold'>Election History</h1>
      {/* NOTIFICATION HEADER */}
      <div className="notification flex justify-end">
        <div className="icons flex items-center bg-white dark:bg-[#313131] shadow-md py-1 px-2 rounded-full justify-center gap-5">
          <div className="bg-[#e1e1e1] dark:bg-[#3a3a3a] rounded-full p-1" onClick={switchMode}>
              { isNight ? ( <BsFillSunFill className='text-gray-400 hover:text-gray-200' size={20}/>) : ( < BsMoonFill className='text-[#a3aed0] hover:text-slate-500' size={20} /> )}
          </div>
        </div>
      </div>
      {/* NOTIFICATION HEADER */}

      <div className="history h-96 relative shadow-md overflow-hidden p-2 sm:p-5 mt-3 rounded-lg text-gray-800 dark:text-gray-300 bg-white dark:bg-[#313131]">
        <div className={`organizations-slider bg-gray-200 dark:bg-zinc-700 w-full h-full absolute top-0 left-0 z-10 ${ isOrgSliderOpen ? 'translate-x-0' : 'translate-x-full'} transition-all duration-200`}>
          <div className="close flex">
            <button onClick={() => setIsOrgSliderOpen(false)} className="p-5 rounded-xl">
              <FaAngleLeft className="w-6 h-6 text-gray-400 dark:text-gray-300"/>
            </button>
          </div>
          <h3 className="text-sm text-center pop-bold">Organizations</h3>
          <div className="organizations p-3">
            <div className="orgs-wrapper grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gettedOrganizations?.map((org:any) => (
                <div key={org.id} onClick={() => resultHandler(org.ballots[0])} className="orgs cursor-pointer shadow-sm flex flex-col justify-center items-center p-3 rounded-md bg-gray-300 dark:bg-zinc-600">
                  <h3 className="text-center text-gray-800 dark:text-gray-300 pop-semibold text-sm">{org.org_name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="elections sm:p-5">
          <div className="h3 pop-medium">
            {participatedElectionsQuery?.data?.length === 0 
              ? <h3 className='text-center text-gray-400'>No election history</h3>
              : participatedElectionsQuery?.data?.map((election:any) => (
                
                <button disabled={election.status === "ongoing"} key={election.id} onClick={() => handleSingleHistory(election.id, election.status)} className={`election mb-3 w-full hover:opacity-90 shadow-md pop-medium flex flex-col px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-700 ${election.status === "ended" ? 'cursor-pointer' : 'cursor-not-allowed' }`}>
                  <p className="text-[10px]">Title</p>
                  <div className="title w-full pb-1 flex justify-between items-baseline">
                    <h3 className='pop-semibold'>{election.title}</h3>
                    <FaAngleRight className="w-6 h-6 text-gray-400 dark:text-gray-300"/>
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
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULT BALLOT MODAL */}
      <VoteModal
        title="Winner"
        open={openModalResult}
        onClose={() => setOpenModalResult(false)}
      >
        <div className="result-ballot">
          {isResultBallotLoading ? (
            <div
              className={`result gap-10 p-5 mb-10 bg-gradient-to-t  from-blue-400 to-red-400 dark:bg-gradient-to-br dark:from-[#323356] dark:to-[#563232] shadow-2xl rounded-lg animate-pulse`}
            >
              <h3 className="pop-semibold bg-gray-100 overflow-hidden dark:bg-zinc-500 rounded-lg mb-2 h-10"></h3>
              <div className="candidates-result flex flex-col gap-3">
                <div className="candidate bg-[#E5E0FF] dark:bg-[#313131]  sm:pr-6 sm:rounded-l-[5rem] rounded-xl sm:rounded-br-[3rem] flex items-center justify-between flex-col sm:flex-row">
                  <div className="candidate-profile relative flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                    <div className="gradientball w-[54px] h-[54px] sm:w-20 sm:h-20 bg-gradient-to-t from-blue-500 to-red-500 rounded-full absolute "></div>
                    <div className="object-cover z-20 w-[50px] h-[50px] sm:w-[74px] sm:h-[74px] mt-[2px]  sm:ml-[3px] sm:mt-0 rounded-full" />
                    <h3 className=""></h3>
                  </div>
                  <div className="candidate-votes flex flex-col items-center">
                    <h4 className=""></h4>
                    <h5 className=""></h5>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            resultBallotData
              ?.sort((a: any, b: any) => a.position_order - b.position_order)
              .map((result: Position, index: any) => (
                <div
                  key={index}
                  className={`result gap-10 p-2 mb-5 bg-gradient-to-t  from-blue-400 to-red-400 dark:bg-gradient-to-br dark:from-[#323356] dark:to-[#563232] shadow-2xl rounded-lg`}
                >
                  <h3 className="pop-semibold bg-gray-100 overflow-hidden dark:bg-gray-600 dark:text-gray-100 text-gray-800 text-center py-2 sm:py-3 rounded-t-lg text-sm sm:text-lg">
                    {result.position}
                  </h3>
                  <div className="candidates-result flex flex-col gap-3">
                    {Number(result?.requiredWinner) > 1
                        ? result?.candidates?.sort((a: any, b: any) => b.count - a.count).slice(0, Number(result.requiredWinner))
                          .map((candidate: any, index: any) => (
                            <div
                              key={index}
                              className="candidate bg-[#E5E0FF] dark:bg-[#313131]  sm:py-3 sm:px-10 rounded-sm flex items-center justify-between dark:text-gray-100 flex-col sm:flex-row"
                            >
                              <div className="candidate-profile relative flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                                <h3 className="pop-semibold text-xs sm:text-sm text-center sm:text-left dark:text-gray-200 md:text-lg">
                                  {candidate.fullname}
                                </h3>
                              </div>
                              <div className="candidate-votes flex flex-col items-center">
                                  <BsFillTrophyFill className="w-6 h-6 text-yellow-400 dark:text-yellow-300"/>
                              </div>
                            </div>
                          ))
                        : result?.candidates?.filter((candidate:any) => winner(result?.voted_candidates)?.includes(candidate.id)).length > 1
                          ? result?.candidates?.filter((candidate:any) => winner(result?.voted_candidates)?.includes(candidate.id)).map((candidate: any, index: any) => (
                              <div
                                key={index}
                                className="candidate bg-[#E5E0FF] dark:bg-[#313131]  py-2 sm:py-3 sm:px-10 rounded-sm flex items-center justify-between dark:text-gray-100 flex-col-reverse sm:flex-row"
                              >
                                <div className="candidate-profile relative flex flex-col sm:flex-row items-center sm:justify-between gap-2 md:gap-6">
                                  <h3 className="pop-semibold text-xs sm:text-sm text-center sm:text-left dark:text-gray-200 md:text-lg">
                                    {candidate.fullname}
                                  </h3>
                                  <h3 className="pop-regular text-xs">(tie {candidate.count} Vote)</h3>
                                </div>
                                <div className="candidate-votes flex flex-col items-center">
                                    <BsFillTrophyFill className="w-6 h-6 text-gray-400 dark:text-gray-300"/>
                                </div>
                              </div>
                          ))
                          : result?.candidates?.filter((candidate:any) => winner(result?.voted_candidates)?.includes(candidate.id)).map((candidate: any, index: any) => (
                            <div
                              key={index}
                              className="candidate py-2 bg-[#E5E0FF] dark:bg-[#313131]  sm:py-3 sm:px-10 rounded-sm flex items-center justify-between dark:text-gray-100  flex-col-reverse sm:flex-row"
                            >
                              <div className="candidate-profile relative flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                                <h3 className="pop-semibold text-xs sm:text-sm text-center sm:text-left dark:text-gray-200 md:text-lg">
                                  {candidate.fullname}
                                </h3>
                                <h3 className="pop-regular text-xs">(won {candidate.count} Vote)</h3>
                              </div>
                              <div className="candidate-votes flex flex-col items-center">
                                  <BsFillTrophyFill className="w-6 h-6 text-yellow-400 dark:text-yellow-300"/>
                              </div>
                            </div>
                        ))
                    }
                  </div>
                </div>
              ))
          )}
        </div>
      </VoteModal>

    </div>
  )
}
