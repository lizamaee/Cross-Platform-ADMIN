import { Drawer, Modal, Skeleton, Spin } from 'antd'
import { FaUserShield } from 'react-icons/fa'
import { useChangeRole, useUsers } from '../../../hooks/queries/useAdmin'
import { useState } from 'react'
import { ZodType, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type PromoteFormData = {
    student_id: string;
}


export default function AdminTab() {
    //USER HOOKS
    //GET ALL
    const usersQuery = useUsers()

    //FILTER ALL ADMIN
    const adminFilter = usersQuery?.data?.filter((user:any) => user.role === 'admin')

    //DEMOTION HOOKS
    const {mutate:demoteAdmin} = useChangeRole()

    //DEMOTE FUNCTION
    const handleDemote = async (id:string) => {
        demoteAdmin({
            student_id: id,
            new_role: 'user'
        })
    }

    //DEMOTE ADMIN CONFIRMATION MODAL
    const demoteIt = (id: string, name: string) => {
        Modal.confirm({
        title: 'Do you want to demote this Admin?',
        content: `Demoting admin: ${name}`,
        className: 'text-gray-700',
        onOk() {
            return new Promise((resolve, reject) => {
            handleDemote(id)
                .then(resolve)
                .catch(reject);
            }).catch(() => console.log('Oops, an error occurred!'));
        },
        onCancel() {},
        });
    }

    //OPEN PROMOTE DRAWER STATE
    const [openPromote, setOpenPromote] = useState(false)

    //OPEN PROMOTE DRAWER FUNCTION
    const showPromoteDrawer = () => {
        setOpenPromote(true)
    }
    
    //CLOSE PROMOTE DRAWER FUNCTION
    const onClosePromote = () => {
        promoteReset()
        setOpenPromote(false)
    }

    //PROMOTE ACCOUNT FORM SCHEMA
    const promoteSchema: ZodType<PromoteFormData> = z.object({
        student_id: z.string().regex(/^\d{7}$/, {message: "Student ID must be a valid Student ID"}).min(7).max(7)
    })
    const {register:promoteRegister, handleSubmit:handleSubmitPromote, formState:{errors:errorPromote}, reset:promoteReset} = useForm<PromoteFormData>({resolver: zodResolver(promoteSchema)})


    //PROMOTE USE QUERY HOOK
    const {mutate: promoteAccount, isLoading: isPromoting} = useChangeRole()
    //PROMOTE ACCOUNT FUNCTION
    const handlePromote = (data: PromoteFormData) => {
        promoteAccount({
            student_id: data.student_id,
            new_role: 'admin'
        })
    }

    return (
        <div className='py-5 px-3 bg-white dark:bg-[#303030] rounded-b-lg shadow-md'>
            <div className="adminTab-container">
                <div className="all-voters h-32 md:drop-shadow-md grid md:grid-cols-2 md:gap-2 px-3 place-items-center bg-[#966EE7] rounded-xl text-white text-center md:text-left">
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
                {/* ACTIONS */}
                <h3 className="pt-5 pop-semibold text-gray-900 dark:text-gray-300">Actions</h3>
                <div className="actions pop-medium flex flex-col md:flex-row gap-2 md:gap-5 border-b-2 py-4 border-dashed dark:border-gray-500">
                    <button onClick={showPromoteDrawer} className="border-2 py-1 px-2 rounded-md dark:text-gray-500 dark:border-gray-500 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-500">Promote to Admin</button>
                    <button className="border-2 py-1 px-2 rounded-md dark:text-gray-500 dark:border-gray-500 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-500">Upload Student ID</button>
                </div>
                {/* ACTIONS */}
                {/* ADMINS */}
                <div className="admins overflow-y-auto dark:text-gray-200 pt-7">
                    <table className="w-full pop-regular text-sm">
                        <thead>
                            <tr className="text-center pop-semibold py-5">
                                <td className="py-4">Fullname</td>
                                <td className="py-4">Mobile Number</td>
                                <td className="py-4">Role</td>
                                <td className="py-4">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {adminFilter.map((admin:any, index:any) => (
                                <tr key={index} className="odd:bg-gray-100 dark:odd:bg-zinc-700 text-center">
                                    <td className="rounded-sm py-2 opacity-80">{admin.fullname}</td>
                                    <td className="rounded-sm py-2 opacity-80">{admin.mobile_number}</td>
                                    <td className="rounded-sm py-2 opacity-80">{admin.role}</td>
                                    <td className="rounded-sm py-2">
                                        <button onClick={() => demoteIt(admin.student_id, admin.fullname)} className='bg-yellow-400 dark:bg-yellow-500 opacity-100 text-xs md:text-sm py-1 px-2 rounded-lg hover:bg-yellow-500'>Demote</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* ADMINS */}
            </div>
            {/* PROMOTE ACCOUNT DRAWER */}
            <Drawer title="Promote Account" placement="right" onClose={onClosePromote} open={openPromote}>
                <form className="promote-account-container py-3">
                    <div className="name flex flex-col pop-medium">
                        <label className='pb-1 pt-5 opacity-80'>Enter Student ID</label>
                        <input 
                            {...promoteRegister('student_id')}
                            placeholder="ex. 1234567"
                            maxLength={7}
                            minLength={7}
                            className='py-2 px-3 text-lg bg-[#E5E0FF] focus:outline-indigo-400 rounded-md border-solid border-2' 
                        />
                        {errorPromote.student_id && <span className="text-red-400 text-center text-sm">{errorPromote.student_id.message}</span>}
                    </div>
                </form>
                {/* PROMOTE BUTTON */}
                <div className="btn-container flex items-center justify-center pt-3">
                    {!isPromoting
                    ? <button className='flex items-center border-2 border-blue-400 text-blue-400 py-2 px-7 rounded-full' onClick={handleSubmitPromote(handlePromote)}>
                        <p className='pop-medium'>Promote</p>   
                        </button>
                    : <button disabled={isPromoting} className='flex pop-medium items-center border-2 border-blue-400 text-blue-400 py-2 px-3 rounded-full'>
                        Promoting...
                        <Spin className='pl-1'/> 
                        </button>
                    }
                </div>
                {/* PROMOTE BUTTON */}
            </Drawer>
            {/* PROMOTE ACCOUNT DRAWER */}
        </div>
    )
}
