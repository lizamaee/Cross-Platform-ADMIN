import { BsFillChatSquareDotsFill, BsFillSunFill, BsMoonFill } from 'react-icons/bs'
import {FiBell} from 'react-icons/fi'
import { useVoter } from '../../hooks/queries/useAdmin'
import { useAuthStore } from '../../hooks/state'
import Lottie from 'lottie-react'
import welcome from '../../assets/welcome.json'
import StarterVoter from '../../components/StarterVoter'
import { useOngoingElections } from '../../hooks/queries/useVoter'
import { Skeleton } from 'antd'
import { useState } from 'react'

export default function VHome() {
  const { isNight, switchMode, student_id } = useAuthStore((state) => state)

  //ONGOING ELECTIONS QUERY HOOK
  const ongoingElectionsQuery = useOngoingElections()

  const voterQuery = useVoter(student_id)

  const firstname = voterQuery?.data?.voter?.firstname
  const surname = voterQuery?.data?.voter?.surname
  const profile_picture = voterQuery?.data?.voter?.profile_picture

  return (
    <div>
      {/* NOTIFICATION HEADER */}
      <div className="notification flex justify-end">
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

      <h1 className='text-[#1c295d] dark:text-gray-300 text-lg pop-medium'>Dashboard</h1>

      {/* WELCOME AND PROFILE CARD */}
      <div className="cards grid grid-cols-10 gap-5">
        <div className="welcome relative bg-[#585de5a3] shadow-md p-5 rounded-xl col-span-10 md:col-span-7">
          <div className="welcome-info flex flex-col justify-center h-full">
            <h2 className="md:text-2xl pop-bold text-white tracking-widest">Welcome!</h2>
            <p className='md:pr-32 text-white pop-regular pt-1 text-sm'>Greetings dear student, your votes shape the future. Engage, express, and make a difference through our student voting system.</p>
            <div className="btn-vote-now flex justify-center pt-1 md:pt-4">
              <button className='bg-[#ffc739] transition duration-300 ease-in-out hover:bg-yellow-500 text-white pop-semibold rounded-full py-2 px-4 text-sm md:text-md'>Participate Now</button>
            </div>
          </div>
          <div className="welcome-animation hidden translate-x-6 -translate-y-10 md:block absolute top-0 right-0" style={{ width: '200px', height: '200px' }}>
            <Lottie animationData={welcome} loop={true} />
          </div>
        </div>

        {/* PROFILE */}
        <div className="profile shadow-md hidden md:flex flex-col col-span-3 p-5 bg-white dark:bg-[#313131] rounded-xl">
          <h4 className='text-[#1c295d] dark:text-gray-400 pop-medium'>Profile</h4>
          <div className="prof flex flex-col justify-center items-center">
            {voterQuery?.isLoading
              ?  <Skeleton.Avatar size={80} active />
              : <img src={profile_picture ?? "https://shorturl.at/tJU24"} alt={`${firstname ?? "John Doe"} Profile Picture`} className='w-20 h-20 border-[6px] shadow-md border-gray-100 dark:border-zinc-700 object-cover rounded-full' />
            }
            
            {voterQuery?.isLoading
              ? <span className='pt-3'>
                  <Skeleton.Input active />
                </span>
              : <h2 className='text-[#1c295d] dark:text-gray-200 text-lg pop-semibold pt-3 pb-1 tracking-wide capitalize'>{firstname === null ? "John Doe" : firstname + " " + surname}</h2>
            }
            <h5 className='text-[#ccd2e3] dark:text-gray-500'>Student Voter</h5>
          </div>
        </div>
        {/* PROFILE */}
      </div>
      {/* WELCOME AND PROFILE CARD */}

      {/* EDIT INFO OR SHOW ONGOING ELECTIONS */}
      {ongoingElectionsQuery?.isLoading
        ? <div className="loadin flex flex-col gap-3 items-center dark:text-gray-400 justify-center mt-10">
            <h3 className='pop-semibold'>Loading...</h3>
          </div>
        : firstname === null && surname === null && profile_picture === null
          ? <StarterVoter firstname={firstname} profile={profile_picture} />
          : <div className="elections-body shadow-md bg-white dark:bg-[#313131] mt-5 rounded-lg">
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
                          <div key={index} className="ongoing dark:bg-zinc-700 bg-gray-100 shadow-md rounded-xl overflow-hidden">
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
      {/* EDIT INFO OR SHOW ONGOING ELECTIONS */}
    </div>
  )
}
