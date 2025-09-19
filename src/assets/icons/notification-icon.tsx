import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface NotificationIconProps {
  size?: number;
  color?: string;
  stroke?: number;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  size = 24,
  color = '#fff',
  stroke = 2,
}) => {
  const scaledStroke = stroke * (size / 24); // scale stroke with icon size

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z"
        stroke={color}
        strokeWidth={scaledStroke}
      />
      <Path
        d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
        stroke={color}
        strokeWidth={scaledStroke}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default NotificationIcon;
