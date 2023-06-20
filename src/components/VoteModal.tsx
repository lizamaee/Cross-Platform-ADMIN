
interface VoteModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
  
export default function VoteModal({ open, onClose, children }: VoteModalProps) {
    return (
        // backdrop
        <div
        onClick={onClose}
        className={`fixed inset-0 flex z-30 justify-center items-center transition-colors ${
            open ? "visible bg-black/40" : "invisible"
        }`}
        >
            {/* Modal */}
            <div
            onClick={(e:any) => e.stopPropagation()} 
            className={`bg-white dark:bg-[#313131] h-5/6 w-5/6 rounded-xl overflow-y-auto centered shadow py-6 px-3 md:px-6 transition-all ${open ? 'scale-100 opacity-100': 'scale-125 opacity-0'}`}>
                {children}  

            </div>
        </div>
    )
}
  