import React, { Children } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface IconButtonProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  size = 24,
  backgroundColor = '#007bff',
  onPress,
  style,
}) => {
  // Use a default icon or handle unknown icons gracefully

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('IconButton onPress');
        onPress && onPress();
      }}
      style={[
        styles.button,
        {
          width: size * 2,
          height: size * 2,
          backgroundColor,
        },
        style,
      ]}
    >

      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default IconButton;
