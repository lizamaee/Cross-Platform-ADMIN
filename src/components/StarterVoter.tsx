import { Progress, Spin, message } from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import { useUploadVoterInfo, useUploadVoterPicture } from "../hooks/queries/useVoter";
import { useAuthStore } from "../hooks/state";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import blank from '../images/blank.jpg'

interface StarterProp {
    profile: string;
    firstname: string;
}

type InfoFormData = {
    firstname: string;
    surname: string;
    age: string;
    year_level: string;
}

export default function ({profile,firstname}:StarterProp) {
    const [voterPicture, setVoterPicture] = useState<string>('')
    const {student_id} = useAuthStore((state) => state)

    //PROGRESS BAR STATE
    const [uploadProgress, setUploadProgress] = useState(0);
    //REFERENCE OF IMAGE BUTTON
    const fileInputRef = useRef<HTMLInputElement>(null);

    //ONCLICK FUNCTION OF REFERENCED PROFILE BUTTON
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const {mutate:uploadVoterPicture, isLoading:isPictureUploading} = useUploadVoterPicture()
    
    //UPLOAD IMAGE
    const handleUploadImage = async (e:any) => {
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
          )
          setVoterPicture(response.data.secure_url);
          uploadVoterPicture({student_id: student_id, profile_picture: response.data.secure_url})

        } catch (error) {
          console.log('Error uploading image: ', error);
        }
    }

    //UPLOAD VOTER INFORMATION
    const infoSchema: ZodType<InfoFormData> = z.object({
        firstname: z.string().min(1, {message: "Please fill in your firstname"}),
        surname: z.string().min(1, {message: "Please fill in your surname"}),
        age: z.string().regex(/^\d{2}$/, {message: "Age must be valid"}).min(1),
        year_level: z.string().nonempty('Please select your year Level'),
    })
    const {register:infoRegister, handleSubmit:handleSubmitInfo, formState:{errors:errorInfo}, reset:infoReset} = useForm<InfoFormData>({resolver: zodResolver(infoSchema)})

    const {mutate:uploadVoterInfo, isLoading: isSaving} = useUploadVoterInfo()


    const handleUploadVoterInfo = (data: InfoFormData) => {
        if(profile === null){
            message.open({
                type: 'error',
                content: "Please select a profile",
                className: 'custom-class pop-medium',
                duration: 2.5,
            });
        }else{
            if(Number(data.age) <= 15){
                console.log("Age must be atleast 16 years old");
            }else{
                uploadVoterInfo({
                    student_id: student_id,
                    firstname: data.firstname,
                    surname: data.surname,
                    age: data.age,
                    year_level: data.year_level
                })
            }
            
        }
    }

    return (
    <div className="edit-info-first mt-5 p-5 bg-white dark:bg-[#313131] rounded-xl">
        <div className="edit-head">
            <h2 className='pop-medium text-xs sm:text-base dark:text-gray-200'>Please complete your Information below</h2>
        </div>
        {/* PROFILE PICTURE UPLOAD */}
        <div className="profile-container ">
            <div className="img-holder flex flex-col items-center md:flex-row  mt-5 gap-3 md:gap-10">
                <div className="img flex flex-col justify-center items-center">
                    <img 
                        src={profile ?? blank} alt={`${firstname ?? "John Doe"} Image`} 
                        className='object-cover rounded-full border-[6px] shadow-md border-white dark:border-zinc-700 w-36 h-36'
                        />
                    <span className="w-full">
                        {/* PROGRESS BAR UI */}
                            {uploadProgress > 0 && (
                            <span>
                                <Progress percent={uploadProgress} size="small"/>
                            </span>
                            )}
                        {/* PROGRESS BAR UI */}

                    </span>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleUploadImage}
                    />
                <div className="choose-btn flex flex-col gap-5 justify-center">
                    {isPictureUploading
                        ? <button
                        className="bg-[393c72] shadow-lg text-xs sm:text-sm dark:bg-[#33366d] text-white pop-medium focus:outline-none border-[1px] border-[#202142] rounded-lg flex py-2 sm:py-3 px-3">Uploading...</button>
                        : <button
                        onClick={handleButtonClick}
                        className="bg-[#393c72] shadow-lg text-xs sm:text-sm dark:bg-[#33366d] text-white pop-medium focus:outline-none border-[1px] border-[#202142] rounded-lg flex py-2 sm:py-3 px-3">Choose picture</button>
                    }
                </div>
            </div>
        </div>
        {/* PROFILE PICTURE UPLOAD */}

        {/* VOTER INFORMATION FORM */}
        <form onSubmit={handleSubmitInfo(handleUploadVoterInfo)}>
            <div className="grid md:grid-cols-2 md:gap-32 pop-regular ">
                <div className="firstname">
                    <label className='pb-1 opacity-80 mt-3 block text-sm dark:text-gray-300'>Firstname</label>
                    <input {...infoRegister("firstname")} type="text" className='bg-transparent py-3 px-4 outline-none rounded-md border-solid border-2 dark:text-gray-100 tracking-wide dark:border-zinc-700 focus:border-indigo-400  opacity-90 w-full' />
                    {errorInfo.firstname && <span className="text-red-400 pt-2 block text-center text-xs sm:text-sm">{errorInfo.firstname.message}</span>}
                </div>
                <div className="surname">
                    <label className='pb-1 opacity-80 mt-3 block text-sm dark:text-gray-300'>Surname</label>
                    <input {...infoRegister("surname")} type="text" className='bg-transparent py-3 px-4 outline-none rounded-md border-solid border-2 dark:text-gray-100 tracking-wide dark:border-zinc-700 focus:border-indigo-400  opacity-90 w-full' />
                    {errorInfo.surname && <span className="text-red-400 pt-2 block text-center text-xs sm:text-sm">{errorInfo.surname.message}</span>}
                </div>
            </div>
            <div className="grid sm:grid-cols-2 md:gap-32 pop-regular ">
                <div className="age w-full">
                    <label className='pb-1 opacity-80 mt-3 block text-sm dark:text-gray-300'>Age</label>
                    <input {...infoRegister("age")} maxLength={2} minLength={1} type="text" className='bg-transparent py-3 px-4 outline-none rounded-md border-solid border-2 dark:text-gray-100 tracking-wide dark:border-zinc-700 focus:border-indigo-400  opacity-90 w-16 text-center' />
                    {errorInfo.age 
                    ? <span className="text-red-400 block text-center text-xs sm:text-sm pt-2">{errorInfo.age.message}</span> 
                    : <div className="empty"></div>
                }
                </div>
                
                <div className="year_level pop-regular w-full">
                    <label className='pb-1 opacity-80 mt-3 block text-sm dark:text-gray-300'>Year Level</label>
                    <select {...infoRegister('year_level')} className="w-5/6 sm:w-full bg-transparent dark:text-gray-100 rounded-lg focus:border-indigo-400 outline-none dark:border-zinc-700 border-2 py-3 px-4 ">
                        <option className="bg-transparent rounded dark:bg-[#313131] dark:text-gray-300" value="">Select year level</option>
                        <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="1st Year">1st Year</option>
                        <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="2nd Year">2nd Year</option>
                        <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="3rd Year">3rd Year</option>
                        <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="4th Year">4th Year</option>
                    </select>
                    {errorInfo.year_level 
                    ? <span className="text-red-400 text-center block text-xs sm:text-sm pt-2">{errorInfo.year_level.message}</span> 
                    : <div className="empty"></div>
                }
                </div>
                
            </div>
            {/* SAVE BUTTON */}
            <div className="save-btn flex justify-end py-5">
                {!isSaving 
                ? <button type="submit" className='flex items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg hover:text-white py-2 px-5'>
                    <p className='pop-medium'>Save</p>   
                </button>
                : <button disabled={isSaving} className='flex pop-medium items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg py-2 px-3'>
                    Saving...
                    <Spin className='pl-1'/> 
                </button>
                }
            </div>
            {/* SAVE BUTTON */}
        </form>
        {/* VOTER INFORMATION FORM */}
    </div>
    
    )
}
