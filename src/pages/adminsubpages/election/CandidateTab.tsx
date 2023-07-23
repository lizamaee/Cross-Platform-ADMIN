import { useEffect, useRef, useState } from 'react';
import {BsPlus} from 'react-icons/bs'
import { RiDeleteBin5Fill, RiEditBoxFill } from 'react-icons/ri';
import {FaCamera} from 'react-icons/fa' 
import { Drawer, Modal, Progress, Spin, Tag, Tooltip, message } from 'antd';
import "react-datepicker/dist/react-datepicker.css";
import { useDropzone } from 'react-dropzone';
import React from 'react';
import axios from 'axios';
import { useCandidates, useCreateCandidate, useDeleteCandidate, useUpdateCandidate } from '../../../hooks/queries/useCandidate';
import DeleteMe from '../../../components/DeleteMe';
import { TiWarning } from 'react-icons/ti';

interface DataType {
  seatId: null;
  id: string;
  fullname: string;
  platform: string;
  party: string;
  imageUrl:string; 
}

export default function CandidateTab() {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [fullname, setFullName] = useState<string>('')
  const [platform, setPlatform] = useState<string>('')
  const [party, setParty] = useState<string>('')
  const [image, setImage] = useState([])
  const [openMulti, setOpenMulti] = useState(false);

  //CANDIDATES HOOKS
  //GET ALL
  const candidatesQuery = useCandidates()
  //CREATE SINGLE
  const { mutate: createCandidate} = useCreateCandidate()
  //DELETE SINGLE
  const { mutate: deleteCandidate, isLoading: isDeletingCandidate} = useDeleteCandidate()

  //SORT CANDIDATE ARRAY IN DESCENDING ORDER
  const descendingCandidates = candidatesQuery?.data?.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  //CALL BACK TO FIRE WHEN FILE IS DRAGGED INSIDE DROPZONE
  const onDrop = React.useCallback((acceptedFiles: any) => {
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

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingCandidateName, setDeletingCandidateName] = useState<string>('')
  const [deletingCandidateID, setDeletingCandidateID] = useState<string>('')
   
  //ASYNCRONOUS DELETE CANDIDATE FUNCTION
  async function handleDeleteCandidate() {
    deleteCandidate(deletingCandidateID,
      {
        onSettled: () => setOpenDeleteModal(false)
      })
  }

  //DELETE CANDIDATE CONFIRMATION MODAL
  const deleteIt = (id: string, name: string) => {
    setDeletingCandidateName(name)
    setDeletingCandidateID(id)
    setOpenDeleteModal(true)
  }

  //AVOID MEMORY LEAK DURING IMAGE UPLOAD @ DROPZONE
  useEffect(()=> {
    return () => image.forEach((file:any) => URL.revokeObjectURL(file.preview));
  }, [])

  //OPEN CREATE DRAWER STATE
  const [open, setOpen] = useState(false)
  //OPEN CREATE DRAWER FUNCTION
  const showDrawer = () => {
    setOpen(true)
  }
  
  //CLOSE CREATE DRAWER FUNCTION
  const onClose = () => {
    setImage([])
    setFullName('')
    setParty('')
    setPlatform('')
    setOpen(false)
  }

  //CREATE CANDIDATE FUNCTION
  const handleUpload = async (imageUrl: string) => {
    const uploadCanData = {
      fullname,
      platform,
      party,
      imageUrl,
    }
    createCandidate(uploadCanData,
      {
        onSettled: () => {
          setImage([])
          setFullName('')
          setParty('')
          setPlatform('')
          setIsCreating(false)
        }
      })
  }

  //UPLOAD SELECTED IMAGE TO CLOUDINARY
  const handleCreate = async (e:any) => {
    e.preventDefault()
    setIsCreating(true)
    if(platform === null || party === null || fullname === '') {
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
      handleUpload(data.url)
    })
    .catch(error => console.error(error))
  }

  //DRAWER STATES
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [modifyId, setModifyId] = useState<string>('')
  const [modifyFullName, setModifyFullName] = useState<string>('')
  const [modifyUrl, setModifyUrl] = useState<string>('')
  const [modifyPlatform, setModifyPlatform] = useState<string>('')
  const [modifyParty, setModifyParty] = useState<string>('')

  //REFERENCE OF CHANGE IMAGE BUTTON
  const fileInputRef = useRef<HTMLInputElement>(null);

  //PROGRESS BAR STATE
  const [uploadProgress, setUploadProgress] = useState(0);
  
  //OPEN MODIFY MULTI-PARENT DRAWER FUNCTION
  const openMultiDrawer = (id: string) => {
    setOpenMulti(true)
    const single = candidatesQuery.data?.filter((org: DataType)=> org.id === id)

    setModifyId(single[0].id)
    setModifyFullName(single[0].fullname)
    setModifyUrl(single[0].imageUrl)
    setModifyPlatform(single[0].platform)
    setModifyParty(single[0].party)
  }
  
  //CLOSE MODIFY MULTI-PARENT DRAWER FUNCTION
  const onCloseMultiDrawer = () => {
    setOpenMulti(false)
  }
  
  //ONCLICK FUNCTION OF REFERENCED CHANGE IMAGE BUTTON
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

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
    } catch (error) {
      console.log('Error uploading image: ', error);
    }
  }

  //MUTATION HOOK OF UPDATE CANDIDATE 
  const {mutate: updateCandidate} = useUpdateCandidate()
  //UPDATE AN CANDIDATE FUNCTION
  const handleUpdateCandidate = async (e:any) => {
    e.preventDefault()
    setIsUpdating(true)
    
    if(modifyParty === '' || modifyPlatform === '' || modifyFullName === '' || modifyUrl === '') {
      setIsUpdating(false)
      return message.open({
        type: 'error',
        content: 'Please fill the fields',
        className: 'custom-class pop-medium',
        duration: 2.5,
      });
    }
    
    const updateCanData = {
      id: modifyId,
      fullname: modifyFullName,
      platform: modifyPlatform,
      party: modifyParty,
      imageUrl: modifyUrl
    }

    updateCandidate(updateCanData)
    setIsCreating(false)
    onCloseMultiDrawer()
    setIsUpdating(false)
    setModifyId('')
    setModifyFullName('')
    setModifyUrl('')
    setModifyPlatform('')
    setModifyParty('')
    setUploadProgress(0)
  }

  const [modal2Open, setModal2Open] = useState(false);
  const [selectedFullName, setSelectedFullName] = useState<string>('')
  const [selectedUrl, setSelectedUrl] = useState<string>('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [selectedParty, setSelectedParty] = useState<string>('')

  const handleSeeMore = (id: string) => {
    setModal2Open(true)
    const selectedCandidate = candidatesQuery.data?.filter((org: DataType)=> org.id === id)

    setSelectedFullName(selectedCandidate[0].fullname)
    setSelectedUrl(selectedCandidate[0].imageUrl)
    setSelectedPlatform(selectedCandidate[0].platform)
    setSelectedParty(selectedCandidate[0].party)
  }

  return (
    <div className=' bg-white overflow-hidden dark:bg-[#303030] rounded-b-lg shadow-md'>
      {/* CREATE BUTTON */}
      <div className="top flex justify-between items-center pt-10  mx-5">
        <h3 className='text-lg pop-semibold text-gray-950 dark:text-gray-100'>Candidates</h3>
        <button onClick={showDrawer} className='flex justify-center items-center py-1 md:py-2 sm:pr-3 px-1 text-white pop-medium bg-[#a75de1] hover:text-[#a75de1] border-2 border-[#a75de1] hover:bg-transparent focus:outline-none rounded-2xl'>
          <BsPlus size={25} className='' />
          <h3 className='text-sm md:text-md hidden sm:inline'>CREATE</h3>
        </button>
      </div>
      {/* CREATE BUTTON */}

      <Modal
        title="Candidate"
        open={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={[]}
      >
        <div className="party pop-medium capitalize flex justify-end text-sm text-purple-500">
          <Tag bordered={false} color="purple">
          {selectedParty}
          </Tag>
        </div>
        <div className="img-profile shrink-0 flex justify-center">
          <img className='h-32 w-32 object-cover rounded-full drop-shadow-lg' src={selectedUrl} alt={selectedFullName + selectedParty} />
        </div>
        <h2 className='pop-semibold capitalize text-center py-2 text-gray-900'>{selectedFullName}</h2>
        <h5 className='py-3 px-2 pop-semibold text-xs'>Platform</h5>
        <div className="candidate-platform px-2 max-h-56 overflow-y-auto centered">
          <p className='text-justify indent-7'>{selectedPlatform}</p>
        </div>
      </Modal>

      {/* ALL CANDIDATES */}
      <div className="container w-full mx-auto p-4 overflow-x-auto">
        {candidatesQuery.status === 'error' || candidatesQuery.data?.[0]?.error === 'Network Error'
            ? <h4 className='text-red-400 pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>Sorry, Something went wrong.</h4>
            : descendingCandidates?.length === 0 
                ? <h4 className='text-gray-400 opacity-90 border-2 rounded-lg pop-medium py-4 text-center text-xs md:text-sm tracking-wide flex-1'>No Candidates</h4>
                : <div className="grid items-center md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {descendingCandidates?.map((can:DataType, index: any) =>(
                  <div key={index} className="card overflow-hidden p-3 hover:-translate-y-2 hover:z-0 ease-in-out duration-300  shadow-md bg-gray-100 rounded-2xl dark:bg-[#2a2a2a]">
                    <div className="upper grid grid-cols-2">
                      {/* IMAGE DISPLAY */}
                      <div className="img-container shrink-0 flex items-center justify-center py-1">
                        <img className={`h-16 w-16 object-cover rounded-full border-4  ${can.seatId !== null ? 'border-emerald-400 dark:border-emerald-500' : 'border-gray-300 dark:border-zinc-700'}`} src={can.imageUrl} alt="" />
                      </div>
                      {/* IMAGE DISPLAY */}
                      <h3 className='self-center pop-semibold text-[#303030] dark:text-gray-200 text-center pt-3 pb-1'>{can.fullname}</h3>
                    </div>

                    <div className="lower grid grid-cols-2 items-center pt-3">
                    <div className="btn-more px-1 flex justify-center">
                      <Tooltip title='See More' color='#4b5563'>
                        <button onClick={() => handleSeeMore(can.id)} className='pop-semibold text-sm p-1 border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white rounded-lg'>More Details</button>
                      </Tooltip>   
                    </div>
                      {/* ACTIONS DISPLAY */}
                      <div className="actions flex gap-1 justify-between px-2">
                        <Tooltip title='Delete' color='#f87171'>
                          <button
                            onClick={(e) => deleteIt(can.id, can.fullname)}
                            className={`pop-medium text-center align-middle p-2 rounded-lg text-white bg-red-500  focus:outline-none`}
                          >
                            <RiDeleteBin5Fill />
                          </button>
                        </Tooltip>
        
                        <Tooltip title='Modify' color='#60a5fa'>
                          <button
                            onClick={()=> {
                              openMultiDrawer(can.id)
                            }}
                            className={`pop-medium text-center align-middle p-2 rounded-lg text-white bg-blue-500  focus:outline-none`}
                            >
                            <RiEditBoxFill />
                          </button>
                        </Tooltip>
                      </div>
                      {/* ACTIONS DISPLAY */}
                    </div>
                    
                  </div>
                ))}
            </div>
            }
      </div>
      
      {/* CREATE CANDIDATE DRAWER */}
      <Drawer title="Create Candidate" placement="right" onClose={onClose} open={open}>
        <form className="create-candidate-container py-3">
          <div className="name flex flex-col pop-medium">
            {/* DRAG N DROP LOGO PICTURE */}
            <label className='opacity-80 py-2 text-center'>Select Profile Picture</label>
            <div {...getRootProps()} className='opacity-60 p-3 rounded-lg border-dashed border-2 border-gray-500 cursor-pointer' >
              <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-center">Drop Profile Picture here</p>
                ) : (
                  <p className="text-center">
                    Drag and drop profile here, or click to select profile picture
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
            <label className='pb-1 pt-5 opacity-80'>Candidate Fullame</label>
            <input value={fullname} onChange={(e) => setFullName(e.target.value)} type="text" className='py-1 px-3 text-lg focus:outline-indigo-400 rounded-md border-solid border-2' />
            <label className='pb-1 pt-2 opacity-80'>Party</label>
            <input value={party} onChange={(e) => setParty(e.target.value)} type="text" className='py-1 px-3 text-lg focus:outline-indigo-400 rounded-md border-solid border-2' />
            <label className='pb-1 pt-2 opacity-80'>Platform</label>
            <textarea className='p-3 resize-none focus:outline-indigo-400 rounded-md border-solid border-2' value={platform} onChange={(e) => setPlatform(e.target.value)} name="platform" placeholder='Enter your platform...' cols={20} rows={10}/>
            
          </div>
        </form>
        {/* CREATE BUTTON */}
        {image.length > 0 && (
          <div className="btn-container flex items-center justify-center pt-3">
            {!isCreating 
              ? <button className='flex items-center text-gray-100 bg-[#a75de1] hover:bg-[#a75de1] rounded-lg py-2 px-5 sm:px-7' onClick={handleCreate}>
                  <p className='pop-medium'>Create</p>   
                </button>
              : <button className='flex pop-medium items-centertext-gray-100 bg-[#a75de1] hover:bg-[#a75de1] rounded-lg py-2 px-5 sm:px-7'>
                  Creating...
                  <Spin className='pl-1'/> 
                </button>
            }
          </div>
        )}
        {/* CREATE BUTTON */}
      </Drawer>
      {/* CREATE CANDIDATE DRAWER */}

      {/* UPDATE CANDIDATE MULTI-PARENT DRAWER */}
      <Drawer title="Modify" onClose={onCloseMultiDrawer} open={openMulti}>
        <div className='pop-medium flex flex-col'>
          <div className="img-holder flex justify-center relative my-5">
            <img 
              src={modifyUrl} alt={`${modifyFullName} Image`} 
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
          <label className='pb-1 opacity-80 mt-8'>Candidate Fullname</label>
          <input value={modifyFullName} onChange={(e) => setModifyFullName(e.target.value)} type="text" className='py-1 px-3 text-lg focus:outline-indigo-400 rounded-md border-solid border-2 w-full' />
          <label className='pb-1 opacity-80 pt-2'>Party</label>
          <input value={modifyParty} onChange={(e) => setModifyParty(e.target.value)} type="text" className='py-1 px-3 text-lg focus:outline-indigo-400 rounded-md border-solid border-2 w-full' />
          <label className='pb-1 opacity-80 pt-2'>Platform</label>
          <textarea className='p-3 resize-none focus:outline-indigo-400 rounded-md border-solid border-2' value={modifyPlatform} onChange={(e) => setModifyPlatform(e.target.value)} name="platform" placeholder='Enter your platform...' cols={20} rows={10}/>

          {/* UPDATE BUTTON */}
            <div className="cnt flex items-center justify-center p-5">
              {!isUpdating 
                ? <button className='flex items-center  text-gray-100 bg-blue-800 hover:bg-blue-700 rounded-lg py-2 px-5 sm:px-7' onClick={handleUpdateCandidate}>
                    <p className='pop-medium'>Update</p>   
                  </button>
                : <button disabled={isUpdating} className='flex pop-medium items-center  text-gray-100 bg-blue-800 hover:bg-blue-700 rounded-lg py-2 px-5 sm:px-7'>
                    Updating...
                    <Spin className='pl-1'/> 
                  </button>
              }
            </div>
          {/* UPDATE BUTTON */}
          </div>
      </Drawer>
      {/* UPDATE CANDIDATE MULTI-PARENT DRAWER */}

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
                    Delete Candidate
                  </h2>
                </div>
                <div className="warn-text tracking-wider text-xs md:text-sm">
                  <p className="pop-regular text-[#334049] dark:text-gray-300 text-center">
                    Do you want to delete <span className='pop-bold'>{deletingCandidateName}</span>
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
                {isDeletingCandidate ? (
                  <button
                    disabled={isDeletingCandidate}
                    className="bg-[#ff3f56] text-white px-6 py-2 rounded-full"
                  >
                    Deleting...
                  </button>
                ) : (
                  <button
                    disabled={isDeletingCandidate}
                    onClick={handleDeleteCandidate}
                    className="bg-[#ff3f56] text-white px-6 py-2 rounded-full"
                  >
                    Yes, Delete!
                  </button>
                )}
              </div>
            </div>
      </DeleteMe>
      {/* DELETE MODAL */}
      
    {/* ALL CANDIDATE */}
    </div>
  )
}




