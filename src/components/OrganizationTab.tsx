import { useEffect, useRef, useState } from 'react';
import {BsPlus} from 'react-icons/bs'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RiDeleteBin5Fill, RiEditBoxFill } from 'react-icons/ri';
import {FaCamera} from 'react-icons/fa' 
import {IoMdRemoveCircle} from 'react-icons/io' 
import { Drawer, Dropdown, Menu, MenuProps, Modal, Progress, Space, Spin, Tooltip, message } from 'antd';
import DatePicker from "react-datepicker";
import { useDropzone } from 'react-dropzone';
import React from 'react';
import moment from 'moment';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';

interface DataType {
  id: string;
  org_name: string;
  logo_url: string;
  startDate: string;
  endDate: string;
}

export default function OrganizationTab() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [image, setImage] = useState([])
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [openMulti, setOpenMulti] = useState(false);
  const [singleOrganization, setSingleOrganization] = useState<DataType>()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()
  
  const onDrop = React.useCallback((acceptedFiles: any) => {
    //console.log(acceptedFiles);
    setImage(
      acceptedFiles.map((file:any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    )}, []);
  
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

  function fileSizeValidator(file:any) {
    if (file.size > 1024 ** 2 * 2) {
      return {
        code: 'size-too-large',
        message: `File is larger than 2mb`,
      };
    }
    return null;
  }

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
  
  //Organizations Query
  const fetchOrganizations = async () => {
    return await fetchData('organization');
  };
  const organizationsQuery = useQuery(
    {queryKey: ['organizations'], queryFn: fetchOrganizations},
  ) 

  async function handleDeleteOrganization(id: string) {
    try {
      const response = await axiosPrivate.delete(`organization/${id}`);
      console.log(response.data.message);
    } catch (error) {
      console.log('Oops, an error occurred:', error);
    }
  }

  const deleteIt = (id: string, name: string) => {
    Modal.confirm({
      title: 'Do you want to delete this Organization?',
      content: `Deleting organization: ${name}`,
      className: 'text-gray-700',
      onOk() {
        return new Promise((resolve, reject) => {
          handleDeleteOrganization(id)
            .then(resolve)
            .catch(reject);
        }).catch(() => console.log('Oops, an error occurred!'));
      },
      onCancel() {},
    });
  }

  useEffect(()=> {
    return () => image.forEach((file:any) => URL.revokeObjectURL(file.preview));
  }, [singleOrganization])

  const [open, setOpen] = useState(false)
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setImage([])
    setName('')
    setStartDate(null)
    setEndDate(null)
    setOpen(false)
  }

  const createOrganization = async (logo_url: string) => {

    const key = 'createOrganizationKEY';

    //console.log(logoCloudLink);
    
    const uploadOrgData = {
      org_name: name,
      logo_url,
      startDate: moment(startDate).utc().format('YYYY-MM-DD'),
      endDate: moment(endDate).utc().format('YYYY-MM-DD')
    }

    await axiosPrivate.post('/organization', uploadOrgData)
    .then((response) => {
        //console.log('Success:', response.data);
        message.open({
          key,
          type: 'success',
          content: 'Organization Created',
          duration: 2,
        });
        onClose()
        setIsCreating(false)

        
    })
    .catch((error) => {
        //console.error('Error:', error);
        setIsCreating(false)
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


  const handleCreate = async (e:any) => {
    e.preventDefault()
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

    const url = 'http://api.cloudinary.com/v1_1/nanad/image/upload';
    const formData = new FormData();
      // Use the first item to upload
      let file = image[0]
      formData.append('file', file);
      formData.append('upload_preset', 'dz4hcr6r');

    await fetch(url, {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data)
      createOrganization(data.url)
    })
    .catch(error => console.error(error))
  }

  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [modifyId, setModifyId] = useState<string>('')
  const [modifyName, setModifyName] = useState<string>('')
  const [modifyUrl, setModifyUrl] = useState<string>('')
  const [modifyStartDate, setModifyStartDate] = useState<Date | null>()
  const [modifyEndDate, setModifyEndDate] = useState<Date | null>()
  const [availablePositions, setAvailablePositions] = useState([])
  const [currentPositions, setCurrentPositions] = useState([])
  const [ballotID, setBallotID] = useState<string>('')
  const [isDisconnectiong, setIsDisConnecting] = useState<boolean>(false)
  const [isConnectiong, setIsConnecting] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  
  const openMultiDrawer = (id: string, name: string) => {
    setOpenMulti(true)
    // setSingleOrganization(organizationsQuery.data?.filter((org: DataType)=> org.id === id))
    const single = organizationsQuery.data?.filter((org: DataType)=> org.id === id)

    const startdate = new Date(single[0].startDate)
    const enddate = new Date(single[0].endDate)

    setModifyId(single[0].id)
    setModifyName(single[0].org_name)
    setModifyUrl(single[0].logo_url)
    setModifyStartDate(startdate)
    setModifyEndDate(enddate)
    
  }
  
  const onCloseMultiDrawer = () => {
    setOpenMulti(false)
  }
  
  const getAvailablePositions = async () => {
    const response = await fetchData(`seat/null`)
    setAvailablePositions(response)
  }
  const getCurrentPositions = async () => {
    const response = await fetchData(`organization/org-ballot/${modifyId}`)
    if(response[0]?.error === 'Network Error'){
        message.open({
          type: 'error',
          content: 'Server Unavailable',
          className: 'custom-class pop-medium',
          duration: 2.5,
        })
    }
    setBallotID(response.id)
    setCurrentPositions(response.seats)
  }

  const disConnectPosition = async (positionId: string, ballotId: string) => {
    setIsDisConnecting(true)

    const key = 'diconnectPositionKEY'
    const disconnectPosition = {
      ballot_id: ballotId,
      seat_id: positionId,
    }

    await axiosPrivate.patch('seat/disconnect-seat-ballot', disconnectPosition)
    .then((response) => {
        //console.log('Success:', response.data);
        message.open({
          key,
          type: 'success',
          content: 'Disconnected Successfully',
          duration: 2,
        });  
        getCurrentPositions()
        getAvailablePositions()
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

  const showChildrenDrawer = () => {
    getAvailablePositions()
    getCurrentPositions()
    setChildrenDrawer(true);
  };
  
  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateImage = async (e:any) => {
    e.preventDefault()
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dz4hcr6r');

    const url = 'http://api.cloudinary.com/v1_1/nanad/image/upload';
    try {
      const response = await axios.post(url,
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
    } catch (error) {
      console.log('Error uploading image: ', error);
    }
  }

  const updateOrganization = async (e:any) => {
    e.preventDefault()
    setIsUpdating(true)
    
    if(modifyStartDate === null || modifyEndDate === null || modifyName === '' || modifyUrl === '') {
      setIsUpdating(false)
      return message.open({
        type: 'error',
        content: 'Please fill the fields',
        className: 'custom-class pop-medium',
        duration: 2.5,
      });
    }

    const key = 'updateOrganizationKEY'
    const updateOrgData = {
      org_name: modifyName,
      logo_url: modifyUrl,
      start_date: moment(modifyStartDate).utc().format('YYYY-MM-DD'),
      end_date: moment(modifyEndDate).utc().format('YYYY-MM-DD')
    }

    await axiosPrivate.patch(`/organization/${modifyId}`, updateOrgData)
    .then((response) => {
        //console.log('Success:', response.data);
        message.open({
          key,
          type: 'success',
          content: 'Organization Updated',
          duration: 2,
        });
        onCloseMultiDrawer()
        setIsUpdating(false)
        setModifyId('')
        setModifyName('')
        setModifyUrl('')
        setModifyStartDate(null)
        setModifyEndDate(null)
        setUploadProgress(0)     
    })
    .catch((error) => {
        //console.error('Error:', error);
        setIsUpdating(false)
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


  const onClick: MenuProps['onClick'] = async ({ key }) => {
    setIsConnecting(true)

    const messageKey = 'diconnectPositionKEY'
    const connectPosition = {
      ballot_id: ballotID,
      seat_id: key,
    }

    await axiosPrivate.patch('seat/connect-seat-ballot', connectPosition)
    .then((response) => {
        //console.log('Success:', response.data);
        message.open({
          key: messageKey,
          type: 'success',
          content: 'Connected Successfully',
          duration: 2,
        });  
        getCurrentPositions()
        getAvailablePositions()
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

  const items: MenuProps['items'] = availablePositions?.length === 0 
    ? [{
        label: "No Position Available",
        key: "No Key"
      }]
    : availablePositions?.map((pos:any) => {
        return {
          label: pos.position,
          key: pos.id,
        }
      })


  return (
    <div className='Election bg-white dark:bg-[#303030] rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex justify-between items-center pt-10  mx-5">
        <h3 className='text-lg pop-semibold text-gray-950 dark:text-gray-100'>Organizations</h3>
        <button onClick={showDrawer} className='flex justify-center items-center py-1 md:py-2 pr-3 pl-1 text-white pop-medium bg-[#3961ee] hover:text-[#3961ee] border-2 border-[#3961ee] hover:bg-transparent focus:outline-none rounded-2xl'>
          <BsPlus size={25} className='' />
          <h3 className='text-sm md:text-md'>CREATE</h3>
        </button>
      </div>
      {/* CREATE BUTTON */}

      {/* ALL ORGANIZATIONS */}
      <div className="container w-full mx-auto p-4 overflow-x-auto">
        {organizationsQuery.status === 'error' || organizationsQuery.data[0]?.error === 'Network Error'
            ? <h4 className='text-red-400 pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>Sorry, Something went wrong.</h4>
            : organizationsQuery.data?.length === 0 
                ? <h4 className='text-gray-400 opacity-90 border-2 rounded-lg pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>No Organization</h4>
                : <div className="grid items-center md:grid-cols-2 lg:grid-cols-4 md:gap-5">
                {organizationsQuery.data?.map((org:DataType, index: any) =>(
                  <div key={index} className="card p-2 shadow-md bg-gray-100 rounded-2xl dark:bg-[#2a2a2a]">
                    <div className="img-container w-full rounded-lg overflow-hidden">
                      <img className='object-cover h-40 w-full' src={org.logo_url} alt="" />
                    </div>
                    <h3 className='pop-semibold text-[#303030] dark:text-gray-200 text-center pt-3 pb-1'>{org.org_name}</h3>
                    <div className="dates flex text-xs justify-between text-gray-500 pop-regular">
                      <p className="">
                        {new Date(org.startDate).toLocaleDateString("en-US", {
                          timeZone: "Asia/Manila",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-right">
                        {new Date(org.endDate).toLocaleDateString("en-US", {
                          timeZone: "Asia/Manila",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="actions flex justify-between py-2">
                      <Tooltip title='Delete' color='#f87171'>
                        <button
                          onClick={(e) => deleteIt(org.id, org.org_name)}
                          className={`pop-medium text-center align-middle p-2 rounded-xl text-white bg-red-400 shadow-sm shadow-red-400 focus:outline-none`}
                        >
                          <RiDeleteBin5Fill />
                        </button>
                      </Tooltip>
      
                      <Tooltip title='Modify' color='#60a5fa'>
                        <button
                          onClick={()=> {
                            openMultiDrawer(org.id,org.org_name)
                          }}
                          className={`pop-medium text-center align-middle p-2 rounded-xl text-white bg-blue-400 shadow-sm shadow-blue-400 focus:outline-none`}
                          >
                          <RiEditBoxFill />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
            </div>
            }
        
      </div>
      <Drawer title="Create Organization" placement="right" onClose={onClose} open={open}>
        <form className="create-organization-container py-3">
          <div className="name flex flex-col pop-medium">
            {/* DRAG N DROP LOGO PICTURE */}
            <label className='opacity-80 py-2 text-center'>Select Logo Image</label>
            <div {...getRootProps()} className='opacity-60 p-3 rounded-lg border-dashed border-2 border-gray-500 cursor-pointer' >
              <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-center">Drop your Logo here</p>
                ) : (
                  <p className="text-center">
                    Drag and drop logo here, or click to select logo image
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
            {/* DRAG N DROP LOGO PICTURE */}
            <label className='pb-1 pt-5 opacity-80'>Organization Name</label>
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

      <Drawer title="Modify" onClose={onCloseMultiDrawer} open={openMulti}>
        <div className='pop-medium'>
          <button onClick={showChildrenDrawer} className='border-2 py-1 px-2 rounded-md'>Connections</button>
          <div className="img-holder flex justify-center relative mb-7">
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
          {uploadProgress > 0 && (
            <span>
              <Progress percent={uploadProgress} size="small" />
            </span>
          )}
          <label className='pb-1 opacity-80 mt-8'>Organization Name</label>
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

            <div className="cnt flex items-center justify-center p-5">
              {!isUpdating 
                ? <button className='flex items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-7 rounded-full' onClick={updateOrganization}>
                    <p className='pop-medium'>Update</p>   
                  </button>
                : <button disabled={isUpdating} className='flex pop-medium items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-3 rounded-full'>
                    Updating...
                    <Spin className='pl-1'/> 
                  </button>
              }
            </div>
          </div>
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
                  Available Positions
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
          <div className="wrapp px-1 rounded-xl py-2 pop-regular mt-16 shadow-sm">
            <h3 className='py-3 pop-semibold text-center shadow-sm rounded-xl bg-gray-100 mb-3'>Current Positions</h3>
            {currentPositions?.length === 0
              ? <div className="no-current text-gray-600 flex justify-center items-center p-5 opacity-80 pop-medium">
                  <h4>No Position Assigned </h4>
                </div>
              : currentPositions?.map((current:any, index:any) => (
                <div key={index} className="item flex justify-between items-center py-2 px-3 odd:bg-gray-100 rounded-md hover:bg-blue-100">
                  <h3>{current.position}</h3>
                  <Tooltip title='Remove' color='#f87171'>
                    <button onClick={() => disConnectPosition(current.id, current.ballotId)} className='p-1'>
                      <IoMdRemoveCircle size={25} className='text-red-400'/>
                    </button>
                  </Tooltip>
                </div>
              ))
            }
          </div>
        </Drawer>
      </Drawer>
      
      {/* ALL ORGANIZATIONS */}
    </div>
  )
}




