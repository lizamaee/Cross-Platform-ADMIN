import { Skeleton } from "antd"
import { useUsers } from "../../../hooks/queries/useAdmin"
import { FaUser } from "react-icons/fa"
import { useMemo, useState } from "react"

export default function VoterTab() {
    const [searchQuery, setSearchQuery] = useState<string>('')

    //USER HOOKS
    //GET ALL
    const usersQuery = useUsers()

    //FILTER ALL ADMIN
    const adminFilter = usersQuery?.data?.filter((user:any) => user.role === 'user')
    //console.log(usersQuery.data);
    
    //SEARCH BY ID
    const byId = useMemo(() => {
        return usersQuery?.data?.filter((user:any) => {
            return user.student_id.includes(searchQuery.toLowerCase())
        })
    }, [usersQuery, searchQuery])


    
    return (
        <div className="py-5 px-3 bg-white dark:bg-[#303030] rounded-b-lg shadow-md">
            <div className="voterTab-container">
                {/* VOTERS */}
                <div className="all-voters h-32 md:drop-shadow-md grid md:grid-cols-2 md:gap-2 px-3 place-items-center bg-[#ff9062] rounded-xl text-white text-center md:text-left">
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
                    <h3 className="pop-medium text-sm md:text-md  px-2 rounded-md shadow-lg">No. Voters</h3>
                    </div>
                    <div className="icon md:flex justify-center items-center hidden">
                    <FaUser size={50} className="text-center" />
                    </div>
                </div>
                {/* VOTERS */}

                {/* ACTIONS */}
                <h3 className="pt-5 pop-semibold text-gray-900 dark:text-gray-300">Actions</h3>
                <div className="actions pop-medium flex gap-2 md:gap-5 border-b-2 py-4 border-dashed dark:border-gray-500">
                    <button className="border-2 py-1 px-2 rounded-md dark:text-gray-500 dark:border-gray-500 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-500">Recover Voters Account</button>
                    <button className="border-2 py-1 px-2 rounded-md dark:text-gray-500 dark:border-gray-500 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-500">Delete Voters Account</button>
                </div>
                {/* ACTIONS */}

                {/* SEARCH VOTERS */}
                <div className="search-container py-5">
                    <div className="search-bar flex justify-end">
                        <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search" className="border-2 border-gray-400 bg-transparent py-1 px-3 rounded-md focus:border-indigo-400 outline-none pop-regular dark:text-gray-300 w-full md:w-fit" />
                    </div>
                    <h4 className="text-center pop-semibold uppercase py-3 dark:text-gray-200">Voters</h4>
                    <div className="search-result centered px-2 md:px-3 max-h-72 overflow-y-auto dark:text-gray-200 border-y-2 dark:border-zinc-600">
                        {searchQuery && (
                            <table className="w-full pop-regular text-sm">
                                <thead>
                                    <tr className="text-center pop-semibold py-5">
                                        <td className="py-4">Fullname</td>
                                        <td className="py-4">Student ID</td>
                                        <td className="py-4">Mobile Number</td>
                                    </tr>
                                </thead>
                                <tbody>
                                {byId.map((user:any, index:any) => (
                                    <tr key={index} className="odd:bg-gray-100 dark:odd:bg-zinc-700 text-center opacity-80">
                                        <td className="rounded-sm py-2">{user.fullname}</td>
                                        <td className="rounded-sm py-2">{user.student_id}</td>
                                        <td className="rounded-sm py-2">{user.mobile_number}</td>
                                    </tr>
                                )
                                )}
                                </tbody>
                            </table>
                        )}

                    </div>
                </div>
                {/* SEARCH VOTERS */}
            </div>
        </div>
    )
}
