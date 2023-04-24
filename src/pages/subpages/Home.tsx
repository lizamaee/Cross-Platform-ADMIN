import axios from 'axios';
import { TiGroup } from "react-icons/ti";
import { BsCalendar2EventFill } from "react-icons/bs";
import { FaPeopleCarry } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import LineChart from "../../components/LineChart";
import { getAnalyticsData, getUpcomings, fetchData, getOngoings, getVotedActivities, getOrganizationsBasedOnId } from "../../api/home";
import ElectionTable from '../../components/ElectionTable';


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


export const Home = () => {
  const [upcomings, setUpComings] = useState<Election[]>([])
  const [ongoings, setOngoings] = useState<Election[]>([])
  const [newUser, setNewUser] = useState([]);
  const [asOfNow, setAsOfNow] = useState<string>("");
  const [upcomingTab, setUpcomingTab] = useState<boolean>(true)
  const [ongoingTab, setOngoingTab] = useState<boolean>(false)
  const [renderOrganizations, setRenderOrganizations] = useState<boolean>(false)
  const [voted, setVoted] = useState<string>("")

  const [upcomingsError, setUpcomingsError] = useState<string>("")
  const [ongoingsError, setOngoingsError] = useState<string>("")

  const [electionOrgs, setElectionOrgs] = useState<ElectionOrg[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  const { voters, elections, organizations } = useLoaderData() as {
    voters: any[];
    elections: Election[];
    organizations: any[];
    error?: string;
  };


  const getDataDayAndCount = () => {
    const dataDay: [] = [];
    const dataCount: [] = [];

    for (let i = 0; i < newUser.length; i++) {
      dataDay.push(newUser[i][0]);
      dataCount.push(newUser[i][1]);
    }
    return { dataDay, dataCount };
  };
  const { dataDay, dataCount } = getDataDayAndCount();



  useEffect(() => {

    const fetchUpcomings = async () => {
      const data = await getUpcomings()

      setUpComings(data)

      if(data[0].error === "Request failed with status code 404"){
        setUpcomingsError("No Upcoming Elections")
      }else{
        setUpcomingsError(data[0].error)
      }
      
    }

    const fetchOngoings = async () => {
      const data = await getOngoings()

      setOngoings(data)

      if(data[0].error === "Request failed with status code 404"){
        setOngoingsError("No Ongoing Elections")
      }else{
        setOngoingsError(data[0].error)
      }
    }

    const fetchAnalyticsData = async () => {
      const data = await getAnalyticsData()
      setNewUser(data)
    }

    const fetchActivities = async () => {
      const data = await getVotedActivities()
      setVoted(String(data.count ?? "0"))
      setActivities(data.activities)
    }

    fetchActivities()
    fetchOngoings()
    fetchUpcomings()
    fetchAnalyticsData()

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
  //add [ newUser, upcomings ] dependency above on production

  const data = {
    labels: dataDay,
    datasets: [
      {
        label: "New Registered Voter",
        data: dataCount,
        fill: true,
        backgroundColor: "rgba(68,74,94,0.2)",
        borderColor: "#766cf0",
        borderWidth: 5,
      },
    ],
  };


  //Activate Election to Ongoing
  const activateElection = (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };
      axios.patch(`http://localhost:3000/election/status/to-ongoing/${id}`, {}, config)
        .then(response => {
          console.log(response.data);
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
  const getOrganizations = async (id: string) => {
    const response = await getOrganizationsBasedOnId(id)
    setElectionOrgs(response.organizations)
    setRenderOrganizations(true)
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
      console.log(error.message);
      return "Invalid Date";
    }
  };
  

  return (
    <div className="home">
      {/* PHASE I */}
      <div className="boxes py-5 grid md:grid-cols-3 gap-5">
        <div className="all-voters md:drop-shadow-md md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-orange-400 rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            <h1 className="pop-bold text-xl md:text-3xl md:pb-2">
              {voters.length}
            </h1>
            <h3 className="pop-medium text-sm md:text-md">Registered Voters</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <TiGroup className="text-5xl text-center lg:text-8xl hidden md:block" />
          </div>
        </div>

        <div className="all-voters md:drop-shadow-md md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-blue-400 rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            <h1 className="pop-bold text-xl md:text-3xl md:pb-2">
              {elections.length}
            </h1>
            <h3 className="pop-medium text-sm md:text-md">No. of Elections</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <BsCalendar2EventFill className="text-5xl text-center lg:text-7xl hidden md:block" />
          </div>
        </div>

        <div className="all-voters md:drop-shadow-md md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-green-400 rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            <h1 className="pop-bold text-xl md:text-3xl md:pb-2">
              {organizations.length}
            </h1>
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
        <div className="elections lg:col-span-2 text-[#090650] md:bg-white md:py-3 rounded-lg hidden md:block md:drop-shadow-md">
          
          <div className="chart-heading flex items-center justify-between px-5">
            <h1 className="pop-semibold text-sm">Daily New Voters</h1>
            <h2 className="pop-semibold text-xs tracking-widest">{asOfNow}</h2>  
          </div>

          {/* Line Chart */}
          <div className="chart-containera flex justify-center items-center h-full w-full">
            <div className="chart-wrapper w-full flex justify-center pb-2 px-4">
              <LineChart chartData={data} />
            </div>
          </div>
        </div>
        <div className="activities">
          <div className="activity-wrapper py-3 px-5 bg-white min-h-full drop-shadow-md rounded-2xl">
            <h3 className="pb-1 pop-semibold text-xs text-[#090650]">
              Current Election Turnout
            </h3>

            <div className="card p-10 bg-[#090650] rounded-xl text-center text-white">
              <h2 className="text-2xl pop-bold">
                <span className="text-[#00ffdf]">{voted}</span>
                <span className="pop-regular px-4">out of</span>{voters.length}
              </h2>
              <p className="opacity-50">the votes used</p>
            </div>

            {/* Activities */}
            <h3 className="text-[#090650] pop-semibold text-xs text-center pt-4 pb-2 shadow-sm rounded-md">
              Voting Activity
            </h3>

            <div className="voting-activity overflow-y-auto max-h-60 px-4">
              {activities?.map((activity) => (
                  <div key={activity.id} className="activity flex justify-between items-center pt-2 text-[#090650]">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={activity.user.profile_picture}
                      alt="profile picture"
                    />
                    <div className="name-date">
                      <h2 className="pop-semibold lg:text-xs">{activity.user.fullname}</h2>
                      <p className="opacity-50 pop-regular text-xs">
                        {formatStamp(activity.createdAt)}
                      </p>
                    </div>
                    <h3 className="pop-semibold text-sm text-[#26d1ad]">Voted</h3>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* PHASE II */}

      {/* PHASE III */}
      <div className="election-wrapper rounded-md bg-white">
        <div className="eletion-tab flex justify-evenly gap-4 my-5">
          <button onClick={handleUpcomingTab} className={`text-center text-xs md:text-lg pop-bold shadow-sm py-5 w-full ${ upcomingTab ? `bg-gradient-to-r from-[#7268EF] to-[#9D93F6] text-white rounded-md ` : `` }`}>
            Upcoming Elections
          </button>
          <button onClick={handleOngoingTab} className={`text-center text-xs md:text-lg pop-bold shadow-sm py-5 w-full ${ ongoingTab ? `bg-gradient-to-r from-[#7268EF] to-[#9D93F6] text-white rounded-md ` : `` }`}>
            Ongoing Elections
          </button>
        </div>
        {/* Elections Table */}
        { upcomingTab && <ElectionTable election={upcomings} error={upcomingsError} handleElection={activateElection} action='activate' actionStyle='hover:bg-sky-800 border-2 border-blue-400 hover:text-white'/> }
        { ongoingTab && <ElectionTable election={ongoings} error={ongoingsError} handleElection={getOrganizations} action='view' actionStyle='hover:bg-emerald-800 border-2 border-green-400 hover:text-white'/> }
      

        {renderOrganizations && <h2 className='text-sm pop-bold bg-white py-4 mt-2 text-sky-950 w-full text-center'>Active Organizations Election</h2>}

        <div className="election-per-organizations px-5 py-3 grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {!renderOrganizations ? "" : (electionOrgs?.map((org) => (
            
            <div className="single-or bg-white rounded-lg drop-shadow-md p-4 text-xs pop-medium" key={org.id}>
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
  );
};

export const homeLoader = async () => {
  const totalVotersData = fetchData("get-all-voters");
  const totalElectionsData = fetchData("election");
  const totalOrganizationsData = fetchData("organization");

  const [voters, elections, organizations] = await Promise.all([
    totalVotersData,
    totalElectionsData,
    totalOrganizationsData,
  ]);

  return { voters, elections, organizations };
};
