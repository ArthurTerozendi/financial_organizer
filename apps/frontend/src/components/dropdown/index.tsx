import { Select, MenuItem, styled } from "@mui/material";
import { FC } from "react";

interface DropdownProps {
  label: string;
  selectedValue: string;
  onChange: (value: string, fieldName: string) => void;
  openModal: () => void;
  options: { id: string; name: string }[];
}

const StyledSelect = styled(Select)(() => ({
  "& .MuiSelect-select": {
    padding: 0,
    color: "#292524 !important",
  },
  "& .MuiOutlinedInput-root": {
    color: "#292524 !important",
  },
  "& .MuiInputBase-root": {
    color: "#292524 !important",
  },
  borderRadius: "0.375rem",
}));

const Dropdown: FC<DropdownProps> = ({
  selectedValue,
  onChange,
  options,
  label,
  openModal,
}) => {
  const renderValue = (value: unknown) => {
    const stringValue = value as string;
    if (!stringValue) return "Selecione uma categoria";
    const selectedTag = options.find((tag) => tag.id === stringValue);
    return selectedTag ? selectedTag.name : stringValue;
  };

  return (
    <div className="flex flex-col gap-1 text-stone-800">
      <label className="font-regular text-xs text-white"> {label} </label>
      <StyledSelect
        className="border focus:outline-none focus:shadow-outline p-1 text-sm text-stone-800 bg-white"
        value={selectedValue}
        onChange={(e) => onChange(e.target.value as string, "tag")}
        displayEmpty
        renderValue={renderValue}
      >
        <MenuItem value="" disabled>
          Selecione uma categoria
        </MenuItem>
        {options.map((tag) => (
          <MenuItem key={tag.id} value={tag.id}>
            {tag.name}
          </MenuItem>
        ))}
        <MenuItem
          value=""
          onMouseDown={(e) => e.preventDefault()}
          onClick={openModal}
        >
          + Criar nova categoria
        </MenuItem>
      </StyledSelect>
    </div>
  );
};

export default Dropdown;
