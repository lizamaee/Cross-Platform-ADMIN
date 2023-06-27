import { useCallback, useRef, useState } from 'react';
import {BsPlus} from 'react-icons/bs'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiDeleteBin5Fill, RiEditBoxFill } from 'react-icons/ri';
import {IoMdRemoveCircle} from 'react-icons/io' 
import { Drawer, Dropdown, MenuProps, Progress, Space, Spin, Tooltip, message } from 'antd';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useCreateElection, useDeleteElection, useElections, useUpdateElection } from '../../../hooks/queries/useElection';
import DeleteMe from '../../../components/DeleteMe';
import { TiWarning } from 'react-icons/ti';
import { useDropzone } from 'react-dropzone';
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';

interface DataType {
  id: string;
  title: string;
  banner: string;
  status: string;
  startDate: string;
  endDate: string;
}

export default function ElectionTab() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [openMulti, setOpenMulti] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()
  const [image, setImage] = useState([])
  
  //ELECTOIN QUERY HOOKS
  //GET ALL
  const electionsQuery = useElections()
  //CREATE SINGLE
  const { mutate: createElection} = useCreateElection()
  //DELETE SINGLE
  const { mutate: deleteElection, isLoading: isDeletingElection} = useDeleteElection()
  
  //SORT ELECTION ARRAY IN DESCENDING ORDER
  const descendingElections = electionsQuery?.data?.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  //CALL BACK TO FIRE WHEN FILE IS DRAGGED INSIDE DROPZONE
  const onDrop = useCallback((acceptedFiles: any) => {
    setImage(
      acceptedFiles.map((file:any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    )}, []);
  
  //DROPZONE CONFIG
  const {
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    validator: fileSizeValidator,
  })

  //VALIDATE FILE SIZE OF SELECTED IMAGE
  function fileSizeValidator(file:any) {
    if (file.size > 1024 ** 2 * 2) {
      return {
        code: 'size-too-large',
        message: `File is larger than 2mb`,
      };
    }
    return null;
  }

  //THUMBNAIL OR PREVIEW OF SELECTED IMAGE
  const thumbs = image.map((file:any) => (
    <div className='w-full p-3 flex justify-center' key={file.name}>
      <div className=''>
        <img
          src={file.preview}
          className='h-32'
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
        <h3 className='text-center pt-3 opacity-80'>Preview</h3>
      </div>
    </div>
  ));

  //FETCH DATA FOR CURRENT AND AVAILABLE ORGANIZATIONS
  const fetchData = async (endpoints: string) => {
    try {
      const response = await axiosPrivate.get(`/${endpoints}`);
      //console.log(response.data);
      return response.data
    } catch (error: any) {
      if (error.response) {
        // ✅ log status code here
        //Live Server Return
        //console.log(error.response.status);
        if(error.response.status === 403){
          navigate('/login', {state: {from: location}, replace: true});
        }
        return [error.response.data ];
      }
      //Dead Server Return
      return [{error: error.message }];
    }
  }
  
  const [deletingElectionName, setDeletingElectionName] = useState<string>('')
  const [deletingElectionID, setDeletingElectionID] = useState<string>('')

  //ASYNCRONOUS DELETE ELECTION FUNCTION
  async function handleDeleteElection() {
    deleteElection(
      deletingElectionID,
      {
        onSettled: () => setOpenDeleteModal(false)
      })
    
  }

  //DELETE ELECTION CONFIRMATION MODAL
  const deleteIt = (id: string, name: string) => {
    setDeletingElectionName(name)
    setDeletingElectionID(id)
    setOpenDeleteModal(true)
  }

  //OPEN CREATE DRAWER STATE
  const [open, setOpen] = useState(false)
  //OPEN CREATE DRAWER FUNCTION
  const showDrawer = () => {
    setOpen(true)
  }
  
  //CLOSE CREATE DRAWER FUNCTION
  const onClose = () => {
    setName('')
    setImage([])
    setStartDate(null)
    setEndDate(null)
    setOpen(false)
  }

  //CREATE ELECTION FUNCTION
  const handleUpload = async (banner_url: string) => {
    const uploadElecData = {
      title: name,
      banner: banner_url,
      startDate: moment(startDate).utc().format('YYYY-MM-DD'),
      endDate: moment(endDate).utc().format('YYYY-MM-DD')
    }
    //mutate the election data
    createElection(uploadElecData,
      {
        onSettled: () => {
          setIsCreating(false)
          setName('')
          setImage([])
          setStartDate(null)
          setEndDate(null)
        }
      })
  }

  //ONCLICK FUNCTION OF REFERENCED CHANGE IMAGE BUTTON
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };


  //UPLOAD SELECTED IMAGE TO CLOUDINARY
  const handleCreateElection = async () => {
    setIsCreating(true)
    if(startDate === null || endDate === null || name === '') {
      setIsCreating(false)
      return message.open({
        type: 'error',
        content: 'Please fill the fields',
        className: 'custom-class pop-medium',
        duration: 2.5,
      });
    }

    const url = import.meta.env.VITE_CLOUDINARY_URL
    const formData = new FormData();
      // Use the first item to upload
      let file = image[0]
      formData.append('file', file);
      formData.append('upload_preset', `${import.meta.env.VITE_CLOUDINARY_PRESET}`);

    await fetch(`${url}`, {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      handleUpload(data.secure_url)
    })
    .catch(error => console.error(error))
  }

  //DRAWER STATES
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [modifyId, setModifyId] = useState<string>('')
  const [modifyName, setModifyName] = useState<string>('')
  const [modifyUrl, setModifyUrl] = useState<string>('')
  const [modifyStatus, setModifyStatus] = useState<string>('')
  const [modifyStartDate, setModifyStartDate] = useState<Date | null>()
  const [modifyEndDate, setModifyEndDate] = useState<Date | null>()
  const [availableOrganizations, setAvailableOrganizations] = useState([])
  const [currentOrganizations, setCurrentOrganizations] = useState([])
  const [electionID, setElectionID] = useState<string>('')
  const [isDisconnectiong, setIsDisConnecting] = useState<boolean>(false)
  const [isConnectiong, setIsConnecting] = useState<boolean>(false)

  //REFERENCE OF CHANGE IMAGE BUTTON
  const fileInputRef = useRef<HTMLInputElement>(null);

  //PROGRESS BAR STATE
  const [uploadProgress, setUploadProgress] = useState(0);
  
  //OPEN MODIFY MULTI-PARENT DRAWER FUNCTION
  const openMultiDrawer = (id: string, name: string) => {
    setOpenMulti(true)
    const single = electionsQuery.data?.filter((elec: DataType)=> elec.id === id)
    
    const startdate = new Date(single[0].startDate)
    const enddate = new Date(single[0].endDate)
    
    setModifyId(single[0].id)
    setModifyName(single[0].title)
    setModifyUrl(single[0].banner)
    setModifyStatus(single[0].status)
    setModifyStartDate(startdate)
    setModifyEndDate(enddate)
  }

  //UPDATE IMAGE UPLOAD TO CLOUDINARY
  const handleUpdateImage = async (e:any) => {
    e.preventDefault()
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', `${import.meta.env.VITE_CLOUDINARY_PRESET}`);

    const url = import.meta.env.VITE_CLOUDINARY_URL
    try {
      const response = await axios.post(`${url}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total !== undefined) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        }
      );
      setModifyUrl(response.data.secure_url);
      console.log(response.data.secure_url);
    } catch (error) {
      console.log('Error uploading image: ', error);
    }
  }

  //MUTATION HOOK OF UPDATE ELECTION 
  const {mutate: updateElection} = useUpdateElection()
  //UPDATE AN ELECTION FUNCTION
  const handleUpdate = async (e:any) => {
    e.preventDefault()
    setIsUpdating(true)
    
    if(modifyStartDate === null || modifyUrl === '' || modifyEndDate === null || modifyName === '') {
      setIsUpdating(false)
      return message.open({
        type: 'error',
        content: 'Please fill the fields',
        className: 'custom-class pop-medium',
        duration: 2.5,
      });
    }

    const updateElecData = {
      id: modifyId,
      title: modifyName,
      banner: modifyUrl,
      startDate: moment(modifyStartDate).utc().format('YYYY-MM-DD'),
      endDate: moment(modifyEndDate).utc().format('YYYY-MM-DD')
    }

    updateElection(updateElecData)
    setIsUpdating(false)
    onCloseMultiDrawer()
    setModifyUrl('')
    setModifyId('')
    setModifyName('')
    setModifyStartDate(null)
    setModifyEndDate(null)

  }
  
  //CLOSE MODIFY MULTI-PARENT DRAWER FUNCTION
  const onCloseMultiDrawer = () => {
    setUploadProgress(0)
    setOpenMulti(false)
  }
  
  //GET ALL AVAILABLE ORGANIZATIONS REQUEST FUNCTION
  const getAvailableOrganizations = async () => {
    const response = await fetchData('organization/null')
    setAvailableOrganizations(response)
  }

  //GET ALL CURRENT ORGANIZATIONS REQUEST FUNCTION
  const getCurrentOrganizations = async () => {
    const response = await fetchData(`election/elec-organizations/${modifyId}`)
    if(response[0]?.error === 'Network Error'){
        message.open({
          type: 'error',
          content: 'Server Unavailable',
          className: 'custom-class pop-medium',
          duration: 2.5,
        })
    }
    setElectionID(response.id)
    setCurrentOrganizations(response)
  }

  //DISCONNECT SINGLE ORGANIZATION FROM SPECIFIC ELECTION
  const disConnectOrganization = async (organizationId: string, electionId: string) => {
    setIsDisConnecting(true)

    const key = 'diconnectOrganizationKEY'
    const disconnectOrganization = {
      election_id: electionId,
      org_id: organizationId,
    }

    await axiosPrivate.patch('election/disconnect-org-election', disconnectOrganization)
    .then((response) => {
        message.open({
          key,
          type: 'success',
          content: 'Disconnected Successfully',
          duration: 2,
        });  
        getAvailableOrganizations()
        getCurrentOrganizations()
        setIsDisConnecting(false)
    })
    .catch((error) => {
        //console.error('Error:', error);
        setIsDisConnecting(false)
        if (error.message === 'Network Error') {
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
    });
  }

  //OPEN MODIFY MULTI-CHILD DRAWER FUNCTION
  const showChildrenDrawer = () => {
    getAvailableOrganizations()
    getCurrentOrganizations()
    setChildrenDrawer(true);
  };
  
  //CLOSE MODIFY MULTI-CHILD DRAWER FUNCTION
  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  //CONNECT SINGLE ORGANIZATION FROM SPECIFIC ELECTION
  const onClick: MenuProps['onClick'] = async ({ key }) => {
    setIsConnecting(true)

    const messageKey = 'connectOrganizationKEY'
    const connectOrganization = {
      election_id: modifyId,
      org_id: key,
    }

    await axiosPrivate.patch('election/connect-org-election', connectOrganization)
    .then((response) => {
        message.open({
          key: messageKey,
          type: 'success',
          content: 'Connected Successfully',
          duration: 2,
        });  
        getAvailableOrganizations()
        getCurrentOrganizations()
        setIsConnecting(false)
    })
    .catch((error) => {
        //console.error('Error:', error);
        setIsConnecting(false)
        if (error.message === 'Network Error') {
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
    });

  };

  //POPULATE AVAILABLE ORGANIZATION INSIDE A DROPDOWN
  const items: MenuProps['items'] = availableOrganizations?.length === 0 
    ? [{
        label: "No Organizations Available",
        key: "No Key"
      }]
    : availableOrganizations?.map((org:any) => {
        return {
          label: org.org_name,
          key: org.id,
        }
      })
      
  return (
    <div className='Election overflow-hidden bg-white dark:bg-[#303030] rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex justify-between items-center pt-10  mx-5">
        <h3 className='text-lg pop-semibold text-gray-950 dark:text-gray-100'>Elections</h3>
        <button onClick={showDrawer} className='flex justify-center items-center py-1 md:py-2 sm:pr-3 px-1 text-white pop-medium bg-[#2F92F0] hover:text-[#2F92F0] border-2 border-[#2F92F0] hover:bg-transparent focus:outline-none rounded-2xl'>
          <BsPlus size={25} className='' />
          <h3 className='text-sm md:text-md hidden sm:inline'>CREATE</h3>
        </button>
      </div>
      {/* CREATE BUTTON */}

      {/* ALL ORGANIZATIONS */}
      <div className="container centered w-full mx-auto p-4 overflow-x-auto">
        {electionsQuery.status === 'error' || electionsQuery.data?.[0]?.error === 'Network Error'
            ? <h4 className='text-red-400 pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>Sorry, Something went wrong.</h4>
            : descendingElections?.length === 0 
                ? <h4 className='text-gray-400 opacity-90 border-2 rounded-lg pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>No Elections</h4>
                : <div className="grid items-center gap-5">
                  {descendingElections?.map((elec:DataType, index: any) =>(
                    <div key={index} className="card relative gap-2 py-2 px-4 shadow-md bg-gray-100 rounded-md dark:bg-[#2a2a2a] flex flex-cols-2">
                      <div className="grow gap-3 flex flex-col md:flex-row md:justify-between md:pr-20 justify-center">
                        <div className="election-title flex justify-center md:justify-start items-center">
                          <h3 className='pop-semibold text-[#303030] dark:text-gray-200 text-center '>{elec.title}</h3>
                        </div>
                        {/* DATE DISPLAY */}
                        <div className="dates flex text-xs gap-3 items-center justify-center text-gray-500 pop-regular">
                          <p className="">
                            {new Date(elec.startDate).toLocaleDateString("en-US", {
                              timeZone: "Asia/Manila",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <span>-</span>
                          <p className="text-right">
                            {new Date(elec.endDate).toLocaleDateString("en-US", {
                              timeZone: "Asia/Manila",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        {/* DATE DISPLAY */}
                      </div>
                      {/* ACTIONS DISPLAY */}
                      <div className="actions flex flex-col-reverse md:flex-row items-end justify-center gap-3 md:gap-5 py-2">
                        <Tooltip title='Delete' color='#f87171'>
                          <button
                            onClick={(e) => deleteIt(elec.id, elec.title)}
                            className={`pop-medium text-center align-middle p-1 md:p-2 rounded-lg md:rounded-xl text-white bg-red-400 shadow-sm shadow-red-400 focus:outline-none`}
                            >
                            <RiDeleteBin5Fill />
                          </button>
                        </Tooltip>
        
                        <Tooltip title='Modify' color='#60a5fa'>
                          <button
                            onClick={()=> {
                              openMultiDrawer(elec.id,elec.title)
                            }}
                            className={`pop-medium text-center align-middle p-1 md:p-2 rounded-lg md:rounded-xl text-white bg-blue-400 shadow-sm shadow-blue-400 focus:outline-none`}
                            >
                            <RiEditBoxFill />
                          </button>
                        </Tooltip>
                      </div>
                      {/* ACTIONS DISPLAY */}
                    </div>
                  ))}
            </div>
            }
        
      </div>
      {/* CREATE ELECTION DRAWER */}
      <Drawer title="Create Election" placement="right" onClose={onClose} open={open}>
        <form className="create-election-container py-3">
          <div className="name flex flex-col pop-medium">

            {/* DRAG N DROP BANNER PICTURE */}
            <label className='opacity-80 py-2 text-center'>Select Banner Image</label>
            <div {...getRootProps()} className='opacity-60 p-3 rounded-lg border-dashed border-2 border-gray-500 cursor-pointer' >
              <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-center">Drop your Banner here</p>
                ) : (
                  <p className="text-center">
                    Drag and drop banner here, or click to select banner image
                  </p>
                )}
            </div>
            {fileRejections.map(({ file, errors }) => {
              return (
                    <>
                    {errors.map((e) => (
                      <h6 className='text-red-400' key={e.code}>{e.message}</h6>
                    ))}
                    </>
              )
            })}
            {thumbs}
            {/* DRAG N DROP BANNER PICTURE */}
            
            <label className='pb-1 pt-5 opacity-80'>Election Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='py-1 px-3 text-lg focus:outline-indigo-400 rounded-md border-solid border-2' />
            
            {/* DATE PICKER */}
            <div className="dates md:flex justify-between pt-4">
              {/* START DATE */}
              <div className="start">
                <label className="opacity-80">
                  Start Date
                </label>
                <DatePicker
                  selected={startDate ?? null}
                  onChange={(date) => setStartDate(date)}
                  showIcon
                  required
                  isClearable
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="nothing!"
                  className="pop-regular shadow-sm bg-gray-100 border-2 w-[90%] md:w-[85%] border-slate-200 rounded-md focus:outline-indigo-400 px-4"
                />
              </div>
              {/* END DATE */}
              <div className="end">
                <label className="opacity-80">
                  End Date
                </label>
                <DatePicker
                  showIcon
                  required
                  isClearable
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="nothing!"
                  className="pop-regular shadow-sm bg-gray-100 border-2 w-[90%] md:w-[85%] border-slate-200 rounded-md focus:outline-indigo-400 px-4"
                  selected={endDate ?? null}
                  onChange={(date) => setEndDate(date)}
                  />
              </div>
            </div>
            {/* DATE PICKER */}
          </div>
        </form>
        {/* CREATE BUTTON */}
        {image.length > 0 && (
          <div className="btn-container flex items-center justify-center pt-3">
            {!isCreating 
              ? <button className='flex items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-7 rounded-full' onClick={handleCreateElection}>
                  <p className='pop-medium'>Create</p>   
                </button>
              : <button className='flex pop-medium items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-3 rounded-full'>
                  Creating...
                  <Spin className='pl-1'/> 
                </button>
            }
          </div>
        )}
        {/* CREATE BUTTON */}
      </Drawer>
      {/* CREATE ELECTION DRAWER */}

      {/* UPDATE ELECTION MULTI-PARENT DRAWER */}
      <Drawer title="Modify" onClose={onCloseMultiDrawer} open={openMulti}>
        <div className='pop-medium flex flex-col'>
          {/* CONNECTIONS BUTTON */}
          <button onClick={showChildrenDrawer} className='border-2 py-1 px-2 rounded-md'>Connections</button>
          {/* CONNECTIONS BUTTON */}

          <div className="img-holder flex justify-center relative my-5">
            <img 
              src={modifyUrl} alt={`${modifyName} Image`} 
              className='object-cover rounded-full border-2 border-gray-400 w-36 h-36'
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleUpdateImage}
            />
            <button
              onClick={handleButtonClick}
              className="bg-white focus:outline-none border-2 border-gray-400 rounded-full flex p-1 absolute bottom-0 translate-x-14 -translate-y-3"
            >
              <FaCamera className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          {/* PROGRESS BAR UI */}
            {uploadProgress > 0 && (
              <span>
                <Progress percent={uploadProgress} size="small" />
              </span>
            )}
          {/* PROGRESS BAR UI */}

          <label className='pb-1 opacity-80 pt-8 block'>Election Name</label>
          <input value={modifyName} onChange={(e) => setModifyName(e.target.value)} type="text" className='py-1 px-3 text-lg focus:outline-indigo-400 rounded-md border-solid border-2 w-full' />

          {/* DATE PICKER */}
          <div className="dates md:flex justify-between pt-4">
              {/* START DATE */}
              <div className="start">
                <label className="opacity-80">
                  Start Date
                </label>
                <DatePicker
                  selected={modifyStartDate ?? null}
                  onChange={(date) => setModifyStartDate(date)}
                  showIcon
                  required
                  isClearable
                  selectsStart
                  startDate={modifyStartDate}
                  endDate={modifyEndDate}
                  placeholderText="nothing!"
                  className="pop-regular shadow-sm bg-gray-100 border-2 w-[90%] md:w-[85%] border-slate-200 rounded-md focus:outline-indigo-400 px-4"
                  />
              </div>
              {/* END DATE */}
              <div className="end">
                <label className="opacity-80">
                  End Date
                </label>
                <DatePicker
                  showIcon
                  required
                  isClearable
                  selectsStart
                  startDate={modifyStartDate}
                  endDate={modifyEndDate}
                  minDate={modifyStartDate}
                  placeholderText="nothing!"
                  className="pop-regular shadow-sm bg-gray-100 border-2 w-[90%] md:w-[85%] border-slate-200 rounded-md focus:outline-indigo-400 px-4"
                  selected={modifyEndDate ?? null}
                  onChange={(date) => setModifyEndDate(date)}
                />
              </div>
            </div>
            {/* DATE PICKER */}
            {/* UPDATE BUTTON */}
            <div className="cnt flex items-center justify-center p-5">
              {!isUpdating 
                ? <button className='flex items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-7 rounded-full' onClick={handleUpdate}>
                    <p className='pop-medium'>Update</p>   
                  </button>
                : <button disabled={isUpdating} className='flex pop-medium items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-3 rounded-full'>
                    Updating...
                    <Spin className='pl-1'/> 
                  </button>
              }
            </div>
            {/* UPDATE BUTTON */}
          </div>
        {/* UPDATE ELECTION MULTI-CHILD DRAWER */}
        <Drawer
          title="Connections"
          width={320}
          onClose={onChildrenDrawerClose}
          open={childrenDrawer}
          >
          <div className="wrap border-2 w-fit p-1 rounded-lg pop-medium">
            <Dropdown menu={{ items, onClick }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  Available Organizations
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
          <div className="wrapp px-1 rounded-xl py-2 pop-regular mt-16 shadow-sm">
            <h3 className='py-3 pop-semibold text-center shadow-sm rounded-xl bg-gray-100 mb-3'>Current Organizations</h3>
            {currentOrganizations?.length === 0
              ? <div className="no-current text-gray-600 flex justify-center items-center p-5 opacity-80 pop-medium">
                  <h4>No Organization Assigned </h4>
                </div>
              : currentOrganizations?.map((current:any, index:any) => (
                <div key={index} className="item flex justify-between items-center py-2 px-3 odd:bg-gray-100 rounded-md hover:bg-blue-100">
                  <h3>{current.org_name}</h3>
                  <Tooltip title='Remove' color='#f87171'>
                    <button onClick={() => disConnectOrganization(current.id, current.electionId)} className='p-1'>
                      <IoMdRemoveCircle size={25} className='text-red-400'/>
                    </button>
                  </Tooltip>
                </div>
              ))
            }
          </div>
        </Drawer>
        {/* UPDATE ELECTION MULTI-CHILD DRAWER */}
      </Drawer>
      {/* UPDATE ELECTION MULTI-PARENT DRAWER */}

      {/* DELETE MODAL */}
      <DeleteMe open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <div className="delete-container z-50 py-5 px-10 rounded-2xl bg-white dark:bg-[#414141]">
              <div className="px-10">
                <div className="icon flex justify-center">
                  <div className="warning_icon p-3 shadow-md bg-[#fff5f6] dark:bg-[#504f4f] rounded-full">
                    <TiWarning size={30} className="text-[#ff3f56]" />
                  </div>
                </div>
                <div className="warn flex justify-center pt-5 pb-3">
                  <h2 className="md:text-xl text-lg md:tracking-wider pop-bold text-[#334049] dark:text-gray-200">
                    Delete Election
                  </h2>
                </div>
                <div className="warn-text tracking-wider text-xs md:text-sm">
                  <p className="pop-regular text-[#334049] dark:text-gray-300 text-center">
                    Do you want to delete <span className='pop-bold'>{deletingElectionName}</span>
                  </p>
                  <p className="pop-regular text-[#334049] dark:text-gray-300 text-center">
                    Are you sure?
                  </p>
                </div>
              </div>
              <div className="choice-btn text-[#334049] dark:text-gray-200 pt-5 flex flex-col-reverse gap-3 md:flex-row  justify-evenly ">
                <button
                  onClick={() => setOpenDeleteModal(false)}
                  className="bg-[#f5f5f7] dark:bg-zinc-600 px-6 py-3 rounded-full"
                >
                  No, Keep it
                </button>
                {isDeletingElection ? (
                  <button
                    disabled={isDeletingElection}
                    className="bg-[#ff3f56] text-white px-6 py-2 rounded-full"
                  >
                    Deleting...
                  </button>
                ) : (
                  <button
                    disabled={isDeletingElection}
                    onClick={handleDeleteElection}
                    className="bg-[#ff3f56] text-white px-6 py-2 rounded-full"
                  >
                    Yes, Delete!
                  </button>
                )}
              </div>
            </div>
      </DeleteMe>
      {/* DELETE MODAL */}
      
      {/* ALL ORGANIZATIONS */}
    </div>
  )
}




