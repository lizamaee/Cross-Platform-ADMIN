import { useAuthStore } from "../../../hooks/state";
import { useAdminConfirmOTP, useAdminSendOTP, useChangePin, useUpdateImage, useUpdateProfile, useUsers } from "../../../hooks/queries/useAdmin";
import { useEffect, useRef, useState } from "react";
import { Checkbox, Drawer, Progress, Spin, message } from "antd";
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

type MobileFormData = {
    new_mobile_number: string;
}

type OtpFormData = {
    new_otp_code: string;
}

type PinFormData = {
    new_pin_code: string;
}

export default function AccountTab() {
    const {student_id} = useAuthStore((state) => state)
    const [fullname, setFullname] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [profile, setProfile] = useState<string>('')
    const [number, setNumber] = useState<string>('')
    const [pinCode, setPinCode] = useState<string>('')
    const [isPassOpen, setIsPassOpen] = useState<boolean>(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
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
            setPinCode(adminInfo[0].pin_number)
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

    const handleChangePassword = () => {}

    //SAVE PASSWORD FUNCTION
    const handleSavePassword = () => {}

    //CHANGE MOBILE NUMBER
    const [openChangeNumber, setOpenChangeNumber] = useState<boolean>(false)
    const [changeNumber, setChangeNumber] = useState<string>('')

    //OPEN DRAWER FUNCTION
    const showNumberDrawer = () => {
        setOpenChangeNumber(true)
    }
  
    //CLOSE DRAWER FUNCTION
    const closeNumberDrawer = () => {
        setOpenChangeNumber(false)
        mobileReset()
        otpReset()
    }

    //CHANGE MOBILE SCHEMA (SEND OTP)
    const mobileSchema: ZodType<MobileFormData> = z.object({
        new_mobile_number: z.string().regex(/^09\d{9}$/, {message: "Mobile number must be a valid PH Mobile Number",
        }).min(11).max(11)
    })
    const {register:mobileRegister, handleSubmit:handleSubmitMobile, formState:{errors:errorMobile}, reset:mobileReset} = useForm<MobileFormData>({resolver: zodResolver(mobileSchema)})

    //CHANGE NUMBER HOOK
    //SEND OTP
    const {mutate:changeMobileNumber, isLoading:isSendingOtp, status: mobileStatus} = useAdminSendOTP()

    const handleSendOtp = (data:MobileFormData) => {
        if(number === data.new_mobile_number){
            message.open({
                type: 'error',
                content: "Mobile number cannot be same as old Number",
                className: 'custom-class pop-medium',
                duration: 2.5,
            });
        }else{
            const philFormat = data.new_mobile_number.slice(1)
            changeMobileNumber({student_id: id, new_mobile_number: `+63${philFormat}`})
            setChangeNumber(`+63${philFormat}`)
        }
    }

    //CHANGE MOBILE SCHEMA (CONFIRM OTP)
    const otpSchema: ZodType<OtpFormData> = z.object({
        new_otp_code:  z.string().regex(/^\d{6}$/, {message: "OTP code must be 6 digit number"}).min(6).max(6),
    })
    const {register:otpRegister, handleSubmit:handleSubmitOtp, formState:{errors:errorOtp}, reset:otpReset} = useForm<OtpFormData>({resolver: zodResolver(otpSchema)})

    //CHANGE NUMBER HOOK
    //CONFIRM OTP
    const {mutate:confirmMobileNumber, isLoading:isConfirmingOtp, status:otpStatus} = useAdminConfirmOTP()
    const handleConfirmOtp = (data: OtpFormData) => {
        confirmMobileNumber({student_id: id, new_mobile_number: changeNumber, new_otp_code: data.new_otp_code})
        
        if(otpStatus === 'success'){
            setNumber(changeNumber)
        }
    }

    //CHANGE PIN
    //CHANGE MOBILE NUMBER
    const [openChangePin, setOpenChangePin] = useState<boolean>(false)
    const [currentPin, setCurrentPin] = useState<string>('')

    //OPEN DRAWER FUNCTION PIN
    const showPinDrawer = () => {
        setOpenChangePin(true)
    }
  
    //CLOSE DRAWER FUNCTION PIN
    const closePinDrawer = () => {
        pinReset()
        setCurrentPin('')
        setOpenChangePin(false)
    }

    //PIN SCHEMA  
    const pinSchema: ZodType<PinFormData> = z
    .object({
      new_pin_code: z
        .string()
        .regex(/^\d{4}$/, { message: "New PIN code must be 4 digit number" })
        .min(4)
        .max(4)
    })

    const {
        register:pinRegister,
        handleSubmit:handleSubmitPin,
        reset: pinReset,
        formState: { errors:errorPin },
    } = useForm<PinFormData>({ resolver: zodResolver(pinSchema) })

    //CHANGE PIN HOOOK
    const {mutate:changePin, isLoading:isPinChanging, status: pinStatus} = useChangePin()

    const handlePin = (data: PinFormData) => {
        if(currentPin !== pinCode){
            message.open({
                type: 'error',
                content: "Incorrect current pin code",
                className: 'custom-class pop-medium',
                duration: 2.5,
            });
        }else if(pinCode === data.new_pin_code){
            message.open({
                type: 'error',
                content: "New pin code cannot be same as old pin code",
                className: 'custom-class pop-medium',
                duration: 2.5,
            });
        }else{
            changePin({student_id: id, new_pin_number: data.new_pin_code})
            if(pinStatus === 'success'){
                setPinCode(data.new_pin_code);
            }
            
        }
        
    }

  return (
    <div className="pop-semibold py-3 dark:text-gray-300">
        <h2 className="pop-bold text-xl dark:text-gray-300">Profile</h2>
        <div className="profile-container ">
            <div className="img-holder flex  my-5 gap-3 md:gap-10">
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
            <div className="grid md:grid-cols-2 md:gap-10 md:pr-16">
                <div className="">
                    <label className='pb-1 opacity-80 mt-8 block text-sm pop-regular'>Fullname</label>
                    <input {...profileRegister("fullname")} defaultValue={fullname ?? "John Doe"} onChange={(e) => setFullname(e.target.value)} type="text" className='bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-[1px] dark:border-zinc-700 opacity-90 w-full' />
                    {errorProfile.fullname && <span className="text-red-400 text-center text-sm">{errorProfile.fullname.message}</span>}
                </div>

                <div className="">
                    <label className='pb-1 opacity-80 mt-4 md:mt-8 block text-sm pop-regular'>Student ID</label>
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
        <div className="security py-4 md:pr-16">
            <h2 className="text-xl py-5 pop-bold">Security</h2>

            <p className="text-sm opacity-75 pop-light">Mobile Number</p>
            <div className="number flex justify-between pb-3">
                <h4 className="pop-regular">{number}</h4>
                <button onClick={showNumberDrawer} className="pop-regular text-sm underline text-blue-500">Change</button>
            </div>

            <p className="text-sm opacity-75 pop-light">PIN Number</p>
            <div className="number flex justify-between pb-3  border-b-2 border-dashed dark:border-zinc-700">
                <h4 className="">••••</h4>
                <button onClick={showPinDrawer} className="pop-regular text-sm underline text-blue-500">Change</button>
            </div>

            <div className="password pt-5 flex justify-between">
                <h4 className="">Password</h4>
                {!isPassOpen
                    ? <button onClick={() => setIsPassOpen(!isPassOpen)} className="pop-regular text-sm underline text-blue-500">Show</button>
                    : <button onClick={() => setIsPassOpen(!isPassOpen)} className="pop-regular text-sm underline text-blue-500">Hide</button>
                }
            </div>

            {isPassOpen 
                ? <form onSubmit={handleSubmitPassword(handleChangePassword)}>
                    <div className="grid md:grid-cols-2 md:gap-10">
                        <div className="">
                            <label className='pb-1 opacity-80 mt-8 block text-sm pop-regular'>New password</label>
                            <input {...passwordRegister("new_password")} type={showPassword ? "text" : "password"} placeholder="••••••••" required className='bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-[1px] dark:border-zinc-700 opacity-90 w-full' />
                            {errorPassword.new_password && <span className="text-red-400 text-center block pt-2 text-xs md:text-sm">{errorPassword.new_password.message}</span>}
                        </div>
        
                        <div className="">
                            <label className='pb-1 opacity-80 mt-4 md:mt-8 block text-sm pop-regular'>Current password</label>
                            <input {...passwordRegister("current_password")} type={showPassword ? "text" : "password"} placeholder="••••••••" required className='bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-[1px] dark:border-zinc-700 opacity-90 w-full' />
                            {errorPassword.current_password && <span className="text-red-400 text-center block pt-2 text-xs md:text-sm">{errorPassword.current_password.message}</span>}
                        </div>
                    </div>
                    <div className="showpass py-3 flex gap-2 text-sm pop-regular">
                        <Checkbox className="dark:text-gray-300 pop-regular" onChange={onChecked}>Show password</Checkbox>
                    </div>
                    <div className="resetpasss flex flex-col text-xs pop-regular pt-6 pb-4 md:gap-2">
                        <p>Can't remember your current password?</p>
                        <span className="text-blue-500 underline cursor-pointer">Reset your password</span>
                    </div>
                    <div className="button flex justify-end">
                        <button
                        onClick={handleSavePassword}
                        className="bg-[#202142] text-sm dark:bg-[#33366d] text-white pop-medium focus:outline-none border-[1px] border-[#202142] rounded-lg flex py-2 px-3">Save password</button>
                    </div>
                  </form>
                : ""}
        </div>
        {/* SECURITY */}

        {/* DELETE ACCOUNT */}
        <div className="delete md:pr-16">
            <div className="delete pb-5 flex justify-between  border-t-2 border-dashed dark:border-zinc-700">
                <h2 className="py-5">Delete account</h2>
                {!isDeleteOpen
                    ? <button onClick={() => setIsDeleteOpen(!isDeleteOpen)} className="pop-regular text-sm underline text-red-500">Show</button>
                    : <button onClick={() => setIsDeleteOpen(!isDeleteOpen)} className="pop-regular text-sm underline text-red-500">Hide</button>
                }
            </div>

            {isDeleteOpen 
                ?<div className="warning text-xs md:w-3/5 ">
                    <h1>Would you like to delete your account?</h1>
                    <div className="">This account contains sensitive informations. Deleting your account will remove all the content associated with it.</div>

                    <button className="underline py-4 text-red-400">I want to delete my account</button>
                 </div>
                : ""
            }
        </div>
        {/* DELETE ACCOUNT */}

        {/* NUMBER DRAWER */}
        <Drawer title="Change Mobile Number" placement="right" onClose={closeNumberDrawer} open={openChangeNumber}>
            <form onSubmit={handleSubmitMobile(handleSendOtp)} className="change-number-container pt-10">
                <div className="name flex flex-col pop-medium">
                    
                <label className="pop-regular opacity-80 text-sm">New Mobile Number</label>
                <input
                className="bg-transparent px-4 py-3 mb-2 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 tracking-wider"
                type="text"
                {...mobileRegister("new_mobile_number")}
                placeholder="ex. 09123456789"
                maxLength={11}
                minLength={11}
                required
                />
                {errorMobile.new_mobile_number && <span className="text-red-400 text-center block pt-2 text-xs md:text-sm">{errorMobile.new_mobile_number.message}</span>}
                    
                </div>
                {/* SEND OTP BUTTON */}
                <div className="btn-container flex items-center justify-center pt-3">
                    {!isSendingOtp 
                    ? <button disabled={isSendingOtp}  type='submit' className='flex items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-7 rounded-full'>
                        <p className='pop-medium'>Send OTP</p>   
                        </button>
                    : <button disabled={isSendingOtp} className='flex pop-medium items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-3 rounded-full'>
                        Sending OTP...
                        <Spin className='pl-1'/> 
                        </button>
                    }
                </div>
                {/* SEND OTP BUTTON */}
            </form>
            {mobileStatus === "success" && (
                <div className="input-otp">
                    <div className="otp pt-20">
                        <label className="pop-regular opacity-80 text-sm block py-1">OTP Code</label>
                        <form className="flex justify-between" onSubmit={handleSubmitOtp(handleConfirmOtp)}>
                            <input
                            className="bg-transparent px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2  tracking-wider"
                            {...otpRegister("new_otp_code")}
                            type="text"
                            placeholder="ex. 123456"
                            maxLength={6}
                            minLength={6}
                            required
                            />
                            
                            {!isConfirmingOtp 
                            ? <button disabled={isConfirmingOtp}  type='submit' className='flex items-center border-2 border-blue-400 text-blue-400 px-2 rounded-xl'>
                                <p className='pop-medium'>Confirm</p>   
                                </button>
                            : <button disabled={isConfirmingOtp} className='flex pop-medium items-center border-2 border-blue-400 text-blue-400 py-2 px-3 rounded-full'>
                                Confirming...
                                <Spin className='pl-1'/> 
                                </button>
                            }
                        </form>
                        {errorOtp.new_otp_code && <span className="text-red-400 text-center block pt-2 text-xs md:text-sm">{errorOtp.new_otp_code.message}</span>}
                    </div>
                </div>
            )}
        </Drawer>
        {/* NUMBER DRAWER */}

        {/* PIN DRAWER */}
        <Drawer title="Change PIN Code" placement="right" onClose={closePinDrawer} open={openChangePin}>
            <form onSubmit={handleSubmitPin(handlePin)} className="change-pin-container pt-10">
                <div className="name flex flex-col pop-medium">
                    <label className="pop-regular opacity-80 text-sm">Current Pin</label>
                    <input
                    className="bg-transparent px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 focus:border-indigo-400  tracking-wider"
                    type="text"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="ex. 1234"
                    maxLength={4}
                    minLength={4}
                    required
                    />
                    
                    <label className="pop-regular opacity-80 text-sm pt-5">New Pin</label>
                    <input
                    className="bg-transparent px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 focus:border-indigo-400  tracking-wider"
                    type="text"
                    {...pinRegister("new_pin_code")}
                    placeholder="ex. 1234"
                    maxLength={4}
                    minLength={4}
                    required
                    />
                    {errorPin.new_pin_code && <span className="text-red-400 text-center block pt-2 text-xs md:text-sm">{errorPin.new_pin_code.message}</span>}

                        
                </div>
                {/* CHANGE PIN BUTTON */}
                <div className="btn-change flex justify-center py-5">
                    {!isPinChanging 
                    ? <button disabled={isPinChanging}  type='submit' className='flex items-center border-2 border-[#1677ff] hover:bg-[#1677ff] hover:text-white text-[#1677ff] py-2 px-4 rounded-full'>
                        <p className='pop-medium'>Change</p>   
                        </button>
                    : <button disabled={isPinChanging} className='flex pop-medium items-center border-2 border-[#1677ff] text-[#1677ff] py-2 px-3 rounded-full'>
                        Changing...
                        <Spin className='pl-1'/> 
                        </button>
                    }
                </div>
                {/* CHANGE PIN BUTTON */}
            </form>
        </Drawer>
        {/* PIN DRAWER */}

    </div>
  )
}
