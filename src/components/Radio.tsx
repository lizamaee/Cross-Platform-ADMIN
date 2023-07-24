import { createContext, useContext } from "react"


const RadioContext = createContext({
    value: undefined,
    onChange: undefined,
})

interface RadioProps {
    children: React.ReactNode;
    value: string;
}

export default function Radio({ children, ...props }: RadioProps) {
  const { value, onChange } = useContext(RadioContext)

  return (
    <label
      className={`
        p-2 shadow text-xs pop-medium rounded-md cursor-pointer
        transition-all ${
          value === props.value
            ? "bg-gradient-to-t from-white dark:from-[#2B2B2B] to-violet-100 text-violet-800 dark:text-violet-500 shadow-violet-500 shadow-md scale-105"
            : "bg-[#E5E0FF] dark:bg-[#2B2B2B]  dark:text-gray-300  hover:shadow-sm dark:shadow-none shadow-gray-300"
        }
    `}
    >
      <input
        type="radio"
        className="hidden"
        checked={value === props.value}
        onChange={onChange}
        {...props}
      />
      {children}
    </label>
  )
}

interface RadioGroupProps {
    value: string | any;
    onChange?: ((e: any) => void) | any;
    children: React.ReactNode;
  }
  

export function RadioGroup({ value, onChange, children }: RadioGroupProps) {
  return (
    <RadioContext.Provider value={{ value, onChange }}>
      {children}
    </RadioContext.Provider>
  )
}