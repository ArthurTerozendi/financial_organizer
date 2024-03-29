import { InputProps } from "./type"

export const Input = ({label, type, value, onChange}: InputProps) => {
  
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold text-sm"> {label} </label>
      <input className="border rounded-md focus:outline-none focus:shadow-outline p-1 text-sm" type={type} value={value} onChange={onChange}  />
    </div>
  )
}