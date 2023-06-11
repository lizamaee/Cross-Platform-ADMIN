import { useAuthStore } from "../../../hooks/state";
import { useUpdateImage, useUpdateProfile, useUsers } from "../../../hooks/queries/useAdmin";
import { useEffect, useRef, useState } from "react";
import { Checkbox, Progress, Spin } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType, z } from "zod";
import axios from "axios";
import { CheckboxChangeEvent } from "antd/es/checkbox";

type ProfileFormData = {
    student_id: string;
    fullname: string;
}

type PasswordFormData = {
    new_password: string;
    current_password: string;
}

export default function AccountTab() {
    const {student_id} = useAuthStore((state) => state)
    const [fullname, setFullname] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [profile, setProfile] = useState<string>('')
    const [number, setNumber] = useState<string>('')
    const [isPassOpen, setIsPassOpen] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    //PROGRESS BAR STATE
    const [uploadProgress, setUploadProgress] = useState(0);


    //REFERENCE OF IMAGE BUTTON
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    //USER HOOKS
    //GET ALL
    const usersQuery = useUsers()

    //FILTER THE USER
    const adminInfo = usersQuery?.data?.filter((admin:any) => admin.student_id === student_id)

    //console.log(adminInfo);
    

    // Update the fullname state when adminInfo changes
    useEffect(() => {
        if (adminInfo && adminInfo.length > 0) {
            setFullname(adminInfo[0].fullname);
            setId(adminInfo[0].student_id);
            setProfile(adminInfo[0].profile_picture)
            setNumber(adminInfo[0].mobile_number)
        }
    }, []);

    //ONCLICK FUNCTION OF REFERENCED IMAGE BUTTON
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    //UPDATE IMAGE HOOK
    const {mutate: updateProfileImage, isLoading:isImageUpdating} = useUpdateImage()

    //UPDATE IMAGE
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
          setProfile(response.data.secure_url);
          updateProfileImage({student_id: adminInfo[0]?.student_id, profile_picture: response.data.secure_url})

        } catch (error) {
          console.log('Error uploading image: ', error);
        }
      }

    const profileSchema: ZodType<ProfileFormData> = z.object({
        student_id: z.string().regex(/^\d{7}$/, {message: "Student ID must be a valid Student ID"}).min(7).max(7),
        fullname: z.string().min(1, {message: "Fullname must be a valid Fullname"})
    })
    const {register:profileRegister, handleSubmit:handleSubmitProfile, formState:{errors:errorProfile}, reset:profileReset} = useForm<ProfileFormData>({resolver: zodResolver(profileSchema)})


    //UPDATE PROFILE HOOKS
    const {mutate:updateProfile, isLoading: isSaving} = useUpdateProfile()
    const handleSave = (data:ProfileFormData) => {
        updateProfile({student_id: adminInfo[0]?.student_id, fullname: data.fullname, new_student_id: data.student_id })
    }

    //CHANGE PASSWORD SCHEMA
    const passwordSchema: ZodType<PasswordFormData> = z.object({
        new_password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*])/,{
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character",
            }).min(14, {message: "Password must contain at least 14 character(s)"}).max(30),
        current_password: z.string().min(1, {message: "Please enter current password"})
    })
    const {register:passwordRegister, handleSubmit:handleSubmitPassword, formState:{errors:errorPassword}, reset:passwordReset} = useForm<PasswordFormData>({resolver: zodResolver(passwordSchema)})

    //CHECKBOX EVENT LISTENER
    const onChecked = (e: CheckboxChangeEvent) => {
        e.target.checked ? setShowPassword(true) : setShowPassword(false)
    };

    const handleChange = () => {}

    //SAVE PASSWORD FUNCTION
    const handleSavePassword = () => {}

  return (
    <div className="pop-semibold py-3 dark:text-gray-300">
        <h2 className="pop-bold text-xl dark:text-gray-300">Profile</h2>
        <div className="profile-container ">
            <div className="img-holder flex my-5 gap-10">
                <div className="img flex flex-col justify-center items-center">
                    <img 
                        src={profile ?? "https://shorturl.at/tJU24"} alt={`${fullname} Image`} 
                        className='object-cover rounded-full border-[10px] shadow-md border-white dark:border-zinc-700 w-36 h-36'
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
                    onChange={handleUpdateImage}
                />
                <div className="choose-btn flex flex-col gap-5 justify-center">
                    {isImageUpdating
                        ? <button
                        className="bg-[#202142] dark:bg-[#33366d] text-white pop-medium focus:outline-none border-[1px] border-[#202142] rounded-lg flex py-3 px-5">Uploading...</button>
                        : <button
                        onClick={handleButtonClick}
                        className="bg-[#202142] dark:bg-[#33366d] text-white pop-medium focus:outline-none border-[1px] border-[#202142] rounded-lg flex py-3 px-5">Change picture</button>
                    }
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmitProfile(handleSave)}>
            <div className="flex gap-5">
                <div className="">
                    <label className='pb-1 opacity-80 mt-8 block text-sm pop-regular'>Fullname</label>
                    <input {...profileRegister("fullname")} defaultValue={fullname ?? "John Doe"} onChange={(e) => setFullname(e.target.value)} type="text" className='bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-[1px] dark:border-zinc-700 opacity-90 w-full' />
                    {errorProfile.fullname && <span className="text-red-400 text-center text-sm">{errorProfile.fullname.message}</span>}
                </div>

                <div className="">
                    <label className='pb-1 opacity-80 mt-8 block text-sm pop-regular'>Student ID</label>
                    <input {...profileRegister("student_id")} defaultValue={id ?? "1234567"} onChange={(e) => setId(e.target.value)} type="text" minLength={7} maxLength={7} required className='bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-[1px] dark:border-zinc-700 opacity-90 w-full' />
                    {errorProfile.student_id && <span className="text-red-400 text-center text-sm">{errorProfile.student_id.message}</span>}
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
                </div>
            </div>
        </form>

        {/* SECURITY */}
        <div className="security py-4 ">
            <h2 className="text-xl py-5 pop-bold">Security</h2>

            <p className="text-sm opacity-75 pop-light">Mobile Number</p>
            <div className="number flex justify-between pb-3">
                <h4 className="">{number}</h4>
                <button className="pop-regular text-sm underline text-blue-500">Change</button>
            </div>

            <div className="password py-5 flex justify-between">
                <h4 className="">Password</h4>
                {!isPassOpen
                    ? <button onClick={() => setIsPassOpen(!isPassOpen)} className="pop-regular text-sm underline text-blue-500">Show</button>
                    : <button onClick={() => setIsPassOpen(!isPassOpen)} className="pop-regular text-sm underline text-blue-500">Hide</button>
                }
            </div>

            {isPassOpen 
                ? <form onSubmit={handleSubmitPassword(handleChange)}>
                    <div className="flex gap-5">
                        <div className="">
                            <label className='pb-1 opacity-80 mt-8 block text-sm pop-regular'>New password</label>
                            <input {...passwordRegister("new_password")} type={showPassword ? "text" : "password"} placeholder="••••••••" required className='bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-[1px] dark:border-zinc-700 opacity-90 w-full' />
                            {errorPassword.new_password && <span className="text-red-400 text-center text-sm">{errorPassword.new_password.message}</span>}
                        </div>
        
                        <div className="">
                            <label className='pb-1 opacity-80 mt-8 block text-sm pop-regular'>Current password</label>
                            <input {...passwordRegister("current_password")} type={showPassword ? "text" : "password"} placeholder="••••••••" required className='bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-[1px] dark:border-zinc-700 opacity-90 w-full' />
                            {errorPassword.current_password && <span className="text-red-400 text-center text-sm">{errorPassword.current_password.message}</span>}
                        </div>
                    </div>
                    <div className="showpass py-3 flex gap-2 text-sm pop-regular">
                        <Checkbox className="dark:text-gray-300 pop-regular" onChange={onChecked}>Show password</Checkbox>
                    </div>
                    <div className="resetpasss flex text-sm pop-regular pt-6 pb-4 gap-2">
                        <p>Can't remember your current password?</p>
                        <span className="text-blue-500 underline cursor-pointer">Reset your password</span>
                    </div>
                    <div className="button">
                        <button
                        onClick={handleSavePassword}
                        className="bg-[#202142] dark:bg-[#33366d] text-white pop-medium focus:outline-none border-[1px] border-[#202142] rounded-lg flex py-3 px-5">Save password</button>
                    </div>
                  </form>
                : ""}
        </div>
        {/* SECURITY */}

        {/* DELETE ACCOUNT */}
        <div className="delete pop-regular">
            <h2 className="text-xl py-5 pop-bold">Delete account</h2>

            <div className="warning text-sm w-4/5">
                <p>Would you like to delete your account?</p>
                <p>This account contains sensitive informations. Deleting your account will remove all the content associated with it.</p>

                <button className="underline text-red-400 mt-5">I want to delete my account</button>
            </div>
        </div>
        {/* DELETE ACCOUNT */}

        
    </div>
  )
}
