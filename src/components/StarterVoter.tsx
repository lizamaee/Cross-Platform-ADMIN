import { Progress, Spin, message } from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import { useUploadVoterInfo, useUploadVoterPicture } from "../hooks/queries/useVoter";
import { useAuthStore } from "../hooks/state";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface StarterProp {
    profile: string;
    fullname: string;
}

type InfoFormData = {
    fullname: string;
}

export default function ({profile,fullname}:StarterProp) {
    const [voterPicture, setVoterPicture] = useState<string>('')
    const [voterFullname, setVoterFullname] = useState<string>('')
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
          setVoterPicture(response.data.secure_url);
          uploadVoterPicture({student_id: student_id, profile_picture: response.data.secure_url})

        } catch (error) {
          console.log('Error uploading image: ', error);
        }
    }

    //UPLOAD VOTER INFORMATION
    const infoSchema: ZodType<InfoFormData> = z.object({
        fullname: z.string().min(1, {message: "Please fill in your fullname"})
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
            uploadVoterInfo({student_id:student_id, fullname: data.fullname})
        }
    }

    return (
    <div className="edit-info-first mt-5 p-5 bg-white dark:bg-[#313131] rounded-xl">
        <div className="edit-head">
            <h2 className='pop-medium dark:text-gray-300'>Please complete your Information below</h2>
        </div>
        {/* PROFILE PICTURE UPLOAD */}
        <div className="profile-container ">
            <div className="img-holder flex flex-col items-center md:flex-row  my-5 gap-3 md:gap-10">
                <div className="img flex flex-col justify-center items-center">
                    <img 
                        src={profile ?? "https://shorturl.at/tJU24"} alt={`${fullname} Image`} 
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
                        className="bg-[#202142] dark:bg-[#33366d] text-white pop-medium focus:outline-none border-[1px] border-[#202142] rounded-lg flex py-3 px-5">Uploading...</button>
                        : <button
                        onClick={handleButtonClick}
                        className="bg-[#202142] dark:bg-[#33366d] text-white pop-medium focus:outline-none border-[1px] border-[#202142] rounded-lg flex py-3 px-5">Choose picture</button>
                    }
                </div>
            </div>
        </div>
        {/* PROFILE PICTURE UPLOAD */}

        {/* VOTER INFORMATION FORM */}
        <form onSubmit={handleSubmitInfo(handleUploadVoterInfo)}>
            <div className="grid md:grid-cols-2 pop-regular ">
                <div className="fullname">
                    <label className='pb-1 opacity-80 mt-8 block text-sm dark:text-gray-300'>Fullname</label>
                    <input {...infoRegister("fullname")} type="text" className='bg-transparent py-4 px-4 outline-none rounded-md border-solid border-2 dark:text-gray-100 tracking-wide dark:border-zinc-700 focus:border-indigo-400  opacity-90 w-full' />
                    {errorInfo.fullname && <span className="text-red-400 text-center text-sm">{errorInfo.fullname.message}</span>}
                </div>
            </div>
            {/* SAVE BUTTON */}
            <div className="save-btn flex justify-end py-5">
                {!isSaving 
                ? <button type="submit" className='flex items-center border-2 border-[#1677ff] text-[#1677ff] hover:bg-[#1677ff] hover:text-white py-2 px-7 rounded-full'>
                    <p className='pop-medium'>Save</p>   
                </button>
                : <button disabled={isSaving} className='flex pop-medium items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-3 rounded-full'>
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
