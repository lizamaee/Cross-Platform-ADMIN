
interface CardProps {
    fullname: string;
    tag: string;
    profile: string;
    children: React.ReactNode;
    motto: string;
    role: string;
}

export default function DeveloperCard({fullname, tag, profile, children, motto, role}: CardProps) {
  return (
    <div className="me rounded-[4.5rem] bg-white dark:bg-zinc-700 drop-shadow-2xl overflow-hidden">
          <div className="img-profile bg-[#C46479] py-5 flex justify-center">
            <img src={profile} alt="profile" className='w-28 h-28 drop-shadow-2xl object-cover rounded-full'/>
          </div>
          <div className="custom-shape-divider-top-1686926171 ">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path opacity='.7' d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill0"></path>
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".8" className="shape-fill1"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".7" className="shape-fill2"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill3"></path>
            </svg>
          </div>
          <div className="info p-5 pop-regular relative">
            <div className="fullname text-center relative z-[1] pop-semibold text-gray-900 dark:text-gray-100">
              <h2>{fullname}</h2>
            </div>
            <h6 className='text-xs text-center relative z-[1] text-gray-400'>{tag}</h6>
            <div className="relative z-[1]">
              {children}
            </div>
            <div className="moto text-xs relative z-[1] h-14 overflow-y-auto centered text-center px-10 text-gray-500 dark:text-gray-300">
                <p>{motto}</p>
            </div>
            <h2 className='pop-bold relative z-[1] text-gray-700 dark:text-gray-200 text-sm tracking-widest text-center pt-4'>{role}</h2>
            <h1 className="pop-extrabold z-[0] rotate-6 uppercase text-5xl absolute top-16 text-center tracking-widest left-5 text-gray-300 dark:text-gray-600 opacity-25">{role}</h1>
          </div>
        </div>
  )
}
