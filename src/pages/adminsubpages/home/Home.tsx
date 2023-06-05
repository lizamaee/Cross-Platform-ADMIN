import { TiGroup } from "react-icons/ti";
import { BsCalendar2EventFill } from "react-icons/bs";
import { FaPeopleCarry } from "react-icons/fa";
import { useEffect, useState } from "react";
import LineChart from "../../../components/LineChart";
import ElectionTable from '../../../components/ElectionTable';
import { useAuthStore } from '../../../hooks/state';
import NavBar from '../../../components/NavBar';
import CandidatesResults from '../../../components/CandidatesResults';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { Skeleton } from 'antd'
import {useQuery} from '@tanstack/react-query'
import { useElections } from "../../../hooks/queries/useElection";
import { useOrganizations } from "../../../hooks/queries/useOrganization";


interface Election {
  id: number;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface ElectionOrg {
  id: string;
  org_name: string;
  logo_url: string;
  startDate: string;
  endDate: string;
}

interface Activity {
  id: string;
  type: string;
  userId: string;
  createdAt: string;
  user: {
    profile_picture: string;
    fullname: string;
  }
}

interface seatCandidate{
  id: string;
  position: string;
  candidates: {
      id: string;
      fullname: string;
      party: string;
      count: number;
  }[];
}

export default function Home(){
  const [asOfNow, setAsOfNow] = useState<string>("");
  const [upcomingTab, setUpcomingTab] = useState<boolean>(true)
  const [ongoingTab, setOngoingTab] = useState<boolean>(false)
  const [renderOrganizations, setRenderOrganizations] = useState<boolean>(false)
  const [upcomingsError, setUpcomingsError] = useState<string>("")
  const [ongoingsError, setOngoingsError] = useState<string>("")
  const [activitiesError, setActivitiesError] = useState<string>("")

  const [electionOrgs, setElectionOrgs] = useState<ElectionOrg[]>([])
  const [seatCandidates, setSeatCandidates] = useState<seatCandidate[]>([])
  const [renderCandidates, setRenderCandidates] = useState(false)

  const axiosPrivate = useAxiosPrivate()
  const location = useLocation()
  const navigate = useNavigate()

  const { isNight } = useAuthStore((state) => state)

  const fetchData = async (endpoints: string) => {
    try {
      const response = await axiosPrivate.get(`/${endpoints}`);
      return response.data
    } catch (error: any) {

      //console.log(error.response.data.error.message)
      if (error.response) {
        // ✅ log status code here
        //Live Server Return
        //console.log(error.response.status);
        if(error.response.status === 403){
          navigate('/login', {state: {from: location}, replace: true});
        }
        return [error.response.data ];
      }
      //Dead Server Return
      return [{error: error.message }];
    }
  }

  //Elections Query
  const electionsQuery = useElections()
  
  const upcomingElections: Election[] = electionsQuery.data?.filter((election: Election)=> election.status === 'upcoming');

  const ongoingElections: Election[] = electionsQuery.data?.filter((election: Election)=> election.status === 'ongoing');

  //Organizations Query
  const organizationsQuery = useOrganizations()

  //Voters Query
  const fetchVoters = async () => {
    return await fetchData('get-all-voters');
  };
  const votersQuery = useQuery(
    {queryKey: ['voters'], queryFn: fetchVoters},
  ) 

  //Voted Activites Query
  const fetchVotedActivities = async () => {
    return await fetchData('get-voted-activities');
  };
  const votedActivitiesQuery = useQuery(
    {queryKey: ['voted-activities'], queryFn: fetchVotedActivities},
  ) 

  //Analytics Query
  const fetchAnalyticsData = async () => {
    return await fetchData('user-analytics');
  };
  const analyticsQuery = useQuery(
    {queryKey: ['analytics'], queryFn: fetchAnalyticsData},
  ) 
  const getDataDayAndCount = () => {
    const dataDay: string[] = [];
    const dataCount: number[] = [];

    for (let i = 0; i < analyticsQuery.data?.length; i++) {
      dataDay.push(analyticsQuery.data[i][0]);
      dataCount.push(analyticsQuery.data[i][1]);
    }
    return { dataDay, dataCount };
  };
  const { dataDay, dataCount } = getDataDayAndCount();

  useEffect(() => {
    //DATE TODAY
    const today = new Date()
    function formatDate() {
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear().toString().substr(-2);
      setAsOfNow(`${month}/${day}/${year}`)
    }
    formatDate()

  }, []);
  //add [ newUser, upcomings, voters, elections, organizations ] dependency above on production

  const data = {
    labels: dataDay,
    datasets: [
      {
        label: "New Registered Voter",
        data: dataCount,
        fill: true,
        backgroundColor: "rgba(68,74,94,0.2)",
        borderColor: "#A75DE1",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    layout:{padding:5},
    scales: {
      y:{
        ticks:{color: isNight ? "rgb(156 163 175)" : "#090650"},
        grid:{color: isNight ? "rgb(75 85 99)" : "rgb(209 213 219)"}
      },
      x:{
        ticks:{color:isNight ? "rgb(243 244 246)" : "#090650"}
      }
    },
    plugins: {
      legend: {
        labels: {color: isNight ? "rgb(243 244 246)" : "rgb(75 85 99)"}
      },
    },
    
  }; 

  //Activate Election to Ongoing
  const activateElection = (id: string) => {
    try {
      axiosPrivate.patch(`${import.meta.env.VITE_API_URL}election/status/to-ongoing/${id}`, {},)
        .then(response => {
          //console.log(response.data);
          // handle success
        })
        .catch(error => {
          console.error(error);
          // handle error
        });
    } catch (error) {
      console.error(error);
      // handle error
    }
  }

  //Get All organization of passed election id
  const getCandidatesBasedOnOrgId = async (id: string) => {
    try {
      const response = await fetchData(`seat/org-seat-candidates/${id}`)
      return response
      
    } catch (error) {
      throw error
    }
  }

  const getOrganizationsBasedOnId = async (id:string) => {
    try {
      const response = await fetchData(`election/${id}`)
      return response
    } catch (err) {
      throw err
      //console.log(err);
    }
  }
  const getOrganizations = async (id: string) => {
    const response = await getOrganizationsBasedOnId(id)
    setElectionOrgs(response.organizations)
    setRenderOrganizations(true)
  }

  const getCandidates = async (id: string) => {
    const response = await getCandidatesBasedOnOrgId(id)
    //console.log(response.seats);
    if(!response.seats) {
      console.log("Empty response");
      
    }else{
      setSeatCandidates(response.seats)
      setRenderCandidates(true)
    }
  }

  const handleUpcomingTab = () => {
    setUpcomingTab(true)
    setOngoingTab(false)
    setRenderOrganizations(false)
  }
  const handleOngoingTab = () => {
    setOngoingTab(true)
    setUpcomingTab(false)
  }

  // ACTIVITY TIMESTAMPS Format
  const formatStamp = (stamp: string) => {
    try {
      const date = new Date(stamp);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const formattedDate = date.toLocaleString("en-US", options);
      return formattedDate; // Output: "Apr 23, 2023, 8:19 PM"
    } catch (error:any) {
      //console.log(error.message);
      return "Invalid Date";
    }
  };

  const closeCandidateTable = () => {
    setRenderCandidates(false);
  };
  

  return (
    <div className="home">
      {/* DASHBOARD */}
        <NavBar pageName='Dashboard'/>
      {/* DASHBOARD */}


      { !renderCandidates ? "" : <CandidatesResults handleClose={closeCandidateTable} seatCandidates={seatCandidates}/>}


      {/* PHASE I */}
      <div className="boxes py-5 grid md:grid-cols-3 gap-5">
        <div className="all-voters md:drop-shadow-md md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-[#A75DE1] rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
          {votersQuery.isLoading ? (
            <Skeleton.Avatar active shape='circle' size='large' />
          ) : (
            <div>
              <h1 className="pop-bold text-xl md:text-3xl md:pb-2">
                {votersQuery.data?.length}
              </h1>
            </div>
          )}

            
            <h3 className="pop-medium text-sm md:text-md">Registered Voters</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <TiGroup className="text-5xl text-center lg:text-8xl hidden md:block" />
          </div>
        </div>

        <div className="all-voters md:drop-shadow-md md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-[#2F92F0] rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            {electionsQuery.isLoading ? (
              <Skeleton.Avatar active shape='circle' size='large' />
            ) : (
              <div>
                <h1 className="pop-bold text-xl md:text-3xl md:pb-2">
                  {electionsQuery.data?.length}
                </h1>
              </div>
            )}
            <h3 className="pop-medium text-sm md:text-md">No. of Elections</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <BsCalendar2EventFill className="text-5xl text-center lg:text-7xl hidden md:block" />
          </div>
        </div>

        <div className="all-voters md:drop-shadow-md md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-[#1AB98C] rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            {organizationsQuery.isLoading ? (
              <Skeleton.Avatar active shape='circle' size='large' />
            ) : (
              <div>
                <h1 className="pop-bold text-xl md:text-3xl md:pb-2">
                  {organizationsQuery.data?.length}
                </h1>
              </div>
            )}
            <h3 className="pop-medium text-sm md:text-md">
              No. of Organizations
            </h3>
          </div>
          <div className="icon flex justify-center items-center">
            <FaPeopleCarry className="text-5xl text-center lg:text-8xl hidden md:block" />
          </div>
        </div>
      </div>
      {/* PHASE I */}

      {/* PHASE II */}
      <div className="elections-activities grid md:grid-row-2 lg:grid-cols-3 md:gap-5 ">
        <div className="elections lg:col-span-2 text-[#090650] dark:text-gray-200 md:bg-white dark:bg-[#333333] md:py-3 rounded-lg hidden md:block md:drop-shadow-md">
          
          <div className="chart-heading flex items-center justify-between px-5">
            <h1 className="pop-semibold text-sm">Daily New Voters</h1>
            <h2 className="pop-semibold text-xs tracking-widest">{asOfNow}</h2>  
          </div>

          {/* Line Chart */}
          <div className="chart-containera flex justify-center items-center h-full w-full">
            <div className="chart-wrapper w-full flex justify-center pb-2 px-4">
              <LineChart chartData={data} options={options} />
            </div>
          </div>
        </div>
        <div className="activities">
          <div className="activity-wrapper py-3 px-5 bg-white dark:bg-[#333333] min-h-full drop-shadow-md rounded-2xl">
            <h3 className="pb-2 pop-semibold text-sm text-[#090650] dark:text-gray-200">
              Current Election Turnout
            </h3>

            <div className="card p-10 bg-[#090650] dark:bg-[#4a4a4a] rounded-xl text-center text-white">
              <h2 className="text-2xl pop-bold">
                <span className="text-[#00ffdf] dark:text-[#49ecd6]">{String(votedActivitiesQuery.data?.count ?? "0")}</span>
                <span className="pop-regular px-4">out of</span>{votersQuery.data?.length}
              </h2>
              <p className="opacity-50">the votes used</p>
            </div>

            {/* Activities */}
            <h3 className="text-[#090650] dark:text-gray-200 pop-semibold text-xs text-center pt-4 pb-2 shadow-sm rounded-md">
              Latest voting activity
            </h3>

            <div className="voting-activity overflow-y-auto max-h-60 px-2">

              { activitiesError && (

                  <h3 className="pop-normal w-full text-center text-sm tracking-wide pt-5 opacity-50 dark:text-gray-200">{activitiesError}</h3>
              )}
              {!activitiesError && votedActivitiesQuery.data?.activities?.map((activity: Activity) => (
                  <div key={activity.id} className="activity flex justify-between items-center shadow-sm py-1 text-[#090650] dark:text-gray-400">
                    <img
                      className="w-6 h-6 rounded-full"
                      src={activity.user.profile_picture === "" || activity.user.profile_picture === null ? "https://bit.ly/3LpSOvc" : activity.user.profile_picture}
                      alt="profile picture"
                    />
                    <div className="name-date">
                      <h2 className="pop-semibold lg:text-xs">{activity.user.fullname}</h2>
                      <p className="opacity-50 pop-regular text-xs">
                        {formatStamp(activity.createdAt)}
                      </p>
                    </div>
                    <h3 className="pop-semibold text-sm text-[#26d1ad] dark:text-[#50cbae]">{activity.type}</h3>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* PHASE II */}

      {/* PHASE III */}
      <div className="election-wrapper rounded-md bg-white dark:bg-[#333333]">
        <div className="eletion-tab flex justify-evenly dark:text-gray-100 gap-4 mt-5">
          <button onClick={handleUpcomingTab} className={`text-center text-xs md:text-lg pop-bold shadow-sm py-5 w-full ${ upcomingTab ? `bg-gradient-to-r from-[#7268EF] to-[#9D93F6] text-white rounded-md ` : `` }`}>
            Upcoming Elections
          </button>
          <button onClick={handleOngoingTab} className={`text-center text-xs md:text-lg pop-bold shadow-sm py-5 w-full ${ ongoingTab ? `bg-gradient-to-r from-[#7268EF] to-[#9D93F6] text-white rounded-md ` : `` }`}>
            Ongoing Elections
          </button>
        </div>
        {/* Elections Table */}
        { upcomingTab && <ElectionTable election={upcomingElections} error={upcomingsError} handleElection={activateElection} action='activate' actionStyle='hover:bg-sky-800 border-2 border-blue-400 hover:text-white'/> }
        { ongoingTab && <ElectionTable election={ongoingElections} error={ongoingsError} handleElection={getOrganizations} action='view' actionStyle='hover:bg-emerald-800 border-2 border-green-400 hover:text-white'/> }
      

        {renderOrganizations && <h2 className='text-sm pop-bold py-4 mt-2 text-sky-950 dark:text-gray-200 w-full text-center'>Active Organizations Election</h2>}

        <div className="election-per-organizations px-5 grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {!renderOrganizations ? "" : (electionOrgs?.map((org) => (
            
            <div onClick={() => getCandidates(org.id)} className="single-or cursor-pointer bg-white hover:bg-[#dcdcdc] dark:hover:bg-[#6d6d6d] dark:bg-[#4a4a4a] dark:text-gray-100 rounded-lg drop-shadow-md p-4 text-xs pop-medium" key={org.id}>
              <div className="org-img-container p-1 flex justify-center">
                <img className='rounded-full h-[60px]' src={org.logo_url !== "" ? org.logo_url : "https://bit.ly/3KYDTGU"} alt={org.org_name} />
              </div>
              <h1 className='text-sm text-center py-3'>{org.org_name}</h1>
              <div className="time-date-container flex justify-between px-2 opacity-60">
                <p>Start: {new Date(org.startDate).toLocaleDateString("en-US", {
                    timeZone: "Asia/Manila",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}</p>
                <p className='text-right'>End: {new Date(org.endDate).toLocaleDateString("en-US", {
                    timeZone: "Asia/Manila",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}</p>
              </div>
            </div>

          )))}
        </div>
      </div>
      {/* PHASE III */}
    </div>
  )
}
