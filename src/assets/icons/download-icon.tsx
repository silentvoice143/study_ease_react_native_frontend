import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * DownloadIcon
 * React Native component generated from provided SVG.
 * Props:
 *  - size (number) default 24
 *  - color (string) default '#323232'
 *  - style (object) additional container style
 *  - ...props forwarded to the Svg element
 */

export default function DownloadIcon({
  size = 24,
  color = '#323232',
  style = {},
  ...props
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      {...props}
    >
      <Path
        d="M12 16L12 8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 13L11.913 15.913V15.913C11.961 15.961 12.039 15.961 12.087 15.913V15.913L15 13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 15L3 16L3 19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19L21 16L21 15"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
