import { IoClose } from "react-icons/io5";

interface VoteModalProps {
    title: string;
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
  
export default function VoteModal({title, open, onClose, children }: VoteModalProps) {
    return (
        // backdrop
        <div
        onClick={onClose}
        className={`fixed inset-0 flex z-30 flex-col justify-center items-center transition-colors ${
            open ? "visible bg-black/70" : "invisible"
        }`}
            >
            <div onClick={(e:any) => e.stopPropagation()} className="close items-center bg-white py-3 px-5 rounded-t-xl dark:bg-[#313131] flex w-5/6 border-b-[1px] dark:border-gray-600 justify-end">
                <h4 className="text-md md:text-xl dark:text-gray-100 pop-bold uppercase sm:tracking-[.4rem] flex-grow text-center">{title}</h4>
                <button onClick={onClose} className="p-1 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-zinc-700">
                    <IoClose size={25}/>
                </button>
            </div>
            {/* Modal */}
            <div
            onClick={(e:any) => e.stopPropagation()} 
            className={`bg-white dark:bg-[#313131] h-5/6 w-5/6 rounded-b-lg overflow-y-auto centered shadow py-4 px-3 md:px-6 transition-all ${open ? 'scale-100 opacity-100': 'scale-125 opacity-0'}`}>
                
                {children}  
            </div>

        </div>
    )
}
  