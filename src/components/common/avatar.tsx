import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Avatar = ({
  name = '',
  source = null,
  size = 40,
  backgroundColor = '#ff69b4',
  textColor = '#ffffff',
  fontSize = null,
  style = {},
  textStyle = {},
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  // Function to get initials from name
  const getInitials = (fullName: string) => {
    if (!fullName) return '?';

    const nameParts = fullName.trim().split(/\s+/);

    if (nameParts.length === 1) {
      // Single name: take first two characters
      return nameParts[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple names: take first letter of each segment (max 3)
      return nameParts
        .slice(0, 3)
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
    }
  };

  // Calculate font size based on avatar size if not provided
  const calculatedFontSize = fontSize || Math.max(size * 0.35, 12);

  // Determine background colors array for gradient effect
  const getBackgroundColor = (name: string) => {
    if (backgroundColor !== '#ff69b4') return backgroundColor;

    // Generate consistent colors based on name
    const colors = [
      '#ff69b4',
      '#8b5cf6',
      '#06b6d4',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5f65',
      '#6366f1',
    ];

    const hash = name.split('').reduce((acc: any, char: any) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: getBackgroundColor(name),
    },
    style,
  ];

  const textStyles = [
    styles.text,
    {
      fontSize: calculatedFontSize,
      color: textColor,
    },
    textStyle,
  ];

  // Show image if source is provided and no error occurred
  const shouldShowImage = source && !imageError;

  return (
    <View style={containerStyle} {...props}>
      {shouldShowImage ? (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={styles.image}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      ) : (
        <Text style={textStyles}>{getInitials(name)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 999, // Large number to ensure circular
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Avatar;
