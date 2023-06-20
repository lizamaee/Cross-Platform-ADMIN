
interface DeleteMeProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
  
export default function DeleteMe({ open, onClose, children }: DeleteMeProps) {
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
            className={`rounded-xl overflow-y-auto centered shadow p-6 transition-all ${open ? 'scale-100 opacity-100': 'scale-125 opacity-0'}`}>
                {children}  

            </div>
        </div>
    )
}
  