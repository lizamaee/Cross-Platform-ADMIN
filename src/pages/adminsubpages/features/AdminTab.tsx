import { Skeleton } from 'antd'
import { FaUserShield } from 'react-icons/fa'
import { useUsers } from '../../../hooks/queries/useAdmin'




export default function AdminTab() {
    //USER HOOKS
    //GET ALL
    const usersQuery = useUsers()

    //FILTER ALL ADMIN
    const adminFilter = usersQuery?.data?.filter((user:any) => user.role === 'admin')

    return (
        <div className='py-5 px-3 bg-white dark:bg-[#303030] rounded-b-lg shadow-md'>
            <div className="adminTab-container">
                <div className="all-voters h-32 md:drop-shadow-md grid md:grid-cols-2 md:gap-2 px-3 place-items-center bg-[#7c41f5] rounded-xl text-white text-center md:text-left">
                    <div className="icon-container text-center">
                    {usersQuery.isLoading ? (
                        <Skeleton.Avatar active shape='circle' size='large' />
                    ) : (
                        <div>
                        <h1 className="pop-bold text-xl md:text-3xl md:pb-2">
                            {adminFilter.length}
                        </h1>
                        </div>
                    )}
                    <h3 className="pop-medium text-sm md:text-md px-2 rounded-lg shadow-lg">No. Admins</h3>
                    </div>
                    <div className="icon md:flex justify-center items-center hidden">
                    <FaUserShield size={60} className="text-center" />
                    </div>
                </div>
            </div>
        </div>
    )
}
