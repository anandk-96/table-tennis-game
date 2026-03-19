import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

interface GameBoardProps {
  children?: React.ReactNode;
  width: number;
  height: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ children, width, height }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      {/* Main table surface */}
      <View style={styles.tableSurface}>
        {/* Center line (vertical divider) */}
        <View style={styles.centerLine} />
        
        {/* Net (horizontal line in the middle) */}
        <View style={styles.net}>
          <View style={styles.netPost} />
          <View style={[styles.netPost, { right: 0, left: 'auto' }]} />
        </View>
        
        {/* End lines */}
        <View style={styles.endLineTop} />
        <View style={styles.endLineBottom} />
        
        {/* Side lines */}
        <View style={styles.sideLineLeft} />
        <View style={styles.sideLineRight} />
      </View>
      
      {/* Game elements (ball, paddles) */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  tableSurface: {
    flex: 1,
    backgroundColor: '#1B5E20',
    position: 'relative',
  },
  // Vertical center line
  centerLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ translateX: -1 }],
  },
  // Net (horizontal line)
  net: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 6,
    backgroundColor: '#FFFFFF',
    transform: [{ translateY: -3 }],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  netPost: {
    position: 'absolute',
    left: 0,
    top: -4,
    width: 8,
    height: 14,
    backgroundColor: '#424242',
    borderRadius: 2,
  },
  // End lines
  endLineTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 4,
    backgroundColor: '#FFFFFF',
  },
  endLineBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: '#FFFFFF',
  },
  // Side lines
  sideLineLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFFFFF',
  },
  sideLineRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFFFFF',
  },
});

export default GameBoard;
