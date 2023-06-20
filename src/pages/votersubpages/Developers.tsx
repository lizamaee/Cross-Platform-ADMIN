import { BsFillSunFill, BsMoonFill } from 'react-icons/bs'
import { useAuthStore } from '../../hooks/state'
import { FiBell } from 'react-icons/fi'
import { RiFacebookFill, RiGithubFill, RiInstagramFill, RiLinkedinFill, RiTwitterFill } from 'react-icons/ri'
import DeveloperCard from '../../components/DeveloperCard'
import menard from '../../images/menard.png'

export default function Developers() {
  const {isNight, switchMode} = useAuthStore((state) => state)
  return (
    <div>
      <h1 className='text-[#1c295d] dark:text-gray-300 text-xl pt-1 md:pt-5 text-center pop-bold'>Developers</h1>
      {/* NOTIFICATION HEADER */}
      <div className="notification pt-3 flex justify-end">
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

      {/* DEVELOPER PROFILE CARD */}
      <div className="dev-cards gap-10 grid md:grid-cols-2 lg:grid-cols-3 pb-5 pt-3 px-5">
        {/* MENARD PAJARES */}
        <DeveloperCard fullname='Menard M. Pajares' tag='@menardpajares' profile={menard} motto='" The best revenge is a massive success. "' role='Fullstack Developer'>
          <ul className='flex justify-center gap-3 py-5 '>
            <li className='text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'>
              <a href="https://github.com/DevNanad" target="_blank">
                <RiGithubFill size={23}/>
              </a>
            </li>
            <li className='text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'>
              <a href="https://www.linkedin.com/in/pajares-menard-m-986a55222/" target="_blank">
                <RiLinkedinFill size={23}/>
              </a>
            </li>
            <li className='text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'>
              <a href="https://www.facebook.com/jheeyiem" target="_blank">
                <RiFacebookFill size={23}/>
              </a>
            </li>
            <li className='text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'>
              <a href="https://twitter.com/Kyah_Nad" target="_blank">
                <RiTwitterFill size={23}/>
              </a>
            </li>
          </ul>
        </DeveloperCard>
        {/* MENARD PAJARES */}
        {/* LIZA MAE NECERIO */}
        <DeveloperCard fullname='Liza Mae N. Necerio' tag='@lizamaenecerio' profile='https://shorturl.at/dmHUW' motto='" Lorem ipsum dolor sit amet consectetur adipisicing elit. "' role='UI/UX Designer'>
          <ul className='flex justify-center gap-3 py-5 '>
            <li className='text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'>
              <a href="https://github.com/lizamaee" target="_blank">
                <RiGithubFill size={23}/>
              </a>
            </li>
            <li className='text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'>
              <a href="https://www.facebook.com/maemae.necerio" target="_blank">
                <RiFacebookFill size={23}/>
              </a>
            </li>
            <li className='text-gray-800 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'>
              <a href="https://www.instagram.com/zamaenecerio/" target="_blank">
                <RiInstagramFill size={23}/>
              </a>
            </li>
          </ul>
        </DeveloperCard>
        {/* LIZA MAE NECERIO */}
      </div>
      {/* DEVELOPER PROFILE CARD */}
    </div>
  )
}
