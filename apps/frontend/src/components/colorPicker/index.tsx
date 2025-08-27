import { FC, useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import { Input } from "../input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  name: string;
}

// Predefined color options for better UX
const predefinedColors = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Mint
  "#F7DC6F", // Gold
  "#BB8FCE", // Purple
  "#F8C471", // Orange
  "#82E0AA", // Light Green
  "#F1948A", // Light Red
  "#85C1E9", // Sky Blue
  "#FAD7A0", // Peach
  "#D7BDE2", // Lavender
  "#E74C3C", // Crimson Red
  "#3498DB", // Electric Blue
  "#2ECC71", // Emerald Green
  "#F39C12", // Dark Orange
  "#9B59B6", // Deep Purple
];

export const ColorPicker: FC<ColorPickerProps> = ({ label, value, onChange, name }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [customColor, setCustomColor] = useState(value || "#FF6B6B");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    handleClose();
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange(color);
  };

  const open = Boolean(anchorEl);
  const id = open ? `color-picker-${name}` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label className="font-regular text-xs text-white">{label}</label>
      <div className="flex items-center gap-2">
        <Button
          aria-describedby={id}
          onClick={handleClick}
          sx={{
            width: 30,
            height: 30,
            minWidth: 'unset',
            backgroundColor: value || "#FF6B6B",
            border: '2px solid #fff',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: value || "#FF6B6B",
              opacity: 0.8,
            }
          }}
        />
        <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>
          {value || "Selecione uma cor"}
        </Typography>
      </div>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            backgroundColor: '#2F3B51',
            border: '1px solid #4A5568',
            borderRadius: '8px',
            p: 2,
          }
        }}
      >
        <Box sx={{ width: 280 }}>
          <Typography variant="subtitle2" sx={{ color: 'white', mb: 2 }}>
            Cores predefinidas
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, mb: 2 }}>
            {predefinedColors.map((color) => (
              <Button
                key={color}
                onClick={() => handleColorSelect(color)}
                sx={{
                  width: 30,
                  height: 30,
                  minWidth: 'unset',
                  backgroundColor: color,
                  border: value === color ? '3px solid #fff' : '1px solid #4A5568',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: color,
                    opacity: 0.8,
                  }
                }}
              />
            ))}
          </Box>
          
          <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
            Cor personalizada
          </Typography>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-10 h-10 border rounded cursor-pointer"
              style={{ backgroundColor: customColor }}
            />
            <Input
              label=""
              type="text"
              name="customColor"
              value={customColor}
              onChange={handleCustomColorChange}
            />
          </div>
        </Box>
      </Popover>
    </div>
  );
};
