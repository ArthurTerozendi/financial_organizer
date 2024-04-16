import { FC } from "react"
import { InputProps } from "./type"

export const Input: FC<InputProps> = ({label, type, value, onChange}) => {
  
  return (
    <div className="flex flex-col gap-1">
      <label className="font-regular text-xs text-white"> {label} </label>
      <input className="border rounded-md focus:outline-none focus:shadow-outline p-1 text-sm" type={type} value={value} onChange={onChange}  />
    </div>
  )
}