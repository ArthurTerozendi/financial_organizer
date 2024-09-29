import { ChangeEvent, HTMLInputTypeAttribute } from "react";

export interface InputProps {
  label: string;
  type: HTMLInputTypeAttribute;
  value: string | number | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
}
