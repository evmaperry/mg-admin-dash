import React, { useState } from 'react';
import reactCSS from 'reactcss';
import { ColorResult, RGBColor, SketchPicker } from 'react-color';
import { useCreateAppStore } from '@/providers/create-app-provider';

const ColorPicker: React.FC<{
  initialColor: string;
  onChangeComplete: (color: ColorResult, event: React.ChangeEvent) => void;
}> = ({ initialColor, onChangeComplete }) => {
  const { appColors, setAppColors } = useCreateAppStore((state) => state);

  const [color, setColor] = useState<string>(initialColor);

  const handleClick = () => {};

  const handleClose = () => {};

  const handleChange = (color:ColorResult, event:React.ChangeEvent) => {
    onChangeComplete(color, event);
    setColor(color.hex)
  };

  return <SketchPicker color={color} onChangeComplete={handleChange} />;
};

export default ColorPicker;
