import {
  BsFillSunFill,
  BsMoonFill,
} from "react-icons/bs";
import { useAuthStore } from "../../hooks/state";
import {
  useCastVote,
  useSingleBallotResult,
} from "../../hooks/queries/useVoter";
import { useEffect, useState } from "react";
import VoteModal from "../../components/VoteModal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Tag, Tooltip, message } from "antd";
import cict from "../../images/cict.jpg";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../../socket";
import useSound from "use-sound";
import bubleSoundEffect from "../../assets/buble.mp3"
import { FaInfoCircle } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

type Position = {
  id: string;
  position: string;
  requiredWinner: string;
  candidates: [];
  voted_candidates: [];
};

type Candidate = {
  id: string;
  fullname: string;
  platform: string;
  party: string;
  imageUrl: string;
};

export default function CVote() {
  const [activeOrgs, setActiveOrgs] = useState([]);
  const [singleOrgResult, setSingleOrgResult] = useState<any>([]);
  const [isActiveOrgs, setIsActiveOrgs] = useState<boolean>(false);
  const [isPlatformVisible, setIsPlatformVisible] = useState<boolean>(false);
  const { isNight, student_id, switchMode, events } = useAuthStore((state) => state);
  const [selectedOrganizationID, setSelectedOrganizationID] =
    useState<string>("");
  const [bubble] = useSound(bubleSoundEffect, {volume: 0.35})

  useEffect(() => {
    function singleResultEvent(value:any){
      setSingleOrgResult(value)
    }
    socket.on("single-org-result", singleResultEvent)

    return () => {
      socket.off('single-org-result', singleResultEvent);
    };
  }, [socket])

  useEffect(() => {
    bubble()
  }, [singleOrgResult, bubble])

  //SHOW ORGANIZATIONS
  const handleActiveOrganizations = async (id: string) => {
    const orgs = events[0]?.filter(
      (elec: any) => elec.id === id
      );
      setActiveOrgs(orgs[0]?.organizations);
      setIsActiveOrgs(true);
    
    //Only append once
    await appendElectionToUser(id)
    };

    const queryClient = useQueryClient()
    
  //APPEND CLICKED ELECTION TO USER
  const appendElectionToUser = async (election_id: string) => {
    const connectElectionToVoter = {
      election_id,
      student_id
    }

    await axiosPrivate.patch('election/connect-voter-election', connectElectionToVoter)
    .then((response) => {
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
      });
      await queryClient.invalidateQueries({
        queryKey: ['history'],
        exact: true
      })
    }
    
    //GET BALLOT
    const axiosPrivate = useAxiosPrivate();
  //Vote Modal state
  const [openModal, setOpenModal] = useState<boolean>(false);

  //const [selectedCandidates, setSelectedCandidates] = useState<any>({});
  const [selectedCandidates, setSelectedCandidates] = useState<{
    [positionId: string]: string[];
  }>({});

  const handleCandidateSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    positionName: string,
    positionid: string
  ) => {
    const selectedCandidateId = event.target.value;
    const position = ballotData?.find((pos: any) => pos.id === positionid);

    if (!position) {
      console.error(`Position '${positionName}' not found.`);
      return;
    }

    setSelectedCandidates((prevSelectedCandidates: any) => {
      const prevSelectedCandidatesForPosition =
        prevSelectedCandidates[positionid] || [];
      const isSelected =
        prevSelectedCandidatesForPosition.includes(selectedCandidateId);
      let updatedSelectedCandidatesForPosition;

      if (isSelected) {
        // Deselect the candidate
        updatedSelectedCandidatesForPosition =
          prevSelectedCandidatesForPosition.filter(
            (id: string) => id !== selectedCandidateId
          );
      } else {
        // Check if the selection limit has been reached
        const selectionLimitReached =
          prevSelectedCandidatesForPosition.length >= position.requiredWinner;

        if (selectionLimitReached) {
          // You can display an error message or take appropriate action here
          message.open({
            type: "warning",
            content: `You can only select ${position.requiredWinner} candidate(s) for ${positionName}`,
            className: "custom-class pop-medium",
            duration: 2.5,
          });
          return prevSelectedCandidates;
        }

        // Select the candidate
        updatedSelectedCandidatesForPosition = [
          ...prevSelectedCandidatesForPosition,
          selectedCandidateId,
        ];
      }

      return {
        ...prevSelectedCandidates,
        [positionid]: updatedSelectedCandidatesForPosition,
      };
    });
  };

  const renderCandidates = (position: any, selectedCandidates: any) => {
    const candidateElements = position.candidates.map(
      (candidate: Candidate) => (
        <SwiperSlide key={candidate.id} className="bg-[#C7C7C7] dark:bg-[#55463e] w-40 relative rounded-2xl">
          <label
          htmlFor={`candidate_${candidate.id}`}
          key={candidate.id}
          className="candidate mb-3 w-full h-full shadow-md p-2 sm:p-4 rounded-2xl cursor-pointer"
          >
            <h6 className="absolute top-0 right-0 text-xs">
              <Tag color="magenta" style={{ marginRight: 0 }}>
                {candidate.party}
              </Tag>
            </h6>
            {/* Render candidate information */}
            <div className="h-full rounded-2xl">
              <div className="candidate-profile mt-5 sm:mt-0 w-full h-full flex-col flex items-center">
                <img
                  src={candidate.imageUrl}
                  alt={candidate.fullname + " " + "Profile"}
                  className={`object-cover w-20 h-20 rounded-full ${
                    selectedCandidates[position.id]?.includes(candidate.id)
                      ? 'border-blue-500 border-4'
                      : 'border-transparent'
                  }`}
                />
                <h4 className="pop-medium text-sm md:text-base md:py-2 capitalize dark:text-gray-200 text-center">
                  {candidate.fullname}
                </h4>
                <div className="vote">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    id={`candidate_${candidate.id}`}
                    value={candidate.id}
                    checked={
                      selectedCandidates[position.id]?.includes(candidate.id) ||
                      false
                    }
                    onChange={(event: any) =>
                      handleCandidateSelection(
                        event,
                        position.position,
                        position.id
                      )
                    }
                  />
                </div>
              </div>
              <div className="candidate-about flex flex-col flex-grow">
                <div className="name-btn flex flex-col sm:flex-row flex-grow justify-center items-center sm:gap-2">
                  <div className="platform flex flex-col items-center ">
                    <div className="platform-btn flex w-full justify-center">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setIsPlatformVisible(!isPlatformVisible);
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-zinc-700 dark:text-gray-300 rounded-md pop-regular text-xs"
                      >
                        Platform
                      </button>
                    </div>
                    <p className="text-xs text-justify indent-5 sm:indent-10 pb-3 sm:pb-0 pt-2 dark:text-gray-300 max-h-20 overflow-y-auto centered px-3 sm:px-14 md:px-20 lg:px-32 ">
                      {!isPlatformVisible ? (
                        ""
                      ) : (
                        <span>{candidate.platform}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Render other candidate details */}
          </label>
        </SwiperSlide>
      )
    );

    return candidateElements;
  };

  const [openModalResult, setOpenModalResult] = useState<boolean>(false);
  const [singleBallot, setSingleBallot] = useState<string>("");

  const {
    mutate: getSingleBallot,
    isLoading: isBallotLoading,
    data: ballotData,
  } = useSingleBallotResult();

  const handleGetBallot = async (ballots: any, orgId: string) => {
    try {
      setSelectedOrganizationID(orgId);
      const isVoted = await axiosPrivate.get(
        "/election/check/check-if-voted-organization",
        {
          params: {
            student_id,
            organizationId: orgId,
          },
        }
      );

      if (isVoted?.data?.length === 0) {
        setOpenModal(true);
        setSingleBallot(ballots.id)
        getSingleBallot(ballots.id);
      } else {
        setOpenModalResult(true)
        socket.emit("ballot-id", {ballot_id: `${ballots.id}`} )
      }
    } catch (error) {
      // Handle error here
      console.error(error);
    }
  };

  //CAST VOTE HOOK
  const { mutate: castVote, isLoading: isCastingVote } = useCastVote();

  //CAST VOTE FUNCTION
  const handleCastVote = (e: any) => {
    e.preventDefault();
    const vote = {
      vote: Object.entries(selectedCandidates).map(([position, voted_ids]) => ({
        position,
        voted_ids,
      })),
    };

    // Check if the user has voted for all positions
    const hasVotedForAllPositions = ballotData?.every((position: any) =>
      selectedCandidates.hasOwnProperty(position.id)
    );

    const selected = Object.entries(selectedCandidates).map(
      ([position, voted_ids]) => ({ position, voted_ids })
    );

    const hasSelectedEveryRequiredWinner = ballotData?.every((pos: any) =>
      selected.some(
        (can) =>
          can.position === pos.id &&
          can.voted_ids.length === Number(pos.requiredWinner)
      )
    );

    if (hasVotedForAllPositions) {
      //Proceed with submitting the votes
      if (!hasSelectedEveryRequiredWinner) {
        message.open({
          type: "warning",
          content: "Please select required winners for each position.",
          className: "custom-class pop-medium",
          duration: 3,
        });
      } else {
        castVote({
          student_id,
          organization_id: selectedOrganizationID,
          vote,
        }, {
          onSuccess: () => {
            socket.emit("cast-vote", {ballot_id: `${singleBallot}`} )
            setOpenModal(false)
          }
        })
      }
    } else {
      // Display an error message or take appropriate action
      message.open({
        type: "warning",
        content: "Please vote to all positions before sending votes.",
        className: "custom-class pop-medium",
        duration: 2.5,
      });
    }
  };

  function percentage(votes: string, overall: []):string{
    if(overall.length === 0){
      return String(0)
    }
    const calcA = Number(votes) / Number(overall.length)
    const calcB = calcA * 100
    const result = Math.trunc(calcB)
    return String(result)
  }

  return (
    <div>
      <h1 className="text-[#1c295d] dark:text-gray-300 text-xl pt-1 md:pt-3 text-center pop-bold">
        Cast Vote
      </h1>
      {/* NOTIFICATION HEADER */}
      <div className="notification flex justify-end">
        <div className="icons flex items-center bg-white dark:bg-[#313131] shadow-md py-1 px-2 rounded-full justify-center gap-5">
          <div
            className="bg-[#e1e1e1] dark:bg-[#3a3a3a] rounded-full p-1"
            onClick={switchMode}
          >
            {isNight ? (
              <BsFillSunFill
                className="text-gray-400 hover:text-gray-200"
                size={20}
              />
            ) : (
              <BsMoonFill
                className="text-[#a3aed0] hover:text-slate-500"
                size={20}
              />
            )}
          </div>
        </div>
      </div>
      {/* NOTIFICATION HEADER */}

      {/* SHOW ONGOING ELECTIONS */}
        <div className="elections-body shadow-md bg-white dark:bg-[#313131] mt-3 rounded-lg">
          <div className="ongoing flex justify-between p-5">
            <h4 className="pop-medium dark:text-gray-300 text-md md:text-lg">
              Ongoing Elections
            </h4>
          </div>

          <div className="elections px-5 pb-5">
            {events?.length === 0 ? (
              <div className="no-ongoingx">
                <div className="h4 text-gray-400 pop-regular text-sm text-center ">
                  No ongoing Election.
                </div>
              </div>
            ) : (
              <div className="elections-cards grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {events[0]?.map(
                  (ongoing: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => handleActiveOrganizations(ongoing.id)}
                      className="ongoing relative border-2 dark:border-zinc-700 cursor-pointer shadow-lg rounded-lg overflow-hidden"
                    >
                      <img
                        src={ongoing.banner ?? cict}
                        alt="election banner"
                        className="object-cover w-full h-52"
                      />
                      <div className="fading-info absolute bottom-0 w-full bg-gradient-to-t from-white dark:from-black">
                        <h4 className="text-center pt-10 pb-3 pop-semibold dark:text-gray-100 text-lg">
                          {ongoing.title}
                        </h4>
                        {/* DATE DISPLAY */}
                        <div className="dates flex flex-col sm:flex-row text-xs sm:gap-3 items-center justify-center text-gray-900 dark:text-gray-300 pb-2 sm:pb-3 pop-regular">
                          <p className="">
                            {new Date(ongoing.startDate).toLocaleDateString(
                              "en-US",
                              {
                                timeZone: "Asia/Manila",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <span>-</span>
                          <p className="sm:text-right">
                            {new Date(ongoing.endDate).toLocaleDateString(
                              "en-US",
                              {
                                timeZone: "Asia/Manila",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        {/* DATE DISPLAY */}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      {/* SHOW ONGOING ELECTIONS */}

      {/* SHOW ACTIVE ORGANIZATIONS ELECTION */}
      {isActiveOrgs && (
          <>
            <div className="active-organization rounded-lg shadow-xl bg-white dark:bg-[#313131] mt-5 p-5">
              <h4 className="pb-5 text-center text-xs sm:text-md md:text-lg dark:text-gray-300 pop-semibold">
                Active Organizations
              </h4>
              <div className="all-org grid gap-2 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {activeOrgs?.length === 0 ? (
                  <h3>No Active Organizations</h3>
                ) : (
                  activeOrgs?.map((org: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => handleGetBallot(org.ballots[0], org.id)}
                      className="org cursor-pointer hover:bg-gray-200 border-[1px] border-gray-200 dark:border-zinc-700 overflow-hidden py-2 bg-gray-100 dark:bg-[#282828] dark:hover:bg-[#2f2f2f] flex flex-col shadow-xl rounded-lg items-center"
                    >
                      <img
                        src={org.logo_url}
                        alt={org.org_name + " " + "Logo"}
                        className="object-cover w-16 h-16  sm:w-24 sm:h-24 rounded-full"
                      />
                      <h2 className="pop-medium text-center pt-3 dark:text-gray-300 text-sm">
                        {org.org_name}
                      </h2>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
      )}
      {/* SHOW ACTIVE ORGANIZATIONS ELECTION */}

      {/* CAST VOTE MODAL */}
      <VoteModal
        title="Ballot"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className="Ballot">
          <span className='flex pb-5'>
            <Tooltip
              placement="bottom"
              title="Uncheck the checkbox to change candidate."
            >
              <span style={{ display: 'inline-block' }}>
                <FaInfoCircle className="text-[#a3aed0]" size={23} />
              </span>
            </Tooltip>
          </span>
          <form onSubmit={handleCastVote}>
            {isBallotLoading ? (
              <div
                className={`position animate-pulse gap-10 p-5 mb-10  odd:bg-blue-100 dark:odd:bg-[#555555] even:bg-red-100 dark:even:bg-[#563232] shadow-2xl rounded-lg`}
              >
                <h3 className="pop-semibold bg-gray-100 overflow-hidden dark:bg-zinc-500 dark:text-gray-100 text-gray-800 text-center py-2 sm:py-3 rounded-lg mb-2 text-sm sm:text-lg h-10"></h3>
              </div>
            ) : (
              ballotData
                ?.sort((a: any, b: any) => a.position_order - b.position_order)
                .map((position: Position) => (
                  <div
                    key={position.position}
                    className={`position gap-10 p-5 mb-10  odd:bg-transparent dark:odd:bg-transparent dark:odd:border-zinc-700 border-2 even:bg-red-100 dark:even:bg-[#563232] shadow-2xl rounded-lg`}
                  >
                    <h3 className="pop-semibold bg-gray-100 overflow-hidden dark:bg-zinc-700 dark:text-gray-100 text-gray-800 text-center py-2 sm:py-2 rounded-lg mb-2 text-sm sm:text-lg">
                      {position.position}
                      <span className="text-gray-700 dark:text-gray-100 pop-medium block text-xs md:text-sm tracking-widest">
                        {position.requiredWinner === "1"
                          ? "  ( Select " +
                            position.requiredWinner +
                            " candidate )"
                          : "  ( Select " +
                            position.requiredWinner +
                            " candidates ) "}
                      </span>
                    </h3>
                    <Swiper
                      effect={'coverflow'}
                      grabCursor={true}
                      centeredSlides={true}
                      loop={true}
                      slidesPerView={1}
                      coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                      }}
                      pagination={{ el: '.swiper-pagination', clickable: true }}
                      navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                      }}
                      modules={[EffectCoverflow, Pagination, Navigation]}
                      className="swiper_container"
                    >
                      {renderCandidates(position, selectedCandidates)}
                      <div className="slider-controler">
                        <div className="swiper-button-prev slider-arrow">
                        </div>
                        <div className="swiper-button-next slider-arrow">
                        </div>
                        <div className="swiper-pagination"></div>
                      </div>
                    </Swiper>
                  </div>
                ))
            )}

            {!isBallotLoading && (
              <div className="btn flex justify-center sm:px-10 sm:pb-6">
                {isCastingVote ? (
                  <button
                    disabled={isCastingVote}
                    className="text-gray-100 bg-blue-600 hover:bg-blue-600 rounded-lg text-sm sm:text-lg pop-semibold py-2 px-4 sm:py-3 sm:px-6"
                  >
                    Casting Vote...
                  </button>
                ) : (
                  <button
                    disabled={isCastingVote}
                    type="submit"
                    className="text-gray-100 bg-blue-600 hover:bg-blue-600 rounded-lg text-sm sm:text-lg pop-semibold py-2 px-4 sm:py-3 sm:px-6"
                  >
                    Cast Vote
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </VoteModal>
      {/* CAST VOTE MODAL */}

      {/* RESULT BALLOT MODAL */}
      <VoteModal
        title="Result"
        open={openModalResult}
        onClose={() => setOpenModalResult(false)}
      >
        <div className="result-ballot">
          {singleOrgResult
            ?.sort((a: any, b: any) => a.position_order - b.position_order)
            .map((result: Position, index: any) => (
              <div
                key={index}
                className={`result gap-10 p-5 mb-10 border-4 dark:border-zinc-700 shadow-2xl rounded-lg`}
              >
                <h3 className="pop-semibold dark:bg-zinc-700 overflow-hidden border-2 dark:border-zinc-700 dark:text-gray-100 text-gray-800 text-center py-2 sm:py-3 rounded-lg mb-2 text-sm sm:text-xl">
                  {result.position}
                </h3>
                <div className="candidates-result flex flex-col gap-3">
                  {result?.candidates?.sort((a: any, b: any) => b.count - a.count)
                  .map((candidate: any, index: any) => (
                      <div
                        key={index}
                        className="candidate border-2 dark:border-zinc-700 relative  overflow-hidden  sm:pr-6 sm:rounded-l-[5rem] py-2 sm:py-0 rounded-xl sm:rounded-br-[3rem] flex items-center justify-between dark:text-gray-100 flex-col sm:flex-row"
                      >
                        <div  style={{ width: `${percentage(candidate.count, result?.voted_candidates)}%` }} className={`progress rounded-l-xl sm:rounded-l-[5rem] h-full bg-purple-500/40 absolute top-0 left-0 transition-width duration-300 sm:rounded-r`}></div>

                        <div className="candidate-profile sm:z-10 relative flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                          <img
                            src={candidate.imageUrl}
                            alt={candidate.fullname + " " + "Profile"}
                            className="object-cover z-20 w-[50px] h-[50px] sm:w-[74px] sm:h-[74px] mt-[2px] shadow-lg sm:mt-0 rounded-full"
                          />
                          <h3 className="pop-semibold text-xs sm:text-sm text-center sm:text-left dark:text-gray-200 md:text-lg">
                            {candidate.fullname}
                          </h3>
                        </div>
                        <div className="candidate-votes z-10 flex flex-col items-center">
                          <h4 className="pop-light absolute top-4 right-4 sm:top-[50%] sm:translate-x-[50%] sm:-translate-y-[50%] sm:right-[50%] italic text-xs sm:text-base">
                            {percentage(candidate.count, result?.voted_candidates)}%
                          </h4>
                          <h4 className="pop-bold text-xl">
                            {candidate.count}
                          </h4>
                          <h5 className="pop-semibold text-sm">votes</h5>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          }
        </div>
      </VoteModal>
      {/* RESULT BALLOT MODAL */}
    </div>
  );
}
