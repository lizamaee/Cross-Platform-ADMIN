import { useAuthStore } from "../../../hooks/state";
import { useAdminResetConfirmOTP,  useAdminResetSendOTP, useChangePassword, useChangePin, useDeleteAdminAccount, useUpdateImage, useUpdateProfile, useVoter } from "../../../hooks/queries/useAdmin";
import { useRef, useState } from "react";
import { Checkbox, Drawer, Progress, Skeleton, Spin, message } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType, z } from "zod";
import axios from "axios";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { TiWarning } from "react-icons/ti";
import blank from '../../../images/blank.jpg'
import DeleteMe from "../../../components/DeleteMe";
import { useVoterConfirmOTP, useVoterResetPassword, useVoterSendOTPEmail } from "../../../hooks/queries/useVoter";
type ProfileFormData = {
    student_id: string;
    firstname: string;
    surname: string;
    age: string;
    year_level: string;
}

type PasswordFormData = {
    new_password: string;
    current_password: string;
}
type ResetPasswordFormData = {
    new_password: string;
    confirm_new_password: string;
}

type EmailFormData = {
    new_email: string;
}

type OtpFormData = {
    new_otp_code: string;
}

type PinFormData = {
    new_pin_code: string;
}
export default function AccountTab() {
    const { student_id} = useAuthStore((state) => state);
    const [isPassOpen, setIsPassOpen] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
  
    const voterQuery = useVoter(student_id);
  
    const firstname = voterQuery?.data?.voter?.firstname;
    const surname = voterQuery?.data?.voter?.surname;
    const age = voterQuery?.data?.voter?.age;
    const year_level = voterQuery?.data?.voter?.year_level;
    const profile = voterQuery?.data?.voter?.profile_picture;
    const email = voterQuery?.data?.voter?.mobile_email;
    const pinCode = voterQuery?.data?.voter?.pin_number;
  
    //PROGRESS BAR STATE
    const [uploadProgress, setUploadProgress] = useState(0);
  
    //REFERENCE OF IMAGE BUTTON
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    //ONCLICK FUNCTION OF REFERENCED IMAGE BUTTON
    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };
  
    //UPDATE IMAGE HOOK
    const { mutate: updateProfileImage, isLoading: isImageUpdating } =
      useUpdateImage();
  
    //UPDATE IMAGE
    const handleUpdateImage = async (e: any) => {
      e.preventDefault();
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_PRESET}`);
  
      const url = import.meta.env.VITE_CLOUDINARY_URL
      try {
        const response = await axios.post(`${url}`, formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total !== undefined) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        });
        updateProfileImage({
          student_id,
          profile_picture: response.data.secure_url,
        },
        {
            onSuccess: () => setUploadProgress(0)
        }
        );
      } catch (error) {
        console.log("Error uploading image: ", error);
      }
    };
  
    const profileSchema: ZodType<ProfileFormData> = z.object({
      student_id: z
        .string()
        .regex(/^\d{6,7}$/, { message: "Student ID must be a valid Student ID" })
        .min(6)
        .max(7),
      firstname: z.string().min(1, { message: "Please fill in your firstname" }),
      surname: z.string().min(1, { message: "Please fill in your surname" }),
      age: z
        .string()
        .regex(/^\d{2}$/, { message: "Age must be valid" })
        .min(1),
      year_level: z.string().nonempty("Please select your year Level"),
    });
    const {
      register: profileRegister,
      handleSubmit: handleSubmitProfile,
      formState: { errors: errorProfile },
      reset: profileReset,
    } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });
  
    //UPDATE PROFILE HOOKS
    const { mutate: updateProfile, isLoading: isSaving } = useUpdateProfile();
    const handleSave = (data: ProfileFormData) => {
  
      if(Number(data.age) <= 15){
        message.open({
          type: 'warning',
          content: "Age must be atleast 16 years old",
          className: 'custom-class pop-medium',
          duration: 2.5,
        });
      }else{
        updateProfile({
          student_id,
          firstname: data.firstname,
          surname: data.surname,
          age: data.age,
          year_level: data.year_level,
          new_student_id: data.student_id,
        });
      }
    };
  
    //CHANGE MOBILE NUMBER
    const [openChangeNumber, setOpenChangeNumber] = useState<boolean>(false);
    const [newEmail, setNewEmail] = useState<string>("");
  
    //OPEN DRAWER FUNCTION
    const showNumberDrawer = () => {
      setOpenChangeNumber(true);
    };
  
    //CLOSE DRAWER FUNCTION
    const closeNumberDrawer = () => {
      setOpenChangeNumber(false);
      emailReset();
      otpReset();
    };
  
    // //CHANGE MOBILE SCHEMA (SEND OTP)
    // const mobileSchema: ZodType<EmailFormData> = z.object({
    //   new_mobile_number: z
    //     .string()
    //     .regex(/^09\d{9}$/, {
    //       message: "Mobile number must be a valid PH Mobile Number",
    //     })
    //     .min(11)
    //     .max(11),
    // });

    //CHANGE EMAIL SCHEMA (SEND OTP)
    const emailSchema: ZodType<EmailFormData> = z.object({
      new_email: z
        .string().email(),
    });
    const {
      register: emailRegister,
      handleSubmit: handleSubmitEmail,
      formState: { errors: errorEmail },
      reset: emailReset,
    } = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });
  
    //CHANGE EMAIL HOOK
    //SEND OTP
    const {
      mutate: changeEmail,
      isLoading: isSendingOtp,
      status: emailStatus,
    } = useVoterSendOTPEmail();
  
    const handleSendOtpEmail = (data: EmailFormData) => {
      if (email === data.new_email) {
        message.open({
          type: "error",
          content: "Email cannot be same as old Email",
          className: "custom-class pop-medium",
          duration: 2.5,
        });
      } else {
        changeEmail({
          student_id,
          new_email: data.new_email,
        },
        {
          onSettled: () => setNewEmail(data.new_email)
        });
        
      }
    };
  
    //CHANGE EMAIL SCHEMA (CONFIRM OTP)
    const otpSchema: ZodType<OtpFormData> = z.object({
      new_otp_code: z
        .string()
        .regex(/^\d{6}$/, { message: "OTP code must be 6 digit number" })
        .min(6)
        .max(6),
    });
    const {
      register: otpRegister,
      handleSubmit: handleSubmitOtp,
      formState: { errors: errorOtp },
      reset: otpReset,
    } = useForm<OtpFormData>({ resolver: zodResolver(otpSchema) });
  
    //CHANGE EMAIL HOOK
    //CONFIRM OTP
    const {
      mutate: confirmMobileNumber,
      isLoading: isConfirmingOtp,
    } = useVoterConfirmOTP();

    const handleConfirmOtp = (data: OtpFormData) => {
      confirmMobileNumber({
        student_id,
        email: newEmail,
        otp_code: data.new_otp_code,
      },
      {
        onSettled: () => setOpenChangeNumber(false)
      });
      
    };
  
    //CHANGE PIN
    //CHANGE MOBILE NUMBER
    const [openChangePin, setOpenChangePin] = useState<boolean>(false);
    const [currentPin, setCurrentPin] = useState<string>("");
  
    //OPEN DRAWER FUNCTION PIN
    const showPinDrawer = () => {
      setOpenChangePin(true);
    };
  
    //CLOSE DRAWER FUNCTION PIN
    const closePinDrawer = () => {
      pinReset();
      setCurrentPin("");
      setOpenChangePin(false);
    };
  
    //PIN SCHEMA
    const pinSchema: ZodType<PinFormData> = z.object({
      new_pin_code: z
        .string()
        .regex(/^\d{4}$/, { message: "New PIN code must be 4 digit number" })
        .min(4)
        .max(4),
    });
  
    const {
      register: pinRegister,
      handleSubmit: handleSubmitPin,
      reset: pinReset,
      formState: { errors: errorPin },
    } = useForm<PinFormData>({ resolver: zodResolver(pinSchema) });
  
    //CHANGE PIN HOOOK
    const {
      mutate: changePin,
      isLoading: isPinChanging,
      status: pinStatus,
    } = useChangePin();
  
    const handlePin = (data: PinFormData) => {
      if (currentPin !== pinCode) {
        message.open({
          type: "error",
          content: "Incorrect current pin code",
          className: "custom-class pop-medium",
          duration: 2.5,
        });
      } else if (pinCode === data.new_pin_code) {
        message.open({
          type: "error",
          content: "New pin code cannot be same as old pin code",
          className: "custom-class pop-medium",
          duration: 2.5,
        });
      } else {
        changePin(
            { 
                student_id, new_pin_number: data.new_pin_code 
            },
            {
                onSuccess: () => {
                    pinReset()
                    setCurrentPin("")
                    setOpenChangePin(false)
                }
            }
            )
      }
    };
  
    //CHANGE PASSWORD
    //CHANGE PASSWORD SCHEMA
    const passwordSchema: ZodType<PasswordFormData> = z.object({
      new_password: z
        .string().min(4, {message: "Password must contain at least 4 character(s)"}).max(30),
      current_password: z
        .string()
        .min(1, { message: "Please enter current password" }).max(30),
    });
    const {
      register: passwordRegister,
      handleSubmit: handleSubmitPassword,
      formState: { errors: errorPassword },
      reset: passwordReset,
    } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });
  
    //CHECKBOX EVENT LISTENER
    const onChecked = (e: CheckboxChangeEvent) => {
      e.target.checked ? setShowPassword(true) : setShowPassword(false);
    };
  
    //CHANGE PASSWORD HOOK
    const { mutate: changePassword, isLoading: isPasswordChanging } =
      useChangePassword();
  
    //CHANGE PASSWORD FUNCTION
    const handleChangePassword = (data: PasswordFormData) => {
      changePassword({
        student_id,
        current_password: data.current_password,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
            passwordReset()
            setIsPassOpen(false)
        }
      }
      );
    };
  
    //RESET PASSWORD
    const [openResetPassword, setOpenResetPassword] = useState<boolean>(false);
  
    //RESET PASSWORD OTP HOOK
    //SEND OTP
    const {
      mutate: resetSendOTP,
      isLoading: isResetSendingOTP,
      status: resetSendStatus,
    } = useAdminResetSendOTP();
    //VERIFY OTP
    const {
      mutate: resetConfirmOTP,
      isLoading: isResetOTPConfirming,
      data: resetConfirmData,
    } = useAdminResetConfirmOTP();
  
    //RESET SEND OTP FUNCTION
    const handleResetSendOTP = () => {
      resetSendOTP({email},
      {
        onSettled: () => resetOtpReset()
      });
      
    };
  
    //OPEN DRAWER FUNCTION
    const showResetPasswordDrawer = () => {
      handleResetSendOTP();
      setOpenResetPassword(true);
    };
  
    //CLOSE DRAWER FUNCTION
    const closeResetPasswordDrawer = () => {
      resetOtpReset();
      resetPasswordReset();
      setOpenResetPassword(false);
    };
  
    //RESET PASSWORD OTP SCHEMA (CONFIRM OTP)
    const resetOtpSchema: ZodType<OtpFormData> = z.object({
      new_otp_code: z
        .string()
        .regex(/^\d{6}$/, { message: "OTP code must be 6 digit number" })
        .min(6)
        .max(6),
    });
    const {
      register: resetOtpRegister,
      handleSubmit: handleSubmitResetOtp,
      formState: { errors: errorResetOtp },
      reset: resetOtpReset,
    } = useForm<OtpFormData>({ resolver: zodResolver(resetOtpSchema) });
  
    //RESET CONFIRM OTP FUNCTION
    const handleResetConfirmOtp = (data: OtpFormData) => {
      resetConfirmOTP({
        email,
        otp_code: data.new_otp_code,
      });
    };
  
    //RESET PASSWORD SCHEMA
    const resetPasswordSchema: ZodType<ResetPasswordFormData> = z
      .object({
        new_password: z
          .string()
          .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*])/, {
            message:
              "Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character",
          })
          .min(14, { message: "Password must contain at least 14 character(s)" })
          .max(30),
        confirm_new_password: z.string(),
      })
      .refine((data) => data.new_password === data.confirm_new_password, {
        message: "Password do not match",
        path: ["confirm_new_password"],
      });
  
    const {
      register: resetPasswordRegister,
      handleSubmit: handleSubmitResetPassword,
      formState: { errors: errorResetPassword },
      reset: resetPasswordReset,
    } = useForm<ResetPasswordFormData>({
      resolver: zodResolver(resetPasswordSchema),
    });
  
    //RESET PASSWORD HOOK
    const { mutate: resetPassword, isLoading: isPasswordResetting } =
      useVoterResetPassword();
  
    //RESET PASSWORD FUNCTION
    const handleResetPassword = (data: ResetPasswordFormData) => {
      resetPassword({ email, new_password: data.new_password },
        {
          onSettled: () => closeResetPasswordDrawer()
        });
      
    };
  
    //DELETE ACCOUNT
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  
    //DELETE ACCOUNT HOOK
    const { mutate: deleteAccount, isLoading: isAdminAccountDeleting } =
      useDeleteAdminAccount();
  
    const handleDeleteAccount = () => {
      deleteAccount(student_id,
        {
          onSettled: () => setIsDeleteModalOpen(false)
        });
    };
  
    return (
      <div className="parent">
        <div className="pop-semibold py-5 mt-3 px-0 sm:px-4 dark:text-gray-300">
          <h2 className="pop-bold text-xl dark:text-gray-300">Profile</h2>
          <div className="profile-container ">
            <div className="img-holder flex flex-col md:flex-row  my-5 gap-3 md:gap-10">
              <div className="img flex flex-col justify-center items-center">
                
                {voterQuery?.isLoading
                  ? <Skeleton.Avatar size={144} active />
                  : <img
                  src={profile ?? blank}
                  alt={`${firstname + " " + surname} Image`}
                  className="object-cover rounded-full border-[6px] shadow-md border-white dark:border-zinc-700 w-28 h-28 md:w-36 md:h-36"
                />
                }
  
                <span className="w-full">
                  {/* PROGRESS BAR UI */}
                  {uploadProgress > 0 && (
                    <span>
                      <Progress percent={uploadProgress} size="small" />
                    </span>
                  )}
                  {/* PROGRESS BAR UI */}
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleUpdateImage}
              />
              <div className="choose-btn flex flex-col items-center gap-5 justify-center">
                {voterQuery?.isLoading
                  ? <Skeleton.Button shape="round" size="large" active/>
                  : isImageUpdating ? (
                    <button className="bg-[#202142] dark:bg-[#33366d] text-white pop-medium focus:outline-none border-2 border-[#202142] rounded-lg flex py-3 px-5">
                      Uploading...
                    </button>
                  ) : (
                    <button
                      onClick={handleButtonClick}
                      className="bg-[#202142] dark:bg-[#33366d] text-white pop-medium focus:outline-none border-2 border-[#202142] rounded-lg flex py-3 px-5"
                    >
                      Change picture
                    </button>
                  )
                }
              </div>
            </div>
          </div>
  
          <form onSubmit={handleSubmitProfile(handleSave)}>
            <div className="id w-4/6 md:w-2/6">
              <label className="pb-1 opacity-80 mt-4 md:mt-8 block text-sm pop-regular">
                Student ID
              </label>
              {voterQuery?.isLoading
                ? <Skeleton.Input size="large" active/>
                : <input
                    {...profileRegister("student_id")}
                    defaultValue={student_id ?? "1234567"}
                    type="text"
                    minLength={6}
                    maxLength={7}
                    required
                    className="bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-2 dark:border-zinc-700 opacity-90 w-full"
                  />
              }
              {errorProfile.student_id && (
                <span className="text-red-400 text-center text-sm">
                  {errorProfile.student_id.message}
                </span>
              )}
            </div>
            <div className="grid md:grid-cols-2 md:gap-32 pop-regular ">
              <div className="firstname">
                <label className="pb-1 opacity-80 mt-4 md:mt-8 block text-sm dark:text-gray-300">
                  Firstname
                </label>
                {voterQuery?.isLoading
                  ? <Skeleton.Input size="large" active/>
                  : <input
                      {...profileRegister("firstname")}
                      defaultValue={firstname ?? "John"}
                      type="text"
                      className="bg-transparent capitalize py-4 px-4 outline-none rounded-md border-solid border-2 dark:text-gray-100 tracking-wide dark:border-zinc-700 focus:border-indigo-400  opacity-90 w-full"
                    />
                }
                
                {errorProfile.firstname && (
                  <span className="text-red-400 text-center text-sm">
                    {errorProfile.firstname.message}
                  </span>
                )}
              </div>
              <div className="surname">
                <label className="pb-1 opacity-80 mt-4 md:mt-8 block text-sm dark:text-gray-300">
                  Surname
                </label>
                {voterQuery?.isLoading
                  ? <Skeleton.Input size="large" active/>
                  : <input
                    {...profileRegister("surname")}
                    defaultValue={surname ?? "Doe"}
                    type="text"
                    className="bg-transparent capitalize py-4 px-4 outline-none rounded-md border-solid border-2 dark:text-gray-100 tracking-wide dark:border-zinc-700 focus:border-indigo-400  opacity-90 w-full"
                  />
                }
                
                {errorProfile.surname && (
                  <span className="text-red-400 text-center text-sm">
                    {errorProfile.surname.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-32 pop-regular ">
              <div className="age">
                <label className="pb-1 opacity-80 mt-4 md:mt-8 block text-sm dark:text-gray-300">
                  Age
                </label>
                {voterQuery?.isLoading
                  ? <Skeleton.Input size="large" active/>
                  : <input
                    {...profileRegister("age")}
                    defaultValue={age ?? "16"}
                    maxLength={2}
                    minLength={1}
                    type="text"
                    className="bg-transparent py-4 px-4 outline-none rounded-md border-solid border-2 dark:text-gray-100 tracking-wide dark:border-zinc-700 focus:border-indigo-400  opacity-90 w-16 text-center"
                  />
                }
                
              </div>
              <div className="year_level pop-regular">
                <label className="pb-1 opacity-80 mt-4 md:mt-8 block text-sm dark:text-gray-300">
                  Year Level
                </label>
                {voterQuery?.isLoading
                  ? <Skeleton.Input size="large" active/>
                  : <select
                      {...profileRegister("year_level")}
                      defaultValue={year_level ?? "1st Year"}
                      className="w-3/6 sm:w-full bg-transparent dark:text-gray-100 rounded-lg focus:border-indigo-400 outline-none dark:border-zinc-700 border-2 py-4 px-4 "
                    >
                      <option
                        className="bg-transparent rounded dark:bg-[#313131] dark:text-gray-300"
                        value=""
                      >
                        Select year level
                      </option>
                      <option
                        className="bg-transparent dark:bg-[#313131] dark:text-gray-300"
                        value="1st Year"
                      >
                        1st Year
                      </option>
                      <option
                        className="bg-transparent dark:bg-[#313131] dark:text-gray-300"
                        value="2nd Year"
                      >
                        2nd Year
                      </option>
                      <option
                        className="bg-transparent dark:bg-[#313131] dark:text-gray-300"
                        value="3rd Year"
                      >
                        3rd Year
                      </option>
                      <option
                        className="bg-transparent dark:bg-[#313131] dark:text-gray-300"
                        value="4th Year"
                      >
                        4th Year
                      </option>
                    </select>
                }
                
              </div>
            </div>
            <div className="grid grid-cols-2 md:gap-32 pop-regular ">
              {errorProfile.age ? (
                <span className="text-red-400 text-center text-sm pt-3">
                  {errorProfile.age.message}
                </span>
              ) : (
                <div className="empty"></div>
              )}
              {errorProfile.year_level ? (
                <span className="text-red-400 text-center text-sm pt-3">
                  {errorProfile.year_level.message}
                </span>
              ) : (
                <div className="empty"></div>
              )}
            </div>
            {voterQuery?.isLoading
              ? <div className="save-btn flex justify-end py-5">
                  <Skeleton.Button shape="round" size="large" active/>
                </div>
              : <div className="save-btn flex justify-end py-5">
                  {!isSaving ? (
                    <button
                      type="submit"
                      className="flex items-center py-2 px-7 text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg"
                    >
                      <p className="pop-medium">Save</p>
                    </button>
                  ) : (
                    <button
                      disabled={isSaving}
                      className="flex pop-medium items-center py-2 px-7 text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg"
                    >
                      Saving...
                      <Spin className="pl-1" />
                    </button>
                  )}
                </div>
            }
            
          </form>
  
          {/* SECURITY */}
          <div className="security py-4">
            <h2 className="text-xl py-5 pop-bold">Security</h2>
  
            <p className="text-sm opacity-75 pop-light">Mobile Number</p>
            <div className="number flex justify-between pb-3">
              
              {voterQuery?.isLoading
                ? <div className="w-32 h-6 bg-gray-300 rounded-md dark:bg-gray-600 animate-pulse"></div>
                : <h4 className="pop-regular">{email !== undefined ? email?.slice(0,2).toString() + "*******" : "09*******" }</h4>
              }
              <button
                onClick={showNumberDrawer}
                className="pop-regular text-xs sm:text-sm underline text-blue-500"
              >
                Change
              </button>
            </div>
  
            <p className="text-sm opacity-75 pop-light">PIN Number</p>
            <div className="number flex justify-between pb-3  border-b-2 border-dashed dark:border-zinc-700">
              <h4 className="">••••</h4>
              <button
                onClick={showPinDrawer}
                className="pop-regular text-xs sm:text-sm  underline text-blue-500"
              >
                Change
              </button>
            </div>
  
            <div className="password pt-5 flex justify-between">
              <h4 className="">Password</h4>
              {!isPassOpen ? (
                <button
                  onClick={() => setIsPassOpen(!isPassOpen)}
                  className="pop-regular text-xs sm:text-sm underline text-blue-500"
                >
                  Show
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsPassOpen(!isPassOpen);
                    passwordReset();
                  }}
                  className="pop-regular text-xs sm:text-sm  underline text-blue-500"
                >
                  Hide
                </button>
              )}
            </div>
  
            {isPassOpen ? (
              <form onSubmit={handleSubmitPassword(handleChangePassword)}>
                <div className="grid md:grid-cols-2 md:gap-10">
                  <div className="">
                    <label className="pb-1 opacity-80 mt-8 block text-sm pop-regular">
                      New password
                    </label>
                    <input
                      {...passwordRegister("new_password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-2 dark:border-zinc-700 opacity-90 w-full"
                    />
                    {errorPassword.new_password && (
                      <span className="text-red-400 text-center block pt-2 text-xs">
                        {errorPassword.new_password.message}
                      </span>
                    )}
                  </div>
  
                  <div className="">
                    <label className="pb-1 opacity-80 mt-4 md:mt-8 block text-sm pop-regular">
                      Current password
                    </label>
                    <input
                      {...passwordRegister("current_password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="bg-transparent py-4 px-4 outline-none focus:outline-indigo-400 rounded-md border-solid border-2 dark:border-zinc-700 opacity-90 w-full"
                    />
                    {errorPassword.current_password && (
                      <span className="text-red-400 text-center block pt-2 text-xs">
                        {errorPassword.current_password.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="showpass py-3 flex gap-2 text-sm pop-regular">
                  <Checkbox
                    className="dark:text-gray-300 pop-regular"
                    onChange={onChecked}
                  >
                    Show password
                  </Checkbox>
                </div>
                <div className="resetpasss flex flex-col md:flex-row text-xs pop-regular pt-6 pb-4 md:gap-2">
                  <p>Can't remember your current password?</p>
                  <span
                    onClick={showResetPasswordDrawer}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    Reset your password
                  </span>
                </div>
                <div className="button flex justify-end">
                  {isPasswordChanging ? (
                    <button
                      disabled={isPasswordChanging}
                      className="bg-[#202142] text-sm dark:bg-[#33366d] text-white pop-medium focus:outline-none border-2 border-[#202142] rounded-lg flex py-2 px-3"
                    >
                      Saving password...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isPasswordChanging}
                      className="bg-[#202142] text-sm dark:bg-[#33366d] text-white pop-medium focus:outline-none border-2 border-[#202142] rounded-lg flex py-2 px-3"
                    >
                      Save password
                    </button>
                  )}
                </div>
              </form>
            ) : (
              ""
            )}
          </div>
          {/* SECURITY */}
  
          {/* DELETE ACCOUNT */}
          <div className="delete">
            <div className="delete pb-5 flex justify-between  border-t-2 border-dashed dark:border-zinc-700">
              <h2 className="py-5">Delete account</h2>
              {!isDeleteOpen ? (
                <button
                  onClick={() => setIsDeleteOpen(!isDeleteOpen)}
                  className="pop-regular text-xs sm:text-sm  underline text-red-500"
                >
                  Show
                </button>
              ) : (
                <button
                  onClick={() => setIsDeleteOpen(!isDeleteOpen)}
                  className="pop-regular text-xs sm:text-sm  underline text-red-500"
                >
                  Hide
                </button>
              )}
            </div>
  
            {isDeleteOpen ? (
              <div className="warning text-xs md:w-3/5 ">
                <h1>Would you like to delete your account?</h1>
                <div className="">
                  This account contains sensitive informations. Deleting your
                  account will remove all the content associated with it.
                </div>
  
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="underline py-4 text-red-400"
                >
                  I want to delete my account
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          {/* DELETE ACCOUNT */}
  
          {/* EMAIL DRAWER */}
          <Drawer
            title="Change Email Address"
            placement="right"
            onClose={closeNumberDrawer}
            open={openChangeNumber}
          >
            <form
              onSubmit={handleSubmitEmail(handleSendOtpEmail)}
              className="change-email-container pt-10"
            >
              <div className="name flex flex-col pop-medium">
                <label className="pop-regular opacity-80 text-sm">
                  New Email
                </label>
                <input
                  className="bg-transparent px-4 py-3 mb-2 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 border-gray-300 tracking-wider"
                  type="text"
                  {...emailRegister("new_email")}
                  placeholder="ex. youremail@mail.com"
                  required
                />
                {errorEmail.new_email && (
                  <span className="text-red-400 text-center block pt-2 text-xs md:text-sm">
                    {errorEmail.new_email.message}
                  </span>
                )}
              </div>
              {/* SEND OTP BUTTON */}
              <div className="btn-container flex items-center justify-center pt-3">
                {!isSendingOtp ? (
                  <button
                    disabled={isSendingOtp}
                    type="submit"
                    className="flex items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg py-2 px-7"
                  >
                    <p className="pop-medium">Send OTP</p>
                  </button>
                ) : (
                  <button
                    disabled={isSendingOtp}
                    className="flex pop-medium items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg py-2 px-3"
                  >
                    Sending OTP...
                    <Spin className="pl-1" />
                  </button>
                )}
              </div>
              {/* SEND OTP BUTTON */}
            </form>
            {emailStatus === "success" && (
              <div className="input-otp">
                <div className="otp pt-20">
                  <label className="pop-regular opacity-80 text-sm block py-1">
                    OTP Code
                  </label>
                  <form
                    className="flex justify-between"
                    onSubmit={handleSubmitOtp(handleConfirmOtp)}
                  >
                    <input
                      className="bg-transparent px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2  tracking-wider"
                      {...otpRegister("new_otp_code")}
                      type="text"
                      placeholder="ex. 123456"
                      maxLength={6}
                      minLength={6}
                      required
                    />
  
                    {!isConfirmingOtp ? (
                      <button
                        disabled={isConfirmingOtp}
                        type="submit"
                        className="flex items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg py-2 px-2 "
                      >
                        <p className="pop-medium">Confirm</p>
                      </button>
                    ) : (
                      <button
                        disabled={isConfirmingOtp}
                        className="flex pop-medium items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg py-2 px-3"
                      >
                        Confirming...
                        <Spin className="pl-1" />
                      </button>
                    )}
                  </form>
                  {errorOtp.new_otp_code && (
                    <span className="text-red-400 text-center block pt-2 text-xs md:text-sm">
                      {errorOtp.new_otp_code.message}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Drawer>
          {/* EMAIL DRAWER */}
  
          {/* PIN DRAWER */}
          <Drawer
            title="Change PIN Code"
            placement="right"
            onClose={closePinDrawer}
            open={openChangePin}
          >
            <form
              onSubmit={handleSubmitPin(handlePin)}
              className="change-pin-container pt-10"
            >
              <div className="name flex flex-col pop-medium">
                <label className="pop-regular opacity-80 text-sm">
                  Current Pin
                </label>
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
  
                <label className="pop-regular opacity-80 text-sm pt-5">
                  New Pin
                </label>
                <input
                  className="bg-transparent px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2 focus:border-indigo-400  tracking-wider"
                  type="text"
                  {...pinRegister("new_pin_code")}
                  placeholder="ex. 1234"
                  maxLength={4}
                  minLength={4}
                  required
                />
                {errorPin.new_pin_code && (
                  <span className="text-red-400 text-center block pt-2 text-xs md:text-sm">
                    {errorPin.new_pin_code.message}
                  </span>
                )}
              </div>
              {/* CHANGE PIN BUTTON */}
              <div className="btn-change flex justify-center py-5">
                {!isPinChanging ? (
                  <button
                    disabled={isPinChanging}
                    type="submit"
                    className="flex items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg py-2 px-4"
                  >
                    <p className="pop-medium">Change</p>
                  </button>
                ) : (
                  <button
                    disabled={isPinChanging}
                    className="flex pop-medium items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg py-2 px-3"
                  >
                    Changing...
                    <Spin className="pl-1" />
                  </button>
                )}
              </div>
              {/* CHANGE PIN BUTTON */}
            </form>
          </Drawer>
          {/* PIN DRAWER */}
  
          {/* RESET PASSWORD DRAWER */}
          <Drawer
            title="Reset Password"
            placement="right"
            onClose={closeResetPasswordDrawer}
            open={openResetPassword}
          >
            {/* SEND OTP BUTTON */}
            <div className="btn-container flex items-center justify-end pt-3">
              {!isResetSendingOTP ? (
                <button
                  onClick={handleResetSendOTP}
                  disabled={isResetSendingOTP}
                  type="submit"
                  className="flex items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg  py-1 px-3"
                >
                  <p className="pop-medium">Resend</p>
                </button>
              ) : (
                <button
                  disabled={isResetSendingOTP}
                  className="flex pop-medium items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg py-1 px-3"
                >
                  Sending...
                  <Spin className="pl-1" />
                </button>
              )}
            </div>
            {/* SEND OTP BUTTON */}
            {resetSendStatus === "success" && (
              <div className="input-otp">
                <div className="otp">
                  <h4 className="block text-center pop-semibold opacity-90 text-orange-400 py-5">
                    OTP Has been sent to mobile number associated to your account
                  </h4>
  
                  <label className="pop-regular opacity-80 text-sm block py-1">
                    OTP Code
                  </label>
                  <form
                    className="flex justify-between"
                    onSubmit={handleSubmitResetOtp(handleResetConfirmOtp)}
                  >
                    <input
                      className="bg-transparent px-4 py-3 rounded-lg text-black text-md pop-medium outline-none border-solid border-2  tracking-wider"
                      {...resetOtpRegister("new_otp_code")}
                      type="text"
                      placeholder="ex. 123456"
                      maxLength={6}
                      minLength={6}
                      required
                    />
  
                    {!isResetOTPConfirming ? (
                      <button
                        disabled={isResetOTPConfirming}
                        type="submit"
                        className="flex items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg px-2 py-2"
                      >
                        <p className="pop-medium">Confirm</p>
                      </button>
                    ) : (
                      <button
                        disabled={isResetOTPConfirming}
                        className="flex pop-medium items-center text-gray-100 bg-teal-800 hover:bg-teal-700 rounded-lg py-2 px-3"
                      >
                        Confirming...
                        <Spin className="pl-1" />
                      </button>
                    )}
                  </form>
                  {errorResetOtp.new_otp_code && (
                    <span className="text-red-400 text-center block pt-2 text-xs md:text-sm">
                      {errorResetOtp.new_otp_code.message}
                    </span>
                  )}
                </div>
              </div>
            )}
            {/* RESET PASSWORD FORM */}
            {resetConfirmData?.message === "success" ? (
              <form onSubmit={handleSubmitResetPassword(handleResetPassword)}>
                <div className="pt-10">
                  <h2 className="pop-semibold text-center block pb-5">
                    Reset your password
                  </h2>
                  <div className="">
                    <label className="pb-1 opacity-80 block text-sm pop-regular">
                      New password
                    </label>
                    <input
                      {...resetPasswordRegister("new_password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="bg-transparent py-4 px-4 outline-none outline:none focus:border-indigo-400 rounded-md border-solid border-2 border-zinc-300 opacity-90 w-full pop-regular"
                    />
                    {errorResetPassword.new_password && (
                      <span className="text-red-400 text-center block pt-2 text-xs">
                        {errorResetPassword.new_password.message}
                      </span>
                    )}
                  </div>
  
                  <div className="">
                    <label className="pb-1 opacity-80 mt-5 block text-sm pop-regular">
                      Confirm new password
                    </label>
                    <input
                      {...resetPasswordRegister("confirm_new_password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="bg-transparent py-4 px-4 outline-none outline:none focus:border-indigo-400 rounded-md border-solid border-2 border-zinc-300 opacity-90 w-full pop-regular"
                    />
                  </div>
                </div>
                <div className="showpass pt-2 pb-1 flex gap-2 text-sm pop-regular">
                  <Checkbox
                    className="dark:text-gray-500 pop-regular"
                    onChange={onChecked}
                  >
                    Show password
                  </Checkbox>
                </div>
                {errorResetPassword.confirm_new_password && (
                  <span className="text-red-400 text-center block text-xs">
                    {errorResetPassword.confirm_new_password.message}
                  </span>
                )}
                <div className="button flex justify-end">
                  {isPasswordResetting ? (
                    <button
                      disabled={isPasswordResetting}
                      className="bg-[#202142] text-sm dark:bg-[#33366d] text-white pop-medium focus:outline-none border-2 border-[#202142] rounded-lg mt-4 flex py-2 px-3"
                    >
                      Saving password...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isPasswordResetting}
                      className="bg-[#202142] text-sm dark:bg-[#33366d] text-white pop-medium focus:outline-none border-2 border-[#202142] rounded-lg mt-4 flex py-2 px-3"
                    >
                      Save password
                    </button>
                  )}
                </div>
              </form>
            ) : (
              ""
            )}
            {/* RESET PASSWORD FORM */}
          </Drawer>
          {/* RESET PASSWORD DRAWER */}
  
          {/* DELETE ACCOUNT MODAL */}
          <DeleteMe
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          >
              <div className="delete-container py-5 px-10 rounded-2xl bg-white dark:bg-[#414141]">
                <div className="px-10">
                  <div className="icon flex justify-center">
                    <div className="warning_icon p-3 shadow-md bg-[#fff5f6] dark:bg-[#504f4f] rounded-full">
                      <TiWarning size={30} className="text-[#ff3f56]" />
                    </div>
                  </div>
                  <div className="warn flex justify-center pt-5 pb-3">
                    <h2 className="md:text-xl text-lg md:tracking-wider pop-bold text-[#334049] dark:text-gray-200">
                      Delete Account
                    </h2>
                  </div>
                  <div className="warn-text tracking-wider text-xs md:text-sm">
                    <p className="pop-regular text-[#334049] dark:text-gray-300 text-center">
                      This action is irreversible.
                    </p>
                    <p className="pop-regular text-[#334049] dark:text-gray-300 text-center">
                      Are you sure?
                    </p>
                  </div>
                </div>
                <div className="choice-btn text-[#334049] dark:text-gray-200 pt-5 flex flex-col-reverse gap-3 md:flex-row  justify-evenly ">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="bg-[#f5f5f7] dark:bg-zinc-600 px-6 py-3 rounded-full"
                  >
                    No, Keep me
                  </button>
                  {isAdminAccountDeleting ? (
                    <button
                      disabled={isAdminAccountDeleting}
                      className="bg-[#ff3f56] text-white px-6 py-2 rounded-full"
                    >
                      Deleting...
                    </button>
                  ) : (
                    <button
                      disabled={isAdminAccountDeleting}
                      onClick={handleDeleteAccount}
                      className="bg-[#ff3f56] text-white px-6 py-2 rounded-full"
                    >
                      Yes, Delete!
                    </button>
                  )}
                </div>
              </div>
          </DeleteMe>
          {/* DELETE ACCOUNT MODAL */}
        </div>
      </div>
    );
  }
  