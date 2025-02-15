import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { triggerHaptic } from '../utils/haptics';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface HapticButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const HapticButton: React.FC<HapticButtonProps> = ({ 
  onPress, 
  children, 
  style,
  variant = 'secondary',
  ...props 
}) => {
  const backgroundColor = useThemeColor({}, variant === 'primary' ? 'tint' : 
                                         variant === 'danger' ? 'error' : 
                                         'secondaryBackground');

  const handlePress = async (event: any) => {
    await triggerHaptic();
    onPress && onPress(event);
  };

  return (
    <TouchableOpacity 
      {...props} 
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor },
        style
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
}); 