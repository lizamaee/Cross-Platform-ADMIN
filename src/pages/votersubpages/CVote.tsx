import {
  BsFillChatSquareDotsFill,
  BsFillSunFill,
  BsMoonFill,
} from "react-icons/bs";
import { FiBell } from "react-icons/fi";
import { useAuthStore } from "../../hooks/state";
import {
  useCastVote,
  useOngoingElections,
  useSingleBallotResult,
} from "../../hooks/queries/useVoter";
import { useState } from "react";
import VoteModal from "../../components/VoteModal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Tag, message } from "antd";
import cict from "../../images/cict.jpg";

type Position = {
  id: string;
  position: string;
  requiredWinner: string;
  candidates: [];
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
  const [isActiveOrgs, setIsActiveOrgs] = useState<boolean>(false);
  const [isPlatformVisible, setIsPlatformVisible] = useState<boolean>(false);
  const { isNight, student_id, switchMode } = useAuthStore((state) => state);
  const [selectedOrganizationID, setSelectedOrganizationID] =
    useState<string>("");

  //ONGOING ELECTIONS QUERY HOOK
  const ongoingElectionsQuery = useOngoingElections();

  //SHOW ORGANIZATIONS
  const handleActiveOrganizations = async (id: string) => {

    //Only append once
    await appendElectionToUser(id)

    const orgs = ongoingElectionsQuery?.data?.filter(
      (elec: any) => elec.id === id
    );
    setActiveOrgs(orgs[0]?.organizations);
    setIsActiveOrgs(true);
  };

  //APPEND CLICKED ELECTION TO USER
  const appendElectionToUser = async (election_id: string) => {
    const connectElectionToVoter = {
      election_id,
      student_id
    }

    await axiosPrivate.patch('election/connect-voter-election', connectElectionToVoter)
    .then((response) => {
        //console.log(response.data)
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
        <label
          htmlFor={`candidate_${candidate.id}`}
          key={candidate.id}
          className="candidate overflow-hidden relative flex flex-col mb-3 bg-white dark:bg-[#313131] shadow-md p-2 sm:p-4 rounded-2xl cursor-pointer"
        >
          {/* Render candidate information */}
          <div className="c flex-col flex">
            <h6 className="absolute top-0 right-0 text-xs">
              <Tag color="magenta" style={{ marginRight: 0 }}>
                {candidate.party}
              </Tag>
            </h6>
            <div className="candidate-profile mt-5 sm:mt-0 w-full flex-col sm:flex-row flex items-center">
              <img
                src={candidate.imageUrl}
                alt={candidate.fullname + " " + "Profile"}
                className="object-cover border-[4px] w-16 h-16 rounded-full"
              />
              <h4 className="pop-medium text-sm md:text-md capitalize dark:text-gray-200 text-center sm:text-left sm:pl-5">
                {candidate.fullname}
              </h4>
              <div className="vote sm:pl-10">
                <input
                  type="radio"
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
      )
    );

    return candidateElements;
  };

  const [openModalResult, setOpenModalResult] = useState<boolean>(false);

  const {
    mutate: getSingleResultBallot,
    isLoading: isResultBallotLoading,
    data: resultBallotData,
  } = useSingleBallotResult();

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
        getSingleBallot(ballots.id);
      } else {
        setOpenModalResult(true);
        getSingleResultBallot(ballots.id);
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
          onSuccess: () => setOpenModal(false)
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
          <div className="bell bg-[#e1e1e1] dark:bg-[#3a3a3a] rounded-full p-1">
            <FiBell
              className="text-[#a3aed0] dark:text-gray-400  dark:hover:text-gray-200 hover:text-slate-500"
              size={20}
            />
          </div>
        </div>
      </div>
      {/* NOTIFICATION HEADER */}

      {/* SHOW ONGOING ELECTIONS */}
      {ongoingElectionsQuery?.isLoading ? (
        <div className="loading flex flex-col gap-3 items-center dark:text-gray-400 justify-center mt-6">
          <h3 className="pop-semibold">Loading...</h3>
        </div>
      ) : (
        <div className="elections-body shadow-md bg-white dark:bg-[#313131] mt-3 rounded-lg">
          <div className="ongoing flex justify-between p-5">
            <h4 className="pop-medium dark:text-gray-300 text-md md:text-lg">
              Ongoing Elections
            </h4>
            <button>
              <BsFillChatSquareDotsFill className="text-[#7268EF] w-7 h-7 md:w-8 md:h-8" />
            </button>
          </div>

          <div className="elections p-5">
            {ongoingElectionsQuery?.data?.length === 0 ? (
              <div className="no-ongoingx">
                <div className="h4 text-gray-400 pop-regular text-sm text-center ">
                  No ongoing Election.
                </div>
              </div>
            ) : (
              <div className="elections-cards grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {ongoingElectionsQuery?.data?.map(
                  (ongoing: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => handleActiveOrganizations(ongoing.id)}
                      className="ongoing cursor-pointer border-[1px] border-gray-200 dark:border-gray-600 dark:bg-zinc-700 bg-gray-100 shadow-md rounded-xl overflow-hidden"
                    >
                      <img
                        src={ongoing.banner ?? cict}
                        alt="election banner"
                        className="object-cover w-full h-32"
                      />
                      <h4 className="text-center py-3 pop-semibold dark:text-gray-200 text-lg">
                        {ongoing.title}
                      </h4>
                      {/* DATE DISPLAY */}
                      <div className="dates flex text-xs gap-3 items-center justify-center text-gray-600 dark:text-gray-400 pb-5 pop-regular">
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
                        <p className="text-right">
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
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* SHOW ONGOING ELECTIONS */}

      {/* SHOW ACTIVE ORGANIZATIONS ELECTION */}
      {ongoingElectionsQuery?.isLoading ? (
        <div className="loadin flex flex-col gap-3 items-center dark:text-gray-400 justify-center mt-6">
          <h3 className="pop-semibold"></h3>
        </div>
      ) : (
        isActiveOrgs && (
          <>
            <div className="flex">
              <h4 className="pt-4 pb-2 text-center text-xs sm:text-md md:text-lg dark:text-gray-200 pop-semibold">
                Active Organizations
              </h4>
            </div>
            <div className="active-organization rounded-lg shadow-xl bg-white dark:bg-[#313131] p-5">
              <div className="all-org grid sm:p-5 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
                {activeOrgs?.length === 0 ? (
                  <h3>No Active Organizations</h3>
                ) : (
                  activeOrgs?.map((org: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => handleGetBallot(org.ballots[0], org.id)}
                      className="org cursor-pointer hover:bg-gray-200 border-[1px] border-gray-200 dark:border-gray-600 overflow-hidden py-2 bg-gray-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 flex flex-col shadow-md rounded-2xl items-center"
                    >
                      <img
                        src={org.logo_url}
                        alt={org.org_name + " " + "Logo"}
                        className="object-cover w-16 h-16  sm:w-24 sm:h-24 rounded-full"
                      />
                      <h2 className="pop-medium text-center pt-3 dark:text-gray-300 text-sm">
                        {org.org_name}
                      </h2>
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
                )}
              </div>
            </div>
          </>
        )
      )}
      {/* SHOW ACTIVE ORGANIZATIONS ELECTION */}

      {/* CAST VOTE MODAL */}
      <VoteModal
        title="Ballot"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className="Ballot p-5">
          <form onSubmit={handleCastVote}>
            {isBallotLoading ? (
              <div
                className={`position animate-pulse gap-10 p-5 mb-10  odd:bg-blue-100 dark:odd:bg-[#343256] even:bg-red-100 dark:even:bg-[#563232] shadow-2xl rounded-lg`}
              >
                <h3 className="pop-semibold bg-gray-100 overflow-hidden dark:bg-zinc-500 dark:text-gray-100 text-gray-800 text-center py-2 sm:py-3 rounded-lg mb-2 text-sm sm:text-lg h-10"></h3>
              </div>
            ) : (
              ballotData
                ?.sort((a: any, b: any) => a.position_order - b.position_order)
                .map((position: Position) => (
                  <div
                    key={position.position}
                    className={`position gap-10 p-5 mb-10  odd:bg-blue-100 dark:odd:bg-[#343256] even:bg-red-100 dark:even:bg-[#563232] shadow-2xl rounded-lg`}
                  >
                    <h3 className="pop-semibold bg-gray-100 overflow-hidden dark:bg-zinc-500 dark:text-gray-100 text-gray-800 text-center py-2 sm:py-3 rounded-lg mb-2 text-sm sm:text-lg">
                      {position.position}
                      <span className="text-gray-100 pop-medium block text-xs md:text-sm tracking-widest">
                        {position.requiredWinner === "1"
                          ? "  ( Select " +
                            position.requiredWinner +
                            " candidate )"
                          : "  ( Select " +
                            position.requiredWinner +
                            " candidates ) "}
                      </span>
                    </h3>
                    {renderCandidates(position, selectedCandidates)}
                  </div>
                ))
            )}

            {!isBallotLoading && (
              <div className="btn flex justify-center sm:px-10 sm:py-6">
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
                  className={`result gap-10 p-5 mb-10 bg-gradient-to-t  from-blue-400 to-red-400 dark:bg-gradient-to-br dark:from-[#323356] dark:to-[#563232] shadow-2xl rounded-lg`}
                >
                  <h3 className="pop-semibold bg-gray-100 overflow-hidden dark:bg-zinc-500 dark:text-gray-100 text-gray-800 text-center py-2 sm:py-3 rounded-lg mb-2 text-sm sm:text-lg">
                    {result.position}
                  </h3>
                  <div className="candidates-result flex flex-col gap-3">
                    {result?.candidates
                      ?.sort((a: any, b: any) => b.count - a.count)
                      .map((candidate: any, index: any) => (
                        <div
                          key={index}
                          className="candidate bg-[#E5E0FF] dark:bg-[#313131]  sm:pr-6 sm:rounded-l-[5rem] py-2 sm:py-0 rounded-xl sm:rounded-br-[3rem] flex items-center justify-between dark:text-gray-100 flex-col sm:flex-row"
                        >
                          <div className="candidate-profile relative flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                            <div className="gradientball w-[54px] h-[54px] sm:w-20 sm:h-20 bg-gradient-to-t from-blue-500 to-red-500 rounded-full absolute "></div>
                            <img
                              src={candidate.imageUrl}
                              alt={candidate.fullname + " " + "Profile"}
                              className="object-cover z-20 w-[50px] h-[50px] sm:w-[74px] sm:h-[74px] mt-[2px]  sm:ml-[3px] sm:mt-0 rounded-full"
                            />
                            <h3 className="pop-semibold text-xs sm:text-sm text-center sm:text-left dark:text-gray-300 md:text-lg">
                              {candidate.fullname}
                            </h3>
                          </div>
                          <div className="candidate-votes flex flex-col items-center">
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
          )}
        </div>
      </VoteModal>
      {/* RESULT BALLOT MODAL */}
    </div>
  );
}
