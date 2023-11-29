import { useCallback, useMemo, useRef, useState } from 'react';
import {BsFillTrophyFill, BsPlus} from 'react-icons/bs'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiDeleteBin5Fill, RiEditBoxFill } from 'react-icons/ri';
import { TbPower } from 'react-icons/tb';
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
import { FaAngleLeft, FaCamera } from 'react-icons/fa';
import axios from 'axios';
import Radio, { RadioGroup } from '../../../components/Radio';
import { useActivateElection, useEndElection } from '../../../hooks/queries/useAdmin';
import VoteModal from '../../../components/VoteModal';
import { useSingleBallotResult } from '../../../hooks/queries/useVoter';
import { winner } from '../../../BMAlgorithm';

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
  const [status, setStatus] = useState("upcoming");
  
  //ELECTOIN QUERY HOOKS
  //GET ALL
  const electionsQuery = useElections()
  //CREATE SINGLE
  const { mutate: createElection} = useCreateElection()
  //DELETE SINGLE
  const { mutate: deleteElection, isLoading: isDeletingElection} = useDeleteElection()
  //REACTIVATE ELECTION
  const {mutate:activateElectionNow} = useActivateElection()
  
  //END ELECTION
  const {mutate:endElectionNow} = useEndElection()

  //SORT BY STATUS
  const byStatus = useMemo(() => {
    return electionsQuery?.data?.filter((elec:any) => {
        return elec.status === status.toLowerCase()
    })
  }, [electionsQuery, status])
  
  //SORT ELECTION ARRAY IN DESCENDING ORDER
  const descendingElections = byStatus?.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
    <div className='w-full p-3 border-2 mt-3 rounded-lg flex justify-center' key={file.name}>
      <div className=''>
        <img
          src={file.preview}
          className='h-32 rounded-lg'
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

  //END ELECTION 
  const endIt = (id: string) => {
    endElectionNow(id)
  }

  //END ELECTION 
  const reactivateIt = (id: string) => {
    activateElectionNow(id)
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

  const [activeOrgs, setActiveOrgs] = useState([]);
  const [isActiveOrgs, setIsActiveOrgs] = useState<boolean>(false);

  //SHOW ORGANIZATIONS
  const handleActiveOrganizations = async (id: string) => {
      const orgs = electionsQuery?.data?.filter(
      (elec: any) => elec.id === id
      );
      setActiveOrgs(orgs[0]?.organizations);
      setIsActiveOrgs(true);
  }

  const {
    mutate: getSingleResultBallot,
    isLoading: isResultBallotLoading,
    data: resultBallotData,
  } = useSingleBallotResult()

  const [openSliderResult, setOpenSliderResult] = useState<boolean>(false);

  const handleGetBallot = async (ballots: any) => {
      setOpenSliderResult(true);
      getSingleResultBallot(ballots.id);
  };
      
  return (
    <div className='Election overflow-hidden bg-white dark:bg-[#303030] rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex justify-between items-center pt-10  mx-5">
        <h3 className='text-lg pop-semibold text-gray-950 dark:text-gray-100'>Elections</h3>
        <button onClick={showDrawer} className='flex justify-center items-center py-1 md:py-2 sm:pr-3 px-1 text-white pop-medium bg-[#2F92F0] hover:text-[#2F92F0] border-2 border-[#2F92F0] hover:bg-transparent focus:outline-none rounded-2xl transition duration-300 ease-in-out'>
          <BsPlus size={25} className='' />
          <h3 className='text-sm md:text-md hidden sm:inline'>CREATE</h3>
        </button>
      </div>
      {/* CREATE BUTTON */}

      <div className="flex items-center py-3 sm:py-2 px-1 mx-4 sm:mx-5 w-full overflow-x-auto centered">
        <RadioGroup value={status} onChange={(e:any) => setStatus(e.target.value)}>
          <div className="flex gap-2 justify-center">
            <Radio value="upcoming">Upcoming</Radio>
            <Radio value="ongoing">Ongoing</Radio>
            <Radio value="ended">Ended</Radio>
          </div>
        </RadioGroup>
      </div>

      {/* ALL ORGANIZATIONS */}
      <div className="container centered w-full mx-auto p-4 overflow-x-auto">
        {electionsQuery.status === 'error' || electionsQuery.data?.[0]?.error === 'Network Error'
            ? <h4 className='text-red-400 pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>Sorry, Something went wrong.</h4>
            : descendingElections?.length === 0 
                ? <h4 className='text-gray-400 opacity-90 border-2 dark:border-gray-400 rounded-lg pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1 capitalize'>No {status}</h4>
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
                        {status === "ended" &&
                          (<Tooltip title='Result' color='#26e76f'>
                          <p
                            onClick={()=> handleActiveOrganizations(elec.id)
                            }
                            className={`pop-regular md:px-3 text-center align-middle p-1 rounded-lg dark:text-white cursor-pointer border-2 border-green-400 dark:border-green-800`}
                            >Result
                          </p>
                        </Tooltip>)
                        }
                        <Tooltip title='Delete' color='#f87171'>
                          <button
                            onClick={(e) => deleteIt(elec.id, elec.title)}
                            className={`pop-medium text-center align-middle p-1 md:p-2 rounded-lg text-white bg-red-500 shadow-sm shadow-red-500 focus:outline-none`}
                            >
                            <RiDeleteBin5Fill />
                          </button>
                        </Tooltip>

                        {status === "upcoming" || status === "ongoing" ?
                          (<Tooltip title='Modify' color='#60a5fa'>
                          <button
                            onClick={()=> {
                              openMultiDrawer(elec.id,elec.title)
                            }}
                            className={`pop-medium text-center align-middle p-1 md:p-2 rounded-lg text-white bg-blue-500 shadow-sm shadow-blue-500 focus:outline-none`}
                            >
                            <RiEditBoxFill />
                          </button>
                        </Tooltip>) : ''
                        }
                        {status === "ongoing" &&
                          (<Tooltip title='End Election' color='#ff8e40'>
                          <button
                            onClick={()=> {
                              endIt(elec.id)
                            }}
                            className={`pop-medium text-center align-middle p-1 md:p-2 rounded-lg text-white bg-orange-500 shadow-sm shadow-orange-500 focus:outline-none`}
                            >
                            <TbPower/>
                          </button>
                        </Tooltip>)
                        }
                        {status === "ended" &&
                          (<Tooltip title='Re-Activate' color='#26e76f'>
                          <button
                            onClick={()=> {
                              reactivateIt(elec.id)
                            }}
                            className={`pop-medium text-center align-middle p-1 md:p-2 rounded-lg text-white bg-green-500 shadow-sm shadow-green-500 focus:outline-none`}
                            >
                            <TbPower/>
                          </button>
                        </Tooltip>)
                        }
                      </div>
                      {/* ACTIONS DISPLAY */}
                    </div>
                  ))}
            </div>
            }
        
      </div>
      {/* RESULT MODAL */}
      <VoteModal title='Result' open={isActiveOrgs} onClose={() => setIsActiveOrgs(false)}>
            <div className="slk overflow-x-hidden h-full overflow-y-auto relative">
              {/* SHOW ACTIVE ORGANIZATIONS ELECTION */}
              {electionsQuery?.isLoading ? (
                <div className="loadin flex flex-col gap-3 items-center dark:text-gray-400 justify-center mt-6">
                  <h3 className="pop-semibold"></h3>
                </div>
              ) : (
                isActiveOrgs && (
                  <>
                    
                    <div className="active-organization rounded-lg shadow-md bg-white dark:bg-[#202020] h-full">
                      <div className="all-org grid sm:p-5 sm:gap-10">
                        {activeOrgs?.length === 0 ? (
                          <h3>No Active Organizations</h3>
                        ) : (
                          <div className="ors">
                            <h4 className="pb-2 w-full dark:text-gray-200 pop-semibold">
                                Active Organizations
                              </h4>
                            {
                              activeOrgs?.map((org: any, index: any) => 
                            <div
                              key={index}
                              onClick={() => handleGetBallot(org.ballots[0])}
                              className="org cursor-pointer hover:bg-gray-200 border-[1px] border-gray-200 dark:border-gray-600 overflow-hidden py-2 bg-gray-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 flex flex-col shadow-md rounded-lg items-center"
                            >
                              
                              <h2 className="pop-medium text-center dark:text-gray-300 text-sm">
                                {org.org_name}
                              </h2>
                              
                            </div>
                          )
                        }
                        </div>
                            
                          
                        )}
                      </div>
                    </div>
                  </>
                )
              )}
              <div className={`organizations-slider rounded-lg bg-gray-200 dark:bg-zinc-700 w-full h-full absolute top-0 left-0 z-10 ${ openSliderResult ? 'translate-x-0' : 'translate-x-full'} transition-all duration-200`}>
                <div className="close flex">
                  <button onClick={() => setOpenSliderResult(false)} className="p-5 rounded-xl">
                    <FaAngleLeft className="w-6 h-6 text-gray-400 dark:text-gray-300"/>
                  </button>
                </div>
                <div className="vote result p-3">
                {isResultBallotLoading ? (
                    <div
                      className={`result gap-10 p-5 mb-10 bg-gradient-to-t  from-blue-400 to-red-400 dark:bg-gradient-to-br dark:from-[#323356] dark:to-[#563232] shadow-2xl rounded-lg animate-pulse`}
                    >
                      <h3 className="pop-semibold bg-gray-100 overflow-hidden dark:bg-zinc-500 rounded-lg mb-2 h-10"></h3>
                      <div className="candidates-result flex flex-col gap-3">
                        <div className="candidate bg-[#E5E0FF] dark:bg-[#313131]  sm:pr-6 sm:rounded-l-[5rem] rounded-xl sm:rounded-br-[3rem] flex items-center justify-between flex-col sm:flex-row">
                          <div className="candidate-profile relative flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                            <div className="gradientball w-[54px] h-[54px] sm:w-20 sm:h-20 bg-gradient-to-t from-blue-500 to-red-500 rounded-full absolute "></div>
                            <div className="object-cover z-20 w-[50px] h-[50px] sm:w-[74px] sm:h-[74px] mt-[2px]  sm:ml-[3px] sm:mt-0 rounded-full" />
                            <h3 className=""></h3>
                          </div>
                          <div className="candidate-votes flex flex-col items-center">
                            <h4 className=""></h4>
                            <h5 className=""></h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    resultBallotData
                      ?.sort((a: any, b: any) => a.position_order - b.position_order)
                      .map((result: any, index: any) => (
                        <div
                          key={index}
                          className={`result gap-10 p-2 mb-5 bg-gradient-to-t  from-blue-400 to-red-400 dark:bg-gradient-to-br dark:from-[#323356] dark:to-[#563232] shadow-2xl rounded-lg`}
                        >
                          <h3 className="pop-semibold bg-gray-100 overflow-hidden dark:bg-gray-600 dark:text-gray-100 text-gray-800 text-center py-2 sm:py-3 rounded-t-lg text-sm sm:text-lg">
                            {result.position}
                          </h3>
                          <div className="candidates-result flex flex-col gap-3">
                            {Number(result?.requiredWinner) > 1
                                ? result?.candidates?.sort((a: any, b: any) => b.count - a.count).slice(0, Number(result.requiredWinner))
                                  .map((candidate: any, index: any) => (
                                    <div
                                      key={index}
                                      className="candidate bg-[#E5E0FF] dark:bg-[#313131]  sm:py-3 sm:px-10 rounded-sm flex items-center justify-between dark:text-gray-100 flex-col sm:flex-row"
                                    >
                                      <div className="candidate-profile relative flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                                        <h3 className="pop-semibold text-xs sm:text-sm text-center sm:text-left dark:text-gray-200 md:text-lg">
                                          {candidate.fullname}
                                        </h3>
                                      </div>
                                      <div className="candidate-votes flex flex-col items-center">
                                          <BsFillTrophyFill className="w-6 h-6 text-yellow-400 dark:text-yellow-300"/>
                                      </div>
                                    </div>
                                  ))
                                : result?.candidates?.filter((candidate:any) => winner(result?.voted_candidates)?.includes(candidate.id)).length > 1
                                  ? result?.candidates?.filter((candidate:any) => winner(result?.voted_candidates)?.includes(candidate.id)).map((candidate: any, index: any) => (
                                      <div
                                        key={index}
                                        className="candidate bg-[#E5E0FF] dark:bg-[#313131]  py-2 sm:py-3 sm:px-10 rounded-sm flex items-center justify-between dark:text-gray-100 flex-col-reverse sm:flex-row"
                                      >
                                        <div className="candidate-profile relative flex flex-col sm:flex-row items-center sm:justify-between gap-2 md:gap-6">
                                          <h3 className="pop-semibold text-xs sm:text-sm text-center sm:text-left dark:text-gray-200 md:text-lg">
                                            {candidate.fullname}
                                          </h3>
                                          <h3 className="pop-regular text-xs">(tie {candidate.count} Vote)</h3>
                                        </div>
                                        <div className="candidate-votes flex flex-col items-center">
                                            <BsFillTrophyFill className="w-6 h-6 text-gray-400 dark:text-gray-300"/>
                                        </div>
                                      </div>
                                  ))
                                  : result?.candidates?.filter((candidate:any) => winner(result?.voted_candidates)?.includes(candidate.id)).map((candidate: any, index: any) => (
                                    <div
                                      key={index}
                                      className="candidate py-2 bg-[#E5E0FF] dark:bg-[#313131]  sm:py-3 sm:px-10 rounded-sm flex items-center justify-between dark:text-gray-100  flex-col-reverse sm:flex-row"
                                    >
                                      <div className="candidate-profile relative flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                                        <h3 className="pop-semibold text-xs sm:text-sm text-center sm:text-left dark:text-gray-200 md:text-lg">
                                          {candidate.fullname}
                                        </h3>
                                        <h3 className="pop-regular text-xs">(won {candidate.count} Vote)</h3>
                                      </div>
                                      <div className="candidate-votes flex flex-col items-center">
                                          <BsFillTrophyFill className="w-6 h-6 text-yellow-400 dark:text-yellow-300"/>
                                      </div>
                                    </div>
                                ))
                            }
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
              {/* SHOW ACTIVE ORGANIZATIONS ELECTION */}
            </div>
      </VoteModal>
      {/* RESULT MODAL */}
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
              ? <button className='flex items-center text-gray-100 bg-[#2F92F0] hover:bg-[#2F92F0] rounded-lg py-2 px-5 sm:px-7' onClick={handleCreateElection}>
                  <p className='pop-medium'>Create</p>   
                </button>
              : <button className='flex pop-medium items-center text-gray-100 bg-[#2F92F0] hover:bg-[#2F92F0] rounded-lg py-2 px-5 sm:px-7'>
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
                ? <button className='flex items-center text-gray-100 bg-blue-800 hover:bg-blue-700 rounded-lg py-2 px-5 sm:px-7' onClick={handleUpdate}>
                    <p className='pop-medium'>Update</p>   
                  </button>
                : <button disabled={isUpdating} className='flex pop-medium items-center text-gray-100 bg-blue-800 hover:bg-blue-700 rounded-lg py-2 px-5 sm:px-7'>
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




