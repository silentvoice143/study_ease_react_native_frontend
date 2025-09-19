import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MenuIconProps {
  size?: number;
  color?: string;
  stroke?: number; // strokeWidth
}

const MenuIcon: React.FC<MenuIconProps> = ({
  size = 24,
  color = '#000',
  stroke = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6H20M4 12H20M4 18H20"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default MenuIcon;
