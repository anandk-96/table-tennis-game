import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PaddleProps {
  x: number;
  y: number;
  size?: number;
  color?: string;
  isPlayer?: boolean;
}

const Paddle: React.FC<PaddleProps> = ({
  x,
  y,
  size = 50,
  color = '#CC0000',
  isPlayer = true,
}) => {
  const paddleSize = size;
  const handleWidth = size * 0.3;
  const handleHeight = size * 0.5;

  return (
    <View
      style={[
        styles.container,
        {
          left: x - paddleSize / 2,
          top: y - paddleSize / 2,
          transform: [{ rotate: isPlayer ? '0deg' : '180deg' }],
        },
      ]}
    >
      {/* Paddle head (circular rubber surface) */}
      <View
        style={[
          styles.paddleHead,
          {
            width: paddleSize,
            height: paddleSize,
            borderRadius: paddleSize / 2,
          },
        ]}
      >
        {/* Inner rubber texture */}
        <View
          style={[
            styles.innerRubber,
            {
              width: paddleSize * 0.85,
              height: paddleSize * 0.85,
              borderRadius: (paddleSize * 0.85) / 2,
            },
          ]}
        />
      </View>
      
      {/* Handle */}
      <View
        style={[
          styles.handle,
          {
            width: handleWidth,
            height: handleHeight,
            bottom: -handleHeight + 5,
            left: (paddleSize - handleWidth) / 2,
          },
        ]}
      >
        {/* Handle grip lines */}
        <View style={[styles.gripLine, { top: '20%' }]} />
        <View style={[styles.gripLine, { top: '40%' }]} />
        <View style={[styles.gripLine, { top: '60%' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  paddleHead: {
    backgroundColor: '#CC0000',
    borderWidth: 3,
    borderColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  innerRubber: {
    backgroundColor: '#E60000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  handle: {
    position: 'absolute',
    backgroundColor: '#8B4513',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#654321',
  },
  gripLine: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default Paddle;
