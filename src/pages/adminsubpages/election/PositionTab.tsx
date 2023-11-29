import { useState } from 'react';
import {BsPlus} from 'react-icons/bs'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiDeleteBin5Fill, RiEditBoxFill } from 'react-icons/ri';
import {IoMdRemoveCircle} from 'react-icons/io' 
import { Drawer, Dropdown, MenuProps, Space, Spin, Tooltip, message } from 'antd';
import "react-datepicker/dist/react-datepicker.css";
import { DownOutlined } from '@ant-design/icons';
import { useCreatePosition, useDeletePosition, usePositions, useUpdatePosition } from '../../../hooks/queries/usePosition';
import { useQueryClient } from '@tanstack/react-query';
import DeleteMe from '../../../components/DeleteMe';
import { TiWarning } from 'react-icons/ti';

interface DataType {
  id: string;
  position: string;
}

export default function PositionTab() {
  const [position, setPosition] = useState<string>('')
  const [winner, setWinner] = useState<string>('1')
  const [order, setOrder] = useState<string>('1')
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [openMulti, setOpenMulti] = useState(false);
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  //POSITION HOOKS
  //GET ALL
  const positionsQuery = usePositions()
  //CREATE SINGLE
  const { mutate: createPosition, isLoading: isCreating} = useCreatePosition()
  //DELETE SINGLE
  const { mutate: deletePosition, isLoading: isDeletingPosition} = useDeletePosition()

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

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingPositionName, setDeletingPositionName] = useState<string>('')
  const [deletingPositionID, setDeletingPositionID] = useState<string>('')
   
  //ASYNCRONOUS DELETE POSITION FUNCTION
  async function handleDeletePosition() {
    deletePosition(deletingPositionID,
      {
        onSettled: () => setOpenDeleteModal(false)
    })
    
  }

  //DELETE POSITION CONFIRMATION MODAL
  const deleteIt = (id: string, name: string) => {
    setDeletingPositionName(name)
    setDeletingPositionID(id)
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
    setPosition('')
    setWinner('1')
    setOrder('1')
    setOpen(false)
  }

  //CREATE POSITION FUNCTION
  const handleCreate = async (e:any) => {
    if(winner.length > 1){
      return message.open({
        key: 'errorCreation',
        type: 'error',
        content: 'too much winner',
        duration: 3,
    })
    }else if(order.length > 2){
      return message.open({
        key: 'errorCreation',
        type: 'error',
        content: 'too much order',
        duration: 3,
    })
    }
    
    createPosition({position, requiredWinner: winner, position_order: order},
      {
        onSettled: () => {
          setPosition('')
          setWinner('1')
          setOrder('1')
        }
      })
  }

  //DRAWER STATES
  //const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [modifyId, setModifyId] = useState<string>('')
  const [modifyPosition, setModifyPosition] = useState<string>('')
  const [modifyWinner, setModifyWinner] = useState<string>('1')
  const [modifyOrder, setModifyOrder] = useState<string>('1')
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
    setModifyWinner(single[0].requiredWinner)
    setModifyOrder(single[0].position_order ?? '1')
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

  const queryClient = useQueryClient()

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
        queryClient.invalidateQueries({
          queryKey: ['candidates'],
          exact: true
        })
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
  const {mutate: updatePosition, isLoading: isUpdating} = useUpdatePosition()
  //UPDATE A POSITION FUNCTION
  const handleUpdatePosition = async (e:any) => {
    e.preventDefault()
    //setIsUpdating(true)
    if(modifyWinner.length > 1){
      return message.open({
        type: 'error',
        content: 'Too many required Winner',
        className: 'custom-class pop-medium',
        duration: 2.5,
      });
    }else if(modifyOrder.length > 2){
      return message.open({
        type: 'error',
        content: 'Too much position Order',
        className: 'custom-class pop-medium',
        duration: 2.5,
      });
    }
    
    if(modifyPosition === '' || modifyWinner === '' || modifyWinner === '0' || modifyOrder === '' || modifyOrder === '0') {
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
      requiredWinner: modifyWinner,
      position_order: modifyOrder,
    }

    updatePosition(updatePosData,
      {
        onSuccess: () => {
          setOpenMulti(false)
        }
      })
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
        queryClient.invalidateQueries({
          queryKey: ['candidates'],
          exact: true
        })
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
    <div className=' bg-white overflow-hidden dark:bg-[#303030] rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex justify-between items-center pt-10  mx-5">
        <h3 className='text-lg pop-semibold text-gray-950 dark:text-gray-100'>Positions</h3>
        <button onClick={showDrawer} className='flex justify-center items-center py-1 md:py-2 sm:pr-3 px-1 text-white pop-medium bg-[#E27429] hover:text-[#E27429] border-2 border-[#E27429] hover:bg-transparent focus:outline-none rounded-2xl transition duration-300 ease-in-out'>
          <BsPlus size={25} className='' />
          <h3 className='text-sm md:text-md hidden sm:inline'>CREATE</h3>
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
                          className={`pop-medium text-center align-middle p-2 rounded-lg text-white bg-red-500  focus:outline-none`}
                        >
                          <RiDeleteBin5Fill />
                        </button>
                      </Tooltip>
      
                      <Tooltip title='Modify' color='#60a5fa'>
                        <button
                          onClick={()=> {
                            openMultiDrawer(pos.id)
                          }}
                          className={`pop-medium text-center align-middle p-2 rounded-lg text-white bg-blue-500  focus:outline-none`}
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
            <input value={position} onChange={(e) => setPosition(e.target.value)} type="text" className='py-1 px-3 text-lg outline-none focus:border-indigo-400 rounded-md border-solid border-2' />
            <div className=" py-5 flex justify-between">
              <div className="winner flex flex-col">
                <label className='pb-1 pt-5 opacity-80'>Required Winner</label>
                <input value={winner} onChange={(e) => setWinner(e.target.value)} type="number" className='pop-medium text-lg text-center w-20 p-2 flex-grow-0 rounded-lg border-2 outline-none focus:border-indigo-400' min={1} max={99} minLength={1} maxLength={1}/>
              </div>
              <div className="order flex flex-col">
                <label className='pb-1 pt-5 opacity-80'>Order</label>
                <input value={order} defaultValue={"1"} onChange={(e) => setOrder(e.target.value)} type="number" className='pop-medium text-lg text-center w-20 p-2 flex-grow-0 rounded-lg border-2 outline-none focus:border-indigo-400' min={1} max={20} minLength={1} maxLength={2} />
              </div>
            </div>
            
          </div>
        </form>
        {/* CREATE BUTTON */}
        {position.length > 1 && (
          <div className="btn-container flex items-center justify-center pt-3">
            {!isCreating 
              ? <button disabled={isCreating} className='flex items-center bg-orange-600 hover:bg-orange-700 rounded-lg py-2 px-7 text-white' onClick={handleCreate}>
                  <p className='pop-medium'>Create</p>   
                </button>
              : <button disabled={isCreating} className='flex pop-medium items-center bg-orange-600 hover:bg-orange-700 rounded-lg py-2 px-3 text-white'>
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
          <div className=" py-5 flex justify-between">
            <div className="winner flex flex-col">
              <label className='pb-1 pt-5 opacity-80'>Required Winner</label>
              <input value={modifyWinner} onChange={(e) => setModifyWinner(e.target.value)} type="number" className='pop-medium text-lg text-center w-20 p-2 flex-grow-0 rounded-lg border-2 outline-none focus:border-indigo-400' min={1} max={9} />
            </div>
            
            <div className="order flex flex-col">
              <label className='pb-1 pt-5 opacity-80'>Order</label>
              <input value={modifyOrder} defaultValue={"1"} onChange={(e) => setModifyOrder(e.target.value)} type="number" className='pop-medium text-lg text-center w-20 p-2 flex-grow-0 rounded-lg border-2 outline-none focus:border-indigo-400' min={1} max={20} minLength={1} maxLength={2} />
            </div>
            
          </div>

          {/* UPDATE BUTTON */}
            <div className="cnt flex items-center justify-center p-5">
              {!isUpdating 
                ? <button disabled={isUpdating} className='flex text-white items-center bg-blue-800 hover:bg-blue-700 rounded-lg py-2 px-7' onClick={handleUpdatePosition}>
                    <p className='pop-medium'>Update</p>   
                  </button>
                : <button disabled={isUpdating} className='flex pop-medium text-white items-center bg-blue-800 hover:bg-blue-700 rounded-lg py-2 px-3'>
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

      {/* DELETE MODAL */}
      <DeleteMe open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <div className="delete-container py-5 px-10 rounded-2xl bg-white dark:bg-[#414141]">
              <div className="px-10">
                <div className="icon flex justify-center">
                  <div className="warning_icon p-3 shadow-md bg-[#fff5f6] dark:bg-[#504f4f] rounded-full">
                    <TiWarning size={30} className="text-[#ff3f56]" />
                  </div>
                </div>
                <div className="warn flex justify-center pt-5 pb-3">
                  <h2 className="md:text-xl text-lg md:tracking-wider pop-bold text-[#334049] dark:text-gray-200">
                    Delete Position
                  </h2>
                </div>
                <div className="warn-text tracking-wider text-xs md:text-sm">
                  <p className="pop-regular text-[#334049] dark:text-gray-300 text-center">
                    Do you want to delete <span className='pop-bold'>{deletingPositionName}</span>
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
                {isDeletingPosition ? (
                  <button
                    disabled={isDeletingPosition}
                    className="bg-[#ff3f56] text-white px-6 py-2 rounded-full"
                  >
                    Deleting...
                  </button>
                ) : (
                  <button
                    disabled={isDeletingPosition}
                    onClick={handleDeletePosition}
                    className="bg-[#ff3f56] text-white px-6 py-2 rounded-full"
                  >
                    Yes, Delete!
                  </button>
                )}
              </div>
            </div>
      </DeleteMe>
      {/* DELETE MODAL */}
      
    {/* ALL POSITIONS */}
    </div>
  )
}




