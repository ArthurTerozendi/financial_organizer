import { FC } from "react"
import { InputProps } from "./type"

export const Input: FC<InputProps> = ({label, type, value, onChange, name}) => {
  
  if (type === 'radio' || type === 'checkbox') {
    return <div className="flex flex-row gap-1 items-center">
      <input className="border rounded-md focus:outline-none focus:shadow-outline p-1 text-sm text-stone-800" type={type} value={value} onChange={onChange} name={name} />
      <label className="font-regular text-xs text-white"> {label} </label>
    </div>
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="font-regular text-xs text-white"> {label} </label>
      <input className="border rounded-md focus:outline-none focus:shadow-outline p-1 text-sm text-stone-800 bg-white" type={type} value={value} onChange={onChange} name={name} />
    </div>
  )
}