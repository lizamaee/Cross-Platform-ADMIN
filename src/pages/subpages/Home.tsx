import { TiGroup } from 'react-icons/ti'
import { BsCalendar2EventFill } from 'react-icons/bs'
import { FaPeopleCarry } from 'react-icons/fa'
import { useLoaderData } from 'react-router-dom'

interface Election {
  id: number;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
}


export const Home = () => {
  const election = useLoaderData() as Election[]
  
  return (
    <div className='home'>

      {/* PHASE I */}
      <div className="boxes py-5 grid md:grid-cols-3 gap-5">
        
        <div className="all-voters md:drop-shadow-md md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-red-400 rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            <h1 className='pop-bold text-xl md:text-3xl md:pb-2'>3059</h1>
            <h3 className='pop-medium text-sm md:text-md'>Registered Voters</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <TiGroup className='text-5xl text-center lg:text-8xl hidden md:block'/>
          </div>
        </div>
        
        <div className="all-voters md:drop-shadow-md md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-blue-400 rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            <h1 className='pop-bold text-xl md:text-3xl md:pb-2'>8</h1>
            <h3 className='pop-medium text-sm md:text-md'>No. of Elections</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <BsCalendar2EventFill className='text-5xl text-center lg:text-7xl hidden md:block'/>
          </div>
        </div>
        
        <div className="all-voters md:drop-shadow-md md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-green-400 rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            <h1 className='pop-bold text-xl md:text-3xl md:pb-2'>5</h1>
            <h3 className='pop-medium text-sm md:text-md'>No. of Organizations</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <FaPeopleCarry className='text-5xl text-center lg:text-8xl hidden md:block'/>
          </div>
        </div>
      </div>
      {/* PHASE I */}

      {/* PHASE II */}
      <div className="organizations-activities grid md:grid-row-2 lg:grid-cols-3 md:gap-5 ">
        <div className="elections lg:col-span-2 text-[#090650]">
          <h3 className='text-center pop-bold shadow-sm mb-5 py-2' >Upcoming Elections</h3>
          <table className='w-full h-full text-center pt-10 text-sm overflow-x-scroll'>
            <thead>
              <tr className='pop-semibold text-sm'>
                <th>Title</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {election.map((entry, index) => (
                <tr key={entry.id} className={` rounded-md ${index % 2 === 0 ? 'bg-[#eaf4fc]' : 'bg-white'}`}>
                  <td className=''>{entry.title}</td>
                  <td>{entry.status}</td>
                  <td>{new Date(entry.startDate).toLocaleDateString('en-US', {timeZone: 'Asia/Manila', day: 'numeric', month: 'short', year: 'numeric'})}</td>
                  <td>{new Date(entry.endDate).toLocaleDateString('en-US', {timeZone: 'Asia/Manila', day: 'numeric', month: 'short', year: 'numeric'})}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="activities">

          <div className="activity-wrapper py-3 px-5 bg-white drop-shadow-md rounded-2xl">
            
            <h3 className='pb-1 pop-semibold text-xs text-[#090650]'>Current Status</h3>
            
            <div className="card p-10 bg-[#090650] rounded-xl text-center text-white">
              <h2 className='text-2xl pop-bold'><span className='text-[#00ffdf]'>327 </span><span className='pop-regular'>out of</span> 650</h2>
              <p className='opacity-50'>the votes used</p>
            </div>

            
            <h3 className='text-[#090650] pop-semibold text-xs text-center pt-4 pb-2 shadow-sm rounded-md'>Voting Activity</h3>

            <div className="voting-activity overflow-y-auto max-h-60 px-4">
              
              <div className="activity flex justify-between items-center pt-2 text-[#090650]">
                <img className='w-8 h-8 rounded-full' src="https://media.licdn.com/dms/image/C4E03AQGyC0TkddKVzg/profile-displayphoto-shrink_800_800/0/1633844065823?e=2147483647&v=beta&t=7TguBF17gKMrVGw-mcrWkNmuInvG_N0hCVlY0j8arjw" alt="profile picture" />
                <div className="name-date">
                  <h2 className='pop-semibold lg:text-xs'>Menard Pajares</h2>
                  <p className='opacity-50 pop-regular text-xs'>01 apr 2023 12:00</p>
                </div>
                <h3 className='pop-semibold text-sm text-[#26d1ad]'>Voted</h3>
              </div>

            </div>

          </div>
        </div>
      </div>
      {/* PHASE II */}
    </div>
  )
}

export const homeLoader = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const res = await fetch("http://localhost:3000/election/status/upcoming", options);
    const elections = await res.json();
    
    return elections

  } catch (error: any) {
    console.log(error.message);
    return [ { error: error.message } ]
    
  }
}