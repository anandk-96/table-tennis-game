import React from 'react';
import { StyleSheet, View } from 'react-native';

interface BallProps {
  x: number;
  y: number;
  size?: number;
}

const Ball: React.FC<BallProps> = ({
  x,
  y,
  size = 20,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {/* Shine effect */}
      <View
        style={[
          styles.shine,
          {
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: (size * 0.3) / 2,
            top: size * 0.15,
            left: size * 0.15,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  shine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default Ball;
