import { useState } from 'react';
import {BsPlus} from 'react-icons/bs'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiDeleteBin5Fill, RiEditBoxFill } from 'react-icons/ri';
import {IoMdRemoveCircle} from 'react-icons/io' 
import { Drawer, Dropdown, MenuProps, Modal, Space, Spin, Tooltip, message } from 'antd';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useCreateElection, useDeleteElection, useElections, useUpdateElection } from '../../../hooks/queries/useElection';

interface DataType {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
}

export default function ElectionTab() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [openMulti, setOpenMulti] = useState(false);
  const [singleOrganization, setSingleOrganization] = useState<DataType>()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()
  
  //ELECTOIN QUERY HOOKS
  //GET ALL
  const electionsQuery = useElections()
  //CREATE SINGLE
  const { mutate: createElection} = useCreateElection()
  //DELETE SINGLE
  const { mutate: deleteElection} = useDeleteElection()
  
  //SORT ELECTION ARRAY IN DESCENDING ORDER
  const descendingElections = electionsQuery?.data?.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
  

  //ASYNCRONOUS DELETE ELECTION FUNCTION
  async function handleDeleteElection(id: string) {
    deleteElection(id)
  }

  //DELETE ELECTION CONFIRMATION MODAL
  const deleteIt = (id: string, name: string) => {
    Modal.confirm({
      title: 'Do you want to delete this Election?',
      content: `Deleting election: ${name}`,
      className: 'text-gray-700',
      onOk() {
        return new Promise((resolve, reject) => {
          handleDeleteElection(id)
            .then(resolve)
            .catch(reject);
        }).catch(() => console.log('Oops, an error occurred!'));
      },
      onCancel() {},
    });
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
    setStartDate(null)
    setEndDate(null)
    setOpen(false)
  }

  //CREATE ELECTION FUNCTION
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
    const uploadElecData = {
      title: name,
      startDate: moment(startDate).utc().format('YYYY-MM-DD'),
      endDate: moment(endDate).utc().format('YYYY-MM-DD')
    }
    //mutate the election data
    createElection(uploadElecData)
    onClose()
    setIsCreating(false)
  }

  //DRAWER STATES
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [modifyId, setModifyId] = useState<string>('')
  const [modifyName, setModifyName] = useState<string>('')
  const [modifyStatus, setModifyStatus] = useState<string>('')
  const [modifyStartDate, setModifyStartDate] = useState<Date | null>()
  const [modifyEndDate, setModifyEndDate] = useState<Date | null>()
  const [availableOrganizations, setAvailableOrganizations] = useState([])
  const [currentOrganizations, setCurrentOrganizations] = useState([])
  const [electionID, setElectionID] = useState<string>('')
  const [isDisconnectiong, setIsDisConnecting] = useState<boolean>(false)
  const [isConnectiong, setIsConnecting] = useState<boolean>(false)
  
  //OPEN MODIFY MULTI-PARENT DRAWER FUNCTION
  const openMultiDrawer = (id: string, name: string) => {
    setOpenMulti(true)
    const single = electionsQuery.data?.filter((elec: DataType)=> elec.id === id)
    
    const startdate = new Date(single[0].startDate)
    const enddate = new Date(single[0].endDate)
    
    setModifyId(single[0].id)
    setModifyName(single[0].title)
    setModifyStatus(single[0].status)
    setModifyStartDate(startdate)
    setModifyEndDate(enddate)
    
  }
  
  //CLOSE MODIFY MULTI-PARENT DRAWER FUNCTION
  const onCloseMultiDrawer = () => {
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

  //MUTATION HOOK OF UPDATE ELECTION 
  const {mutate: updateElection} = useUpdateElection()
  //UPDATE AN ELECTION FUNCTION
  const handleUpdate = async (e:any) => {
    e.preventDefault()
    setIsUpdating(true)
    
    if(modifyStartDate === null || modifyEndDate === null || modifyName === '') {
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
      startDate: moment(modifyStartDate).utc().format('YYYY-MM-DD'),
      endDate: moment(modifyEndDate).utc().format('YYYY-MM-DD')
    }

    updateElection(updateElecData)
    setIsUpdating(false)
    onCloseMultiDrawer()
    setModifyId('')
    setModifyName('')
    setModifyStartDate(null)
    setModifyEndDate(null)    

  }

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
    <div className='Election bg-white dark:bg-[#303030] rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex justify-between items-center pb-3 pt-10  mx-5">
        <h3 className='text-lg pop-semibold text-gray-950 dark:text-gray-100'>Elections</h3>
        <button onClick={showDrawer} className='flex justify-center items-center py-1 md:py-2 pr-3 pl-1 text-white pop-medium bg-[#3961ee] hover:text-[#3961ee] border-2 border-[#3961ee] hover:bg-transparent focus:outline-none rounded-2xl'>
          <BsPlus size={25} className='' />
          <h3 className='text-sm md:text-md'>CREATE</h3>
        </button>
      </div>
      {/* CREATE BUTTON */}

      {/* ALL ORGANIZATIONS */}
      <div className="container w-full mx-auto p-4 overflow-x-auto">
        {electionsQuery.status === 'error' || electionsQuery.data?.[0]?.error === 'Network Error'
            ? <h4 className='text-red-400 pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>Sorry, Something went wrong.</h4>
            : descendingElections?.length === 0 
                ? <h4 className='text-gray-400 opacity-90 border-2 rounded-lg pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>No Elections</h4>
                : <div className="grid items-center gap-5">
                  {descendingElections?.map((elec:DataType, index: any) =>(
                    <div key={index} className="card px-4 shadow-md bg-gray-100 rounded-md dark:bg-[#2a2a2a] flex flex-cols-2">
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
                      <div className="actions flex flex-col-reverse md:flex-row items-end justify-end gap-3 md:gap-5 py-2">
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
        {name !== '' && (
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
        <div className='pop-medium'>
          {/* CONNECTIONS BUTTON */}
          <button onClick={showChildrenDrawer} className='border-2 py-1 px-2 rounded-md'>Connections</button>
          {/* CONNECTIONS BUTTON */}
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
      
      {/* ALL ORGANIZATIONS */}
    </div>
  )
}




