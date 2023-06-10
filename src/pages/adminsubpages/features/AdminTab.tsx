import { Button, Drawer, Modal, Skeleton, Spin, message } from 'antd'
import { FaUserShield } from 'react-icons/fa'
import { useChangeRole, useUploadId, useUploadIds, useUsers } from '../../../hooks/queries/useAdmin'
import { useState } from 'react'
import { ZodType, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as XLSX from 'xlsx';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { MdCloudUpload } from 'react-icons/md'

type PromoteFormData = {
    student_id: string;
}

type XlsxFormData = {
    sheet: string;
    column: string;
}

export default function AdminTab() {

    const axiosPrivate = useAxiosPrivate()

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
    
    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const [openMulti, setOpenMulti] = useState(false);
    const [isUploading, setIsUploading] = useState(false)

    //OPEN UPLOAD XLSX ID MULTI-PARENT DRAWER FUNCTION
    const openMultiDrawer = () => {
        setOpenMulti(true)
    }

    //CLOSE UPLOAD XLSX ID MULTI-PARENT DRAWER FUNCTION
    const onCloseMultiDrawer = () => {
        singleReset()
        multipleReset()
        setOpenMulti(false)
    }

    //OPEN UPLOAD XLSX ID MULTI-CHILD DRAWER FUNCTION
    const showChildrenDrawer = () => {
        setChildrenDrawer(true);
    };
    //CLOSE UPLOAD XLSX ID MULTI-CHILD DRAWER FUNCTION
    const onChildrenDrawerClose = () => {
        setChildrenDrawer(false);
        xlsxReset()
    };

    //UPLOAD XLSX ID
    // onchange states
    const [excelFile, setExcelFile] = useState<null>(null);
    const [typeError, setTypeError] = useState<string>('');

    const [xlsxFile, setXlsxFile] = useState<null>(null);

    // submit state
    const [excelData, setExcelData] = useState<any[] | null>(null);

    const [viewXlsx, setViewXlsx] = useState(false);

    //SELECTING XLSX FILE EVENT HANDLE
    const handleFile=(e:any)=>{
        let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
        let selectedFile = e.target.files[0];
        if(selectedFile){
            if(selectedFile&&fileTypes.includes(selectedFile.type)){
                setTypeError('');
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload=(e:any)=>{
                setXlsxFile(selectedFile);
                console.log(selectedFile);
                setExcelFile(e.target.result);
                }
            }
            else{
                setTypeError('Please select only excel file types');
                setExcelFile(null);
                setExcelData(null)
            }
        }else{
        console.log('Please select your file');
        }
    }
    
    const handleFileSubmit = async (data: XlsxFormData) => {
        if (excelFile !== null && xlsxFile !== null) {
            setIsUploading(true)
            try {
                const formData = new FormData();
                formData.append('file', xlsxFile);
                formData.append('sheet', data.sheet); // default to sheet '0' if not assigned
                formData.append('column', data.column); // default to column 'A' if not assigned
        
                const response = await axiosPrivate.post('/id/xlsx', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
                });
                setIsUploading(false)
                message.open({
                    key: 'successCreation',
                    type: 'success',
                    content: `${response.data.message}`,
                    duration: 2,
                })
            } catch (error:any) {
                setIsUploading(false)
                if(error.message === 'Network Error') {
                    message.open({
                    type: 'error',
                    content: 'Server Unavailable',
                    className: 'custom-class pop-medium',
                    duration: 2.5,
                    });
                } else if(error.response.data?.message){
                    message.open({
                    type: 'error',
                    content: `${error.response.data.message}`,
                    className: 'custom-class pop-medium',
                    duration: 2.5,
                    });
                }else {
                    // Handle other errors
                    error.response.data.errors?.map((err:any) => {
                    message.open({
                        type: 'error',
                        content: `${err.msg}`,
                        className: 'custom-class pop-medium',
                        duration: 2.5,
                    })
                    })
                }
            }
        }
    };

    //XLSX UPLOAD ID FORM SCHEMA
    const xlsxSchema: ZodType<XlsxFormData> = z.object({
        sheet: z.string()
        .regex(/^(?:[0-9]|[1-9][0-9]?)$/, { message: "Sheet must be a number between 0 and 99" })
        .max(2),
        column: z.string()
        .regex(/^[A-Z]$/, { message: "Column Letter must be a capital letter between A-Z" })
        .min(1)
        .max(1),
    })
    const {register:xlsxRegister, handleSubmit:handleSubmitXlsx, formState:{errors:errorXlxs}, reset:xlsxReset} = useForm<XlsxFormData>({resolver: zodResolver(xlsxSchema)})

    //PREVIEW TABLE FUNCTION
    const previewExcel = (e:any) => {
        e.preventDefault();
        if(excelFile!==null){
            const workbook = XLSX.read(excelFile,{type: 'buffer'});
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(data);
        }   
        setViewXlsx(true)
    }

    //UPLOAD SINGLE STUDENT ID
    const singleSchema: ZodType<PromoteFormData> = z.object({
        student_id: z.string().regex(/^\d{7}$/, {message: "Student ID must be a valid Student ID"}).min(7).max(7)
    })
    const {register:singleRegister, handleSubmit:handleSubmitSingle, formState:{errors:errorSingle}, reset:singleReset} = useForm<PromoteFormData>({resolver: zodResolver(singleSchema)})

    //SINGLE ID QUERY HOOKS
    const {mutate:uploadSingleID, isLoading:isSingleLoading} = useUploadId()
    
    //UPLOAD SINGLE ID FUNCTION
    const handleUploadSingleId = (data:PromoteFormData) => {
        uploadSingleID({student_id: data.student_id})
    }

    //UPLOAD MULTIPLE STUDENT ID
    const multipleSchema: ZodType<PromoteFormData> = z.object({
        student_id: z
        .string()
        .refine((value) => {
          const studentIds = value.split(',');
          return studentIds.every((id) => /^\d{7}$/.test(id.trim()));
        }, 'Student IDs should be comma-separated 7-digit numbers'),
    });
    const {register:multipleRegister, handleSubmit:handleSubmitMultiple, formState:{errors:errorMultiple}, reset:multipleReset} = useForm<PromoteFormData>({resolver: zodResolver(multipleSchema)})
    
    //MULTIPLE ID QUERY HOOKS
    const {mutate:uploadMultipleID, isLoading: isMultiLoading} = useUploadIds()
    const handleUploadMultipleId = (data: PromoteFormData) => {
        uploadMultipleID({student_ids: data.student_id})
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
                    <button onClick={openMultiDrawer} className="border-2 py-1 px-2 rounded-md dark:text-gray-500 dark:border-gray-500 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-500">Upload Student ID</button>
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

            {/* UPLOAD XLSX ID MULTI-PARENT DRAWER */}
            <Drawer title="Upload Student ID" className='centered' onClose={onCloseMultiDrawer} open={openMulti}>
                <div className='pop-medium flex flex-col'>
                    {/* UPLOAD XLSX BUTTON */}
                    <button onClick={showChildrenDrawer} className='border-2 py-1 px-2 rounded-md'>Upload Excel File</button>
                    {/* UPLOAD XLSX BUTTON */}

                    {/* UPLOAD SINGLE ID */}
                    <div className="single flex justify-center rounded-2xl mt-10 border-t-2 py-5 uppercase pop-semibold">
                        <h4>Single ID Upload</h4>
                    </div>
                    <form>
                        <label className='pb-1 opacity-80 block'>Student ID</label>
                        <div className="single-input flex justify-between">
                            <input 
                                    {...singleRegister('student_id')}
                                    placeholder="ex. 1234567"
                                    maxLength={7}
                                    minLength={7}
                                    className='py-2 px-3 text-lg bg-[#E5E0FF] focus:outline-indigo-400 rounded-md border-solid border-2' 
                            />

                            {/* UPLOAD SINGLE BUTTON */}
                            <div className="cnt flex items-center h-12 w-10  justify-center">
                                {isSingleLoading
                                    ? <Spin size='large' className=' pt-3 pb-1'/>
                                    : <button className='flex items-center border-2 border-[#1677ff] text-[#1677ff] h-12 px-2 rou rounded-full box-border  hover:bg-[#1677ff] hover:text-white' onClick=   {handleSubmitSingle(handleUploadSingleId)}>
                                        <MdCloudUpload size={30}/> 
                                    </button>
                                }
                            </div>
                            {/* UPLOAD SINGLE BUTTON */}
                        </div>
                        {errorSingle.student_id && <span className="text-red-400 block py-4 text-center text-sm">{errorSingle.student_id.message}</span>}
                    </form>
                    {/* UPLOAD SINGLE ID */}

                    {/* UPLOAD MULTIPLE ID */}
                    <div className="single flex justify-center mt-10 border-t-2 py-5 uppercase pop-semibold">
                        <h4>Multiple ID Upload</h4>
                    </div>
                    {/* UPLOAD MULTIPLE ID */}
                    <form onSubmit={handleSubmitMultiple(handleUploadMultipleId)}>
                        <textarea className='p-3 resize-none focus:outline-indigo-400 rounded-md border-solid border-2'  {...multipleRegister('student_id')} name="student_id" placeholder='ex. 1234567,0987654, ...' cols={40} rows={8}/>
                        
                        {errorMultiple.student_id && <span className="text-red-400 block py-4 text-center text-sm">{errorMultiple.student_id.message}</span>}

                        {/* UPLOAD MULTIPLE BUTTON */}
                        <div className="btn flex items-center justify-center pt-5">
                            {isMultiLoading 
                                ? <button disabled={isMultiLoading} className=" py-2 px-3 pop-medium items-center border-2 border-[#1677ff] text-[#1677ff] hover:bg-[#1677ff] hover:text-white rounded-full">Uploading...</button>
                                : <button type='submit' disabled={isMultiLoading} className=" py-2 px-3 pop-medium items-center border-2 border-[#1677ff] text-[#1677ff] hover:bg-[#1677ff] hover:text-white rounded-full">Upload</button>
                            }
                        </div>
                        {/* UPLOAD MULTIPLE BUTTON */}
                    </form>

                </div>
                {/* UPLOAD XLSX ID MULTI-CHILD DRAWER */}
                <Drawer
                    title="Upload Excel File"
                    width={320}
                    onClose={onChildrenDrawerClose}
                    open={childrenDrawer}
                >
                <div className="wrapp px-1 rounded-xl py-2 pop-regular mt-16 shadow-sm">
                    {/* UPLOAD ID VIA XLXS */}
                    <button onClick={previewExcel} className="bg-gray-100 py-1 px-2 rounded-full border-blue-200 border-2">Preview</button>
                    <form className="py-8 w-full">
                        <input type="file" className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100
                        " required onChange={handleFile} />

                        {typeError&&(
                            <div className="text-red-400 py-1 my-2 text-sm text-center border-[1px] border-red-400 rounded-md" role="alert">{typeError}</div>
                        )}

                        <div className="inputs py-5">
                            <label className='pb-1 block opacity-80'>Sheet Number</label>
                            <input 
                                {...xlsxRegister("sheet")}
                                placeholder="ex. 0"
                                maxLength={2}
                                minLength={1}
                                className='py-1 px-3 text-lg bg-[#E5E0FF] focus:outline-indigo-400 rounded-md border-solid border-2' 
                            />
                            {errorXlxs.sheet && <span className="block text-red-400 text-center text-sm">{errorXlxs.sheet.message}</span>}

                            <label className='pb-1 block mt-4 opacity-80'>Column Letter</label>
                            <input 
                                {...xlsxRegister("column")}
                                placeholder="ex. A"
                                maxLength={1}
                                minLength={1}
                                className='py-1 px-3 text-lg bg-[#E5E0FF] focus:outline-indigo-400 rounded-md border-solid border-2' 
                            />
                            {errorXlxs.column && <span className="block text-red-400 text-center text-sm">{errorXlxs.column.message}</span>}
                        </div>
                        
                        <div className="btn flex items-center justify-center py-5">
                            <button onClick={handleSubmitXlsx(handleFileSubmit)} className=" py-2 px-3 pop-medium items-center border-2 border-[#1677ff] text-[#1677ff] hover:bg-[#1677ff] hover:text-white rounded-full">UPLOAD</button>
                        </div>
                        
                    </form>
                    <Modal
                        title="Selected Excel File Preview"
                        centered
                        open={viewXlsx}
                        onCancel={() => setViewXlsx(false)}
                        footer={[
                            <Button key="close" onClick={() => setViewXlsx(false)}>
                                Close
                            </Button>,        
                        ]}
                        width={1000}
                    >
                        {/* view data */}
                        <div className="viewer py-10">
                            {excelData?(
                            <div className="table-responsive w-full max-h-[450px] overflow-y-auto overflow-scroll centered text-center">
                                <table className="table border-2">

                                <thead>
                                    <tr className=' border-2'>
                                    {Object.keys(excelData[0]).map((key)=>(
                                        <th key={key} className=' border-2 border-gray-400 py-1 px-2'>{key}</th>
                                    ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {excelData?.map((individualExcelData:any, index:any)=>(
                                    <tr key={index} className=' border-2'>
                                        {Object.keys(individualExcelData).map((key)=>(
                                        <td key={key} className=' border-2 p-1'>{individualExcelData[key]}</td>
                                        ))}
                                    </tr>
                                    ))}
                                </tbody>

                                </table>
                            </div>
                            ):(
                            <div>Please upload Excel (.xlsx) file.</div>
                            )}
                        </div>
                    </Modal>
                    {/* UPLOAD ID VIA XLXS */}
                </div>
                </Drawer>
                {/* UPLOAD XLSX ID MULTI-CHILD DRAWER */}
            </Drawer>
            {/* UPLOAD XLSX ID MULTI-PARENT DRAWER */}
        </div>
    )
}
