import { useState } from 'react';
import {BsPlus} from 'react-icons/bs'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiDeleteBin5Fill, RiEditBoxFill } from 'react-icons/ri';
import {IoMdRemoveCircle} from 'react-icons/io' 
import { Drawer, Dropdown, MenuProps, Modal, Space, Spin, Tooltip, message } from 'antd';
import "react-datepicker/dist/react-datepicker.css";
import { DownOutlined } from '@ant-design/icons';
import { useCreatePosition, useDeletePosition, usePositions, useUpdatePosition } from '../../../hooks/queries/usePosition';

interface DataType {
  id: string;
  position: string;
}

export default function PositionTab() {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [position, setPosition] = useState<string>('')
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [openMulti, setOpenMulti] = useState(false);
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  //POSITION HOOKS
  //GET ALL
  const positionsQuery = usePositions()
  //CREATE SINGLE
  const { mutate: createPosition} = useCreatePosition()
  //DELETE SINGLE
  const { mutate: deletePosition} = useDeletePosition()

  //SORT POSITION ARRAY IN DESCENDING ORDER
  const descendingPositions = positionsQuery.data?.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  //FETCH DATA FOR CURRENT AND AVAILABLE CANDIDATES
  const fetchData = async (endpoints: string) => {
    try {
      const response = await axiosPrivate.get(`/${endpoints}`)
      return response.data
    } catch (error: any) {
      if (error.response) {
        if(error.response.status === 403){
          navigate('/login', {state: {from: location}, replace: true});
        }
        return [error.response.data ];
      }
      //Dead Server Return
      return [{error: error.message }];
    }
  }
   
  //ASYNCRONOUS DELETE POSITION FUNCTION
  async function handleDeletePosition(id: string) {
    deletePosition(id)
  }

  //DELETE POSITION CONFIRMATION MODAL
  const deleteIt = (id: string, name: string) => {
    Modal.confirm({
      title: 'Do you want to delete this Position?',
      content: `Deleting position: ${name}`,
      className: 'text-gray-700',
      onOk() {
        return new Promise((resolve, reject) => {
          handleDeletePosition(id)
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
    setPosition('')
    setOpen(false)
  }

  //CREATE POSITION FUNCTION
  const handleCreate = async (e:any) => {
      createPosition({position})
      setIsCreating(false)
      onClose()
      
  }

  //DRAWER STATES
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [modifyId, setModifyId] = useState<string>('')
  const [modifyPosition, setModifyPosition] = useState<string>('')
  const [availableCandidates, setAvailableCandidates] = useState([])
  const [currentCandidates, setCurrentCandidates] = useState([])
  const [isDisconnectiong, setIsDisConnecting] = useState<boolean>(false)
  const [isConnectiong, setIsConnecting] = useState<boolean>(false)

  //OPEN MODIFY MULTI-PARENT DRAWER FUNCTION
  const openMultiDrawer = (id: string) => {
    setOpenMulti(true)
    const single = positionsQuery.data?.filter((pos: DataType)=> pos.id === id)
    setModifyId(single[0].id)
    setModifyPosition(single[0].position)
  }
  
  //CLOSE MODIFY MULTI-PARENT DRAWER FUNCTION
  const onCloseMultiDrawer = () => {
    setOpenMulti(false)
  }
  //GET ALL AVAILABLE CANDIDATES REQUEST FUNCTION
  const getAvailableCandidates = async () => {
    const response = await fetchData(`candidate/null`)
    setAvailableCandidates(response)
  }
  //GET ALL CURRENT CANDIDATES REQUEST FUNCTION
  const getCurrentCandidates = async () => {
    const response = await fetchData(`candidate/seat-candidate/${modifyId}`)
    if(response[0]?.error === 'Network Error'){
        message.open({
          type: 'error',
          content: 'Server Unavailable',
          className: 'custom-class pop-medium',
          duration: 2.5,
        })
    }
    setCurrentCandidates(response)
  }

  //DISCONNECT SINGLE CANDIDATE FROM SPECIFIC POSITION
  const disConnectCandidate = async (candidateId: string, positionID: string) => {
    setIsDisConnecting(true)
    const key = 'diconnectCandidateKEY'
    const disconnectCandidate = {
      seat_id: positionID,
      candidate_id: candidateId,
    }

    await axiosPrivate.patch('candidate/disconnect/candidate-seat', disconnectCandidate)
    .then((response) => {
        message.open({
          key,
          type: 'success',
          content: 'Disconnected Successfully',
          duration: 2,
        });  
        getCurrentCandidates()
        getAvailableCandidates()
        setIsDisConnecting(false)
    })
    .catch((error) => {
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
    getAvailableCandidates()
    getCurrentCandidates()
    setChildrenDrawer(true);
  };
  //CLOSE MODIFY MULTI-CHILD DRAWER FUNCTION
  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };


  //MUTATION HOOK OF UPDATE POSITION 
  const {mutate: updatePosition} = useUpdatePosition()
  //UPDATE A POSITION FUNCTION
  const handleUpdatePosition = async (e:any) => {
    e.preventDefault()
    setIsUpdating(true)
    
    if(modifyPosition === '' ) {
      setIsUpdating(false)
      return message.open({
        type: 'error',
        content: 'Please fill the fields',
        className: 'custom-class pop-medium',
        duration: 2.5,
      });
    }
    
    const updatePosData = {
      id: modifyId,
      position: modifyPosition,
    }

    updatePosition(updatePosData)
    setIsCreating(false)
    onCloseMultiDrawer()
    setIsUpdating(false)
    setModifyId('')
    setModifyPosition('')
  }

  //CONNECT SINGLE CANDIDATE FROM SPECIFIC POSITION
  const onClick: MenuProps['onClick'] = async ({ key }) => {
    setIsConnecting(true)
    const messageKey = 'connectCandidateKEY'
    const connectCandidate = {
      seat_id: modifyId,
      candidate_id: key,
    }

    await axiosPrivate.patch('candidate/connect/candidate-seat', connectCandidate)
    .then((response) => {
        message.open({
          key: messageKey,
          type: 'success',
          content: 'Connected Successfully',
          duration: 2,
        });  
        getCurrentCandidates()
        getAvailableCandidates()
        setIsConnecting(false)
    })
    .catch((error) => {
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

  //POPULATE AVAILABLE POSITION INSIDE A DROPDOWN
  const items: MenuProps['items'] = availableCandidates?.length === 0 
    ? [{
        label: "No Position Available",
        key: "No Key"
      }]
    : availableCandidates?.map((can:any) => {
        return {
          label: can.fullname,
          key: can.id,
        }
      })


  return (
    <div className=' bg-white dark:bg-[#303030] rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex justify-between items-center pt-10  mx-5">
        <h3 className='text-lg pop-semibold text-gray-950 dark:text-gray-100'>Positions</h3>
        <button onClick={showDrawer} className='flex justify-center items-center py-1 md:py-2 pr-3 pl-1 text-white pop-medium bg-[#E27429] hover:text-[#E27429] border-2 border-[#E27429] hover:bg-transparent focus:outline-none rounded-2xl'>
          <BsPlus size={25} className='' />
          <h3 className='text-sm md:text-md'>CREATE</h3>
        </button>
      </div>
      {/* CREATE BUTTON */}

      {/* ALL POSITIONS */}
      <div className="container w-full mx-auto p-4 overflow-x-auto">
        {positionsQuery.status === 'error' || positionsQuery.data?.[0]?.error === 'Network Error'
            ? <h4 className='text-red-400 pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>Sorry, Something went wrong.</h4>
            : descendingPositions?.length === 0 
                ? <h4 className='text-gray-400 opacity-90 border-2 rounded-lg pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>No Positions</h4>
                : <div className="grid items-center md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {descendingPositions?.map((pos:DataType, index: any) =>(
                  <div key={index} className="card border-2 dark:border-gray-600 p-2 shadow-md bg-gray-100 dark:bg-[#2a2a2a] rounded-tl-sm rounded-br-sm rounded-tr-3xl rounded-bl-3xl">
                    <h3 className='pop-semibold text-[#303030] dark:text-gray-200 text-center pt-3 pb-1'>{pos.position}</h3>
                    
                    {/* ACTIONS DISPLAY */}
                    <div className="actions flex justify-evenly py-2 ">
                      <Tooltip title='Delete' color='#f87171'>
                        <button
                          onClick={(e) => deleteIt(pos.id, pos.position)}
                          className={`pop-medium text-center align-middle p-2 rounded-xl text-white bg-red-400  focus:outline-none`}
                        >
                          <RiDeleteBin5Fill />
                        </button>
                      </Tooltip>
      
                      <Tooltip title='Modify' color='#60a5fa'>
                        <button
                          onClick={()=> {
                            openMultiDrawer(pos.id)
                          }}
                          className={`pop-medium text-center align-middle p-2 rounded-xl text-white bg-blue-400  focus:outline-none`}
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
      
      {/* CREATE POSITION DRAWER */}
      <Drawer title="Create Position" placement="right" onClose={onClose} open={open}>
        <form className="create-position-container py-3">
          <div className="name flex flex-col pop-medium">
            
            <label className='pb-1 pt-5 opacity-80'>Position Name</label>
            <input value={position} onChange={(e) => setPosition(e.target.value)} type="text" className='py-1 px-3 text-lg focus:outline-indigo-400 rounded-md border-solid border-2' />
            
          </div>
        </form>
        {/* CREATE BUTTON */}
        {position.length > 5 && (
          <div className="btn-container flex items-center justify-center pt-3">
            {!isCreating 
              ? <button className='flex items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-7 rounded-full' onClick={handleCreate}>
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
      {/* CREATE POSITION DRAWER */}

      {/* UPDATE POSITION MULTI-PARENT DRAWER */}
      <Drawer title="Modify" onClose={onCloseMultiDrawer} open={openMulti}>
        <div className='pop-medium flex flex-col'>
          {/* CONNECTIONS BUTTON */}
          <button onClick={showChildrenDrawer} className='border-2 py-1 px-2 rounded-md '>Connections</button>
          {/* CONNECTIONS BUTTON */}
            
          <label className='pb-1 opacity-80 pt-10'>Position Name</label>
          <input value={modifyPosition} onChange={(e) => setModifyPosition(e.target.value)} type="text" className='py-1 px-3 text-lg focus:outline-indigo-400 rounded-md border-solid border-2 w-full' />

          {/* UPDATE BUTTON */}
            <div className="cnt flex items-center justify-center p-5">
              {!isUpdating 
                ? <button className='flex items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-7 rounded-full' onClick={handleUpdatePosition}>
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
        {/* UPDATE POSITION MULTI-CHILD DRAWER */}
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
                  Available Candidates
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
          <div className="wrapp px-1 rounded-xl py-2 pop-regular mt-16 shadow-sm">
            <h3 className='py-3 pop-semibold text-center shadow-sm rounded-xl bg-gray-100 mb-3'>Current Candidates</h3>
            {currentCandidates?.length === 0
              ? <div className="no-current text-gray-600 flex justify-center items-center p-5 opacity-80 pop-medium">
                  <h4>No Candidates Assigned </h4>
                </div>
              : currentCandidates?.map((current:any, index:any) => (
                <div key={index} className="item flex justify-between items-center py-2 px-3 odd:bg-gray-100 rounded-md hover:bg-blue-100">
                  <h3>{current.fullname}</h3>
                  <Tooltip title='Remove' color='#f87171'>
                    <button onClick={() => disConnectCandidate(current.id, current.seatId)} className='p-1'>
                      <IoMdRemoveCircle size={25} className='text-red-400'/>
                    </button>
                  </Tooltip>
                </div>
              ))
            }
          </div>
        </Drawer>
        {/* UPDATE POSITION MULTI-CHILD DRAWER */}
      </Drawer>
      {/* UPDATE POSITION MULTI-PARENT DRAWER */}
      
    {/* ALL POSITIONS */}
    </div>
  )
}




