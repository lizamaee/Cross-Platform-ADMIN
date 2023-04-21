import { TiGroup } from 'react-icons/ti'
import { BsCalendar2EventFill } from 'react-icons/bs'
import { FaPeopleCarry } from 'react-icons/fa'

export default function Home() {
  return (
    <div className='home'>
      <div className="boxes py-5 grid md:grid-cols-3 gap-5">
        
        <div className="all-voters md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-red-400 rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            <h1 className='pop-bold text-xl md:text-3xl md:pb-2'>3059</h1>
            <h3 className='pop-medium text-sm md:text-md'>Registered Voters</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <TiGroup className='text-5xl text-center lg:text-8xl hidden md:block'/>
          </div>
        </div>
        
        <div className="all-voters md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-blue-400 rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            <h1 className='pop-bold text-xl md:text-3xl md:pb-2'>8</h1>
            <h3 className='pop-medium text-sm md:text-md'>No. of Elections</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <BsCalendar2EventFill className='text-5xl text-center lg:text-7xl hidden md:block'/>
          </div>
        </div>
        
        <div className="all-voters md:grid md:grid-cols-2 md:gap-2 py-3 px-3 md:py-4 bg-green-400 rounded-xl text-white text-center md:text-left">
          <div className="icon-container text-center">
            <h1 className='pop-bold text-xl md:text-3xl md:pb-2'>5</h1>
            <h3 className='pop-medium text-sm md:text-md'>No. of Organizations</h3>
          </div>
          <div className="icon flex justify-center items-center">
            <FaPeopleCarry className='text-5xl text-center lg:text-8xl hidden md:block'/>
          </div>
        </div>

      </div>
    </div>
  )
}
