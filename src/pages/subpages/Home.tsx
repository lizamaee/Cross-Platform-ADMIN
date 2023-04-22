import { TiGroup } from "react-icons/ti";
import { BsCalendar2EventFill } from "react-icons/bs";
import { FaPeopleCarry } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import LineChart from "../../components/LineChart";

interface Election {
  id: number;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
}

export const Home = () => {
  const { voters, elections, organizations, upcomings } = useLoaderData() as {
    voters: any[];
    elections: Election[];
    organizations: any[];
    upcomings: Election[];
    error?: string;
  };
  const [newUser, setNewUser] = useState([]);

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
    const getData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch(
          "http://localhost:3000/user-analytics",
          options
        );
        const data = await response.json();
        setNewUser(data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  //add newUser dependency above on production

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
      <div className="organizations-activities grid md:grid-row-2 lg:grid-cols-3 md:gap-5 ">
        <div className="elections lg:col-span-2 text-[#090650] rounded-lg hidden md:block md:shadow-lg">
          <h1 className="pop-semibold text-sm pl-5">Weekly New Voters</h1>

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
              Current Status
            </h3>

            <div className="card p-10 bg-[#090650] rounded-xl text-center text-white">
              <h2 className="text-2xl pop-bold">
                <span className="text-[#00ffdf]">327 </span>
                <span className="pop-regular">out of</span> 650
              </h2>
              <p className="opacity-50">the votes used</p>
            </div>

            {/* Activities */}
            <h3 className="text-[#090650] pop-semibold text-xs text-center pt-4 pb-2 shadow-sm rounded-md">
              Voting Activity
            </h3>

            <div className="voting-activity overflow-y-auto max-h-60 px-4">
              <div className="activity flex justify-between items-center pt-2 text-[#090650]">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://media.licdn.com/dms/image/C4E03AQGyC0TkddKVzg/profile-displayphoto-shrink_800_800/0/1633844065823?e=2147483647&v=beta&t=7TguBF17gKMrVGw-mcrWkNmuInvG_N0hCVlY0j8arjw"
                  alt="profile picture"
                />
                <div className="name-date">
                  <h2 className="pop-semibold lg:text-xs">Menard Pajares</h2>
                  <p className="opacity-50 pop-regular text-xs">
                    01 apr 2023 12:00
                  </p>
                </div>
                <h3 className="pop-semibold text-sm text-[#26d1ad]">Voted</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* PHASE II */}

      {/* PHASE III */}
      <div className="upcoming-election-wrapper">
        <h3 className="text-center pop-bold shadow-sm mb-5 py-5">
          Upcoming Elections
        </h3>
        {/* Upcoming Elections Table */}
        <table className="w-full h-full text-center pt-10 text-sm overflow-x-scroll">
          <thead>
            <tr className="pop-semibold text-sm py-2">
              <th>Title</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {upcomings.map((entry, index) => (
              <tr
                key={entry.id}
                className={` rounded-md align-middle ${
                  index % 2 === 0 ? "bg-[#eaf4fc]" : "bg-white"
                }`}
              >
                <td className="py-5">{entry.title}</td>
                <td className="py-5">{entry.status}</td>
                <td className="py-5">
                  {new Date(entry.startDate).toLocaleDateString("en-US", {
                    timeZone: "Asia/Manila",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-5">
                  {new Date(entry.endDate).toLocaleDateString("en-US", {
                    timeZone: "Asia/Manila",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <button className="hover:bg-sky-800 border-2 border-blue-400 hover:text-white pop-medium text-center py-2 px-4 rounded-full">
                    activate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* PHASE III */}
    </div>
  );
};

const fetchData = async (endpoints: string) => {
  try {
    const token = localStorage.getItem("adminToken");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(`http://localhost:3000/${endpoints}`, options);

    if (!response) throw new Error("Something Went Wrong");

    return response.json();
  } catch (error: any) {
    console.log(error.message);
    return [{ error: error.message }];
  }
};

export const homeLoader = async () => {
  const totalVotersData = fetchData("get-all-voters");
  const totalElectionsData = fetchData("election");
  const UpcommingElectionsData = fetchData("election/status/upcoming");
  const totalOrganizationsData = fetchData("organization");

  const [voters, elections, upcomings, organizations] = await Promise.all([
    totalVotersData,
    totalElectionsData,
    UpcommingElectionsData,
    totalOrganizationsData,
  ]);

  return { voters, elections, upcomings, organizations };
};
