import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillShieldLockFill } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ZodType, z } from "zod";
import { useAuthStore } from "../hooks/state";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { resetPinCode } from "../api/auth";

type PinFormData = {
  pin_code: string;
  confirm_pin_code: string;
};

export default function RPin() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const {student_id} = useAuthStore((state) => state)
  const navigate = useNavigate()

  const handleShowPin = () => setShowPin(!showPin);
  const handleShowConfirmPin = () => setShowConfirmPin(!showConfirmPin);

  const schema: ZodType<PinFormData> = z
    .object({
      pin_code: z
        .string()
        .regex(/^\d{4}$/, { message: "PIN code must be 4 digit numbers" })
        .min(4)
        .max(4),
      confirm_pin_code: z
        .string()
        .regex(/^\d{4}$/, { message: "PIN code must be 4 digit numbers" })
        .min(4)
        .max(4),
    })
    .refine((data) => data.pin_code === data.confirm_pin_code, {
      message: "PIN code do not match",
      path: ["confirm_pin_code"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PinFormData>({ resolver: zodResolver(schema) });

  const handleConfirm = async (data: PinFormData) => {
    try {
      setIsConfirming(true)
      const response = await resetPinCode(student_id, data.confirm_pin_code)

      if(response.data.message === 'success'){
        message.success('PIN code Reset! :)')
        setIsConfirming(false)
        navigate('/login', {replace: true})
      }else{
        setIsConfirming(false)
        message.open({
          type: 'warning',
          content: `${response.data.message}`,
          className: 'custom-class pop-medium',
          duration: 2.5,
        });
      }
      
    } catch (error:any) {
      setIsConfirming(false)
      if (error.message === 'Network Error') {
        message.open({
          type: 'error',
          content: 'Server Unavailable',
          className: 'custom-class pop-medium',
          duration: 2.5,
        });
      } else if(error.response.data.error){
        message.open({
          type: 'error',
          content: `${error.response.data.error}`,
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
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className=" flex flex-col px-5 md:w-[40%] pt-20">
        <BsFillShieldLockFill
          size={100}
          className="text-center w-full text-[#4C7CE5] pb-5"
        />
        <h2 className="text-[#4C7CE5] sm:text-lg md:text-2xl pb-10 md:pb-20 text-center pop-bold">
          Enter your new PIN code
        </h2>
        <form onSubmit={handleSubmit(handleConfirm)} className="flex flex-col">
          {/* CREATE PIN CODE */}
          <label className="text-[#3F3D56] sm:text-sm dark:text-gray-400 pop-light py-2 opacity-80 text-xs">
            new PIN code
          </label>
          <div className="flex text-gray-800 dark:text-gray-400 rounded-lg relative bg-[#E5E0FF] w-full border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a]">
              <input
                className="w-5/6 sm:w-full pl-4 py-3 text-black text-md pop-medium outline-none  dark:text-white tracking-wider bg-transparent"
                type={showPin ? "text" : "password"}
                {...register("pin_code")}
                placeholder="Ex. 1234"
                maxLength={4}
                minLength={4}
                required
              />
              <button
                className="flex absolute sm:static z-20 top-3 right-0 justify-center items-center text-sm font-bold w-14"
                type="button"
                onClick={handleShowPin}
              >
                {showPin ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
              </button>
            </div>
          {errors.pin_code && (
            <span className="text-red-400 text-center text-sm">
              {errors.pin_code.message}
            </span>
          )}
          {/* CONFIRM PIN CODE */}
          <label className="text-[#3F3D56] sm:text-sm dark:text-gray-400 pop-light py-2 opacity-80 text-xs">
            Confirm new PIN code
          </label>
          <div className="flex text-gray-800 dark:text-gray-400 rounded-lg relative bg-[#E5E0FF] w-full border-solid border-2 border-gray-300 dark:border-gray-600 dark:bg-[#4a4a4a4a]">
              <input
                className="w-5/6 sm:w-full pl-4 py-3 text-black text-md pop-medium outline-none  dark:text-white tracking-wider bg-transparent"
                type={showConfirmPin ? "text" : "password"}
                {...register("confirm_pin_code")}
                placeholder="Ex. 1234"
                maxLength={4}
                minLength={4}
                required
              />
              <button
                className="flex absolute sm:static z-20 top-3 right-0 justify-center items-center text-sm font-bold w-14"
                type="button"
                onClick={handleShowConfirmPin}
              >
                {showConfirmPin ? <FaEyeSlash size={23}/> : <FaEye size={23}/>}
              </button>
            </div>
          {errors.confirm_pin_code && (
            <span className="text-red-400 text-center text-sm">
              {errors.confirm_pin_code.message}
            </span>
          )}
          <div className="verify-wrapper flex justify-center">
            {!isConfirming ? (
              <button
                type="submit"
                disabled={isConfirming}
                className=" w-full py-3 sm:px-20 mt-5 pop-bold text-white rounded-lg sm:text-lg bg-[#4C7CE5]"
              >
                Confirm
              </button>
            ) : (
              <button
                disabled={isConfirming}
                className=" w-full py-3 sm:px-20 mt-5 pop-bold text-white rounded-lg sm:text-lg bg-[#4C7CE5]"
              >
                Confirming...
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
