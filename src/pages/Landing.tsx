import { MdOutlineHowToVote } from 'react-icons/md'
import { IoMenu,IoClose } from 'react-icons/io5'
import {ReactComponent as VBallot} from '../assets/votingphoto.svg'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Landing() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const handlerOpenNav = (e:any) =>{
    e.preventDefault()
    setIsNavOpen(!isNavOpen)
  }
  return (
    <div className='landing-container'>
      <nav className={`lg:hidden absolute z-30 top-0 w-full pt-8 pb-5 pr-7 pl-5 bg-[#E5E0FF] drop-shadow-md ${
        isNavOpen ? 'translate-y-0' : '-translate-y-full'} transition-all duration-300 ease-in-out`}>
        <div className="close-wrapper flex justify-end">
          <IoClose onClick={handlerOpenNav} size={45} className='text-[#6c63ff]'/>
        </div>
        <ul className='flex gap-2 flex-col pop-semibold py-5'>
          <Link to="/login" className='px-8 py-2 rounded-lg border-2 border-[#6c63ff] '>Login</Link>
          <Link to="/register" className='bg-[#6c63ff] text-[#E5E0FF] dark:text-gray-300 hover:text-[#6c63ff] py-2 px-8 rounded-lg border-2 border-[#6c63ff] hover:border-[#6c63ff] hover:bg-[#E5E0FF] dark:hover:bg-[#2b2b2b]'>Register</Link>
        </ul>
      </nav>

      <nav className='flex pt-8 pb-10 md:py-10 px-8 md:px-14 justify-between text-gray-700 dark:text-gray-300'>
       <div className="title-container flex items-center gap-1">
        <MdOutlineHowToVote className="text-[#6c63ff] h-10 w-10 md:h-16 md:w-16"/>
        <div className="title-box">
          <h2 className='text-xl pop-bold text-[#6c63ff]'>CICT</h2>
          <h3 className='text-xs pop-regular'>Voting System</h3>
        </div>
       </div>
        <ul className='hidden lg:flex gap-10 items-center pop-semibold tracking-widest text-[1.1rem]'>
          <Link to="/login" className='py-2 px-10 rounded-lg border-2 border-[#6c63ff] hover:border-[#6c63ff] hover:bg-[#6c63ff] hover:text-[#E5E0FF] dark:hover:bg-[#6c63ff] drop-shadow-md'>Login</Link>
          <Link to="/register" className='bg-[#6c63ff] text-[#E5E0FF] dark:text-gray-300 hover:text-[#6c63ff] py-2 px-8 rounded-lg border-2 border-[#6c63ff] hover:border-[#6c63ff] hover:bg-[#E5E0FF] dark:hover:bg-[#2b2b2b] drop-shadow-md'>Register</Link>
        </ul>
        <button onClick={handlerOpenNav}  className='lg:hidden focus:outline-none'>
          <IoMenu size={43} className='text-[#6c63ff]'/>
        </button>
      </nav>
      {/* BODY */}
      <div className="body-content text-gray-200 w-full grid items-center grid-rows-2 md:grid-rows-1 md:grid-cols-2 pt-5 md:pt-20 px-8 md:px-10">
        
        <div className="setion-two md:order-2 flex justify-center h-40 md:h-96">
          <VBallot className='h-full w-full drop-shadow-2xl'/>
        </div>

        <div className="section-one md:pt-16 md:pl-5 lg:pr-40">
          <h1 className='text-3xl md:text-6xl pop-bold text-[#34323d] dark:text-[#68e1fd] drop-shadow-lg'>CAST YOUR</h1>
          <h1 className='text-3xl md:text-6xl pop-bold text-[#34323d] dark:text-[#68e1fd] drop-shadow-lg'>VOTE!</h1>
          <p className='pt-3 pop-light text-gray-600 dark:text-gray-300 text-justify text-sm '>You are the leaders of tomorrow! Use our Student voting platform to lead the way and vote for the fututre you want to see in our department.</p>
          <div className='focus:none pt-5 md:pt-10 flex justify-center pb-5'>
            <Link to='/login' className='bg-gradient-to-r from-[#7268EF] to-[#9D93F6] text-md md:text-lg py-2 md:py-4 px-5 md:px-8 rounded-full pop-semibold tracking-wide border-2 border-[#7268EF] hover:border-[#7268EF] hover:from-[#E5E0FF] text-[#E5E0FF] hover:text-[#7268EF] hover:to-[#E5E0FF] dark:hover:from-[#2b2b2b] dark:hover:to-[#2b2b2b] drop-shadow-lg'>Vote Now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
