import { Drawer, Skeleton, Spin } from "antd"
import { useUsers } from "../../../hooks/queries/useAdmin"
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa"
import { useMemo, useState } from "react"
import { ZodType, z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDeleteAccount, useRecoverAccount } from "../../../hooks/queries/useVoter"

type RecoverFormData = {
    student_id: string;
    newMobileNumber: string;
    newPassword: string;
    pin_code: string;
}

type DeleteFormData = {
    student_id: string;
}

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

     //OPEN RECOVER DRAWER STATE
    const [open, setOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    //OPEN DELETE DRAWER STATE
    const [openDelete, setOpenDelete] = useState(false)

    //OPEN RECOVER DRAWER FUNCTION
    const showDrawer = () => {
        setOpen(true)
    }
    
    //CLOSE RECOVER DRAWER FUNCTION
    const onClose = () => {
        reset()
        setOpen(false)
    }

    //SHOW or HIDE PASSWORD
    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    //RECOVER USE QUERY HOOK
    const {mutate: recoverAccount, isLoading: isRecovering} = useRecoverAccount()
    //RECOVER ACCOUNT FUNCTION
    const handleRecover = async (data: RecoverFormData) => {
        recoverAccount({
            student_id: data.student_id, 
            new_password: data.newPassword, 
            mobile_number: data.newMobileNumber,
            pin_code: data.pin_code
        },
        {
            onSettled: () => {
                reset();
              },
        }
        )
    }

    //RECOVER ACCOUNT FORM SCHEMA
    const schema: ZodType<RecoverFormData> = z.object({
        student_id: z.string().regex(/^\d{6,7}$/, {message: "Student ID must be a valid Student ID"}).min(6).max(7),
        newPassword: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*])/, {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character",
        }).min(14, {message: "Password must contain at least 14 character(s)"}).max(30),
        newMobileNumber: z.string().regex(/^09\d{9}$/, {message: "Mobile number must be a valid PH Mobile Number",
        }).min(11).max(11),
        pin_code: z
        .string()
        .regex(/^\d{4}$/, { message: "PIN code must be 4 digit numbers" })
        .min(4)
        .max(4),
    })
    const {register, handleSubmit, formState:{errors}, reset} = useForm<RecoverFormData>({resolver: zodResolver(schema)})


    //OPEN DELETE DRAWER FUNCTION
    const showDeleteDrawer = () => {
        setOpenDelete(true)
    }
    
    //CLOSE DELETE DRAWER FUNCTION
    const onCloseDelete = () => {
        deleteReset()
        setOpenDelete(false)
    }

    //DELETE ACCOUNT FORM SCHEMA
    const deleteSchema: ZodType<DeleteFormData> = z.object({
        student_id: z.string().regex(/^\d{6,7}$/, {message: "Student ID must be a valid Student ID"}).min(6).max(7)
    })
    const {register:deleteRegister, handleSubmit:handleSubmitDelete, formState:{errors:errorDelete}, reset:deleteReset} = useForm<DeleteFormData>({resolver: zodResolver(deleteSchema)})


    //DELETE USE QUERY HOOK
    const {mutate: deleteAccount, isLoading: isDeleting} = useDeleteAccount()
    //DELETE ACCOUNT FUNCTION
    const handleDelete = (data: DeleteFormData) => {
        deleteAccount(data.student_id,
            {
                onSettled: () => deleteReset()
            })
    }

    return (
        <div className="py-5 px-3 bg-white dark:bg-[#303030] rounded-b-lg shadow-md">
            <div className="voterTab-container">
                {/* VOTERS */}
                <div className="all-voters h-32 md:drop-shadow-md grid md:grid-cols-2 md:gap-2 px-3 place-items-center bg-[#ff9062] rounded-xl text-white text-center md:text-left">
                    <div className="icon-container text-center">
                    {usersQuery?.isLoading ? (
                        <Skeleton.Avatar active shape='circle' size='large' />
                    ) : (
                        <div>
                        <h1 className="pop-bold text-xl md:text-3xl md:pb-2">
                            {adminFilter?.length}
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
                <div className="actions pop-medium flex flex-col md:flex-row gap-2 md:gap-5 border-b-2 py-4 border-dashed dark:border-gray-500">
                    <button onClick={showDrawer} className="border-2 py-1 px-2 rounded-md dark:text-gray-500 dark:border-gray-500 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-500 text-xs sm:text-sm">Recover Voters Account</button>
                    <button onClick={showDeleteDrawer} className="border-2 py-1 px-2 rounded-md dark:text-gray-500 dark:border-gray-500 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-500 text-xs sm:text-sm">Delete Voters Account</button>
                </div>
                {/* ACTIONS */}

                {/* SEARCH VOTERS */}
                <div className="search-container py-5">
                    <div className="search-bar flex justify-end">
                        <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search using ID" className="border-2 border-gray-400 bg-transparent py-1 px-3 rounded-md text-xs sm:text-sm focus:border-indigo-400 outline-none pop-regular dark:text-gray-300 w-full md:w-fit" />
                    </div>
                    <h4 className="text-center pop-semibold uppercase py-3 dark:text-gray-200 text-xs sm:text-lg">Voters</h4>
                    <div className="search-result centered px-2 md:px-3 max-h-72 overflow-y-auto dark:text-gray-200 border-y-2 dark:border-zinc-600">
                        {searchQuery && (
                            <table className="w-full pop-regular text-sm">
                                <thead>
                                    <tr className="text-center pop-semibold py-5">
                                        <td className="py-4 text-xs sm:text-sm">Fullname</td>
                                        <td className="py-4 text-xs sm:text-sm">Student ID</td>
                                        <td className="py-4 text-xs sm:text-sm">Mobile Number</td>
                                    </tr>
                                </thead>
                                <tbody>
                                {byId.map((user:any, index:any) => (
                                    <tr key={index} className="odd:bg-gray-100 dark:odd:bg-zinc-700 text-center opacity-80">
                                        <td className="rounded-sm text-xs sm:text-sm py-2">{`${user.firstname ?? "John"} ${user.surname ?? "Doe"}`}</td>
                                        <td className="rounded-sm text-xs sm:text-sm py-2">{user.student_id}</td>
                                        <td className="rounded-sm text-xs sm:text-sm py-2">{user.mobile_number}</td>
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

            {/* RECOVER ACCOUNT DRAWER */}
            <Drawer title="Recover Account" placement="right" onClose={onClose} open={open}>
                <form className="recover-account-container py-3">
                    <div className="name flex flex-col pop-medium">
                        <label className='pb-1 pt-5 opacity-80'>Enter Student ID</label>
                        <input 
                            {...register('student_id')}
                            placeholder="ex. 1234567"
                            maxLength={7}
                            minLength={6}
                            className='py-2 px-3 text-lg bg-[#E5E0FF] focus:outline-indigo-400 rounded-md border-solid border-2' 
                        />
                        {errors.student_id && <span className="text-red-400 text-center text-sm">{errors.student_id.message}</span>}
                        <label className='pb-1 pt-2 opacity-80'>New PIN</label>
                        <input
                            className="grow pl-4 py-3 text-black text-lg pop-medium rounded-lg  bg-[#E5E0FF] focus:outline-indigo-400 tracking-wider "
                            type='text'
                            {...register('pin_code')}
                            placeholder="ex. 1234"
                            maxLength={4}
                            minLength={4}
                            required
                        />
                        {errors.pin_code && <span className="text-red-400 text-center text-sm">{errors.pin_code.message}</span>}
                        <label className='pb-1 pt-2 opacity-80'>New Password</label>
                        <div className="flex rounded-lg bg-[#E5E0FF] focus:border-indigo-400 w-full border-solid border-2 ">
                            <input
                                {...register('newPassword')}
                                className="grow pl-4 text-lg py-2 text-md outline-none  tracking-wider bg-transparent"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                className="flex justify-center opacity-60 items-center text-sm font-bold w-14"
                                type="button"
                                onClick={handlePasswordToggle}
                            >
                                {showPassword ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
                            </button>
                        </div>
                        {errors.newPassword && <span className="text-red-400 text-center text-sm">{errors.newPassword.message}</span>}
                        <label className='pb-1 pt-2 opacity-80'>New Mobile Number</label>
                        <input 
                            type="text"   
                            placeholder="ex. 09123456789"
                            maxLength={11}
                            minLength={11}
                            required
                            className='bg-[#E5E0FF] py-2 px-3 text-lg focus:outline-indigo-400 rounded-md border-solid border-2' 
                            {...register('newMobileNumber')}
                        />
                        {errors.newMobileNumber && <span className="text-red-400 text-center text-sm">{errors.newMobileNumber.message}</span>}
                    </div>
                </form>
                {/* RECOVER BUTTON */}
                <div className="btn-container flex items-center justify-center pt-3">
                    {!isRecovering
                    ? <button className='flex items-center text-gray-100 bg-blue-800 hover:bg-blue-700 rounded-lg py-2 px-5 sm:px-7' onClick={handleSubmit(handleRecover)}>
                        <p className='pop-medium'>Recover</p>   
                        </button>
                    : <button disabled={isRecovering} className='flex pop-medium items-center  text-gray-100 bg-blue-800 hover:bg-blue-700 rounded-lg py-2 px-5 sm:px-7'>
                        Recovering...
                        <Spin className='pl-1'/> 
                        </button>
                    }
                </div>
                {/* RECOVER BUTTON */}
            </Drawer>
            {/* RECOVER ACCOUNT DRAWER */}

            {/* DELETE ACCOUNT DRAWER */}
            <Drawer title="Delete Account" placement="right" onClose={onCloseDelete} open={openDelete}>
                <form className="delete-account-container py-3">
                    <div className="name flex flex-col pop-medium">
                        <label className='pb-1 pt-5 opacity-80'>Enter Student ID</label>
                        <input 
                            {...deleteRegister('student_id')}
                            placeholder="ex. 1234567"
                            maxLength={7}
                            minLength={6}
                            className='py-2 px-3 text-lg bg-[#E5E0FF] focus:outline-indigo-400 rounded-md border-solid border-2' 
                        />
                        {errorDelete.student_id && <span className="text-red-400 text-center text-sm">{errorDelete.student_id.message}</span>}
                    </div>
                </form>
                {/* DELETE BUTTON */}
                <div className="btn-container flex items-center justify-center pt-3">
                    {!isDeleting
                    ? <button className='flex items-center pop-medium text-gray-100 bg-red-600 hover:bg-red-500 rounded-lg py-2 px-5 sm:px-7' onClick={handleSubmitDelete(handleDelete)}>
                        <p className='pop-medium'>Delete</p>   
                        </button>
                    : <button disabled={isDeleting} className='flex pop-medium items-center text-gray-100 bg-red-600 hover:bg-red-500 rounded-lg py-2 px-5 sm:px-7'>
                        Deleting...
                        <Spin className='pl-1'/> 
                        </button>
                    }
                </div>
                {/* DELETE BUTTON */}
            </Drawer>
            {/* DELETE ACCOUNT DRAWER */}
        </div>
    )
}
