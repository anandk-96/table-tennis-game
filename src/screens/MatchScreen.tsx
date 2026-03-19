import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import GameBoard from '../components/GameBoard';
import Paddle from '../components/Paddle';
import Ball from '../components/Ball';
import Scoreboard from '../components/Scoreboard';

type MatchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Match'>;

interface Props {
  navigation: MatchScreenNavigationProp;
}

// Shot type definitions
type ShotType = 'normal' | 'smash' | 'spin' | 'soft';

interface ShotConfig {
  speedMultiplier: number;
  spinAmount: number;
  missChance: number;
  bounceReduction: number;
}

const SHOT_CONFIGS: Record<ShotType, ShotConfig> = {
  normal: { speedMultiplier: 1.0, spinAmount: 0, missChance: 0.1, bounceReduction: 0.95 },
  smash: { speedMultiplier: 2.0, spinAmount: 0, missChance: 0.4, bounceReduction: 0.98 },
  spin: { speedMultiplier: 1.2, spinAmount: 150, missChance: 0.25, bounceReduction: 0.92 },
  soft: { speedMultiplier: 0.5, spinAmount: 0, missChance: 0.05, bounceReduction: 0.8 },
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAME_WIDTH = SCREEN_WIDTH - 40;
const GAME_HEIGHT = GAME_WIDTH * 1.4;
const PADDLE_SIZE = 55;
const BALL_SIZE = 18;
const PADDLE_OFFSET = 35;

const MatchScreen: React.FC<Props> = ({ navigation }) => {
  // Game state
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  
  // Positions
  const [playerPaddleX, setPlayerPaddleX] = useState(GAME_WIDTH / 2);
  const [botPaddleX, setBotPaddleX] = useState(GAME_WIDTH / 2);
  const [ballPosition, setBallPosition] = useState({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
  });
  
  // Shot state
  const [selectedShot, setSelectedShot] = useState<ShotType>('normal');
  const [activeShot, setActiveShot] = useState<ShotType | null>(null);
  
  // Ball velocity and spin
  const ballVelocity = useRef({ vx: 0, vy: 0 });
  const ballSpin = useRef(0); // Spin affects horizontal curve
  const currentShotType = useRef<ShotType>('normal');
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // Bot AI state
  const botMissTarget = useRef<number | null>(null);
  const botShouldMiss = useRef(false);
  
  // Slider value for on-screen control
  const sliderValue = useRef(new Animated.Value(0.5)).current;
  
  // Button animation values
  const smashButtonScale = useRef(new Animated.Value(1)).current;
  const spinButtonScale = useRef(new Animated.Value(1)).current;
  const softButtonScale = useRef(new Animated.Value(1)).current;
  
  // Calculate paddle boundaries
  const minPaddleX = PADDLE_SIZE / 2 + 4;
  const maxPaddleX = GAME_WIDTH - PADDLE_SIZE / 2 - 4;
  
  // Player paddle position (bottom of table)
  const playerPaddleY = GAME_HEIGHT - PADDLE_OFFSET;
  
  // Bot paddle position (top of table)
  const botPaddleY = PADDLE_OFFSET;
  
  // Clamp function
  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  // Button press animation
  const animateButtonPress = (buttonScale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.85,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Reset ball to center
  const resetBall = useCallback((direction: number = 1) => {
    setBallPosition({
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
    });
    // Random initial velocity
    const angle = (Math.random() * 60 - 30) * (Math.PI / 180); // -30 to 30 degrees
    const speed = 200;
    ballVelocity.current = {
      vx: Math.sin(angle) * speed * direction,
      vy: Math.cos(angle) * speed * direction,
    };
    ballSpin.current = 0;
    currentShotType.current = 'normal';
    setActiveShot(null);
    botShouldMiss.current = false;
    botMissTarget.current = null;
  }, []);

  // Initialize ball
  useEffect(() => {
    resetBall(1);
  }, [resetBall]);

  // Handle slider control for player paddle
  const handleSliderChange = useCallback((value: number) => {
    const newX = minPaddleX + value * (maxPaddleX - minPaddleX);
    setPlayerPaddleX(newX);
  }, [minPaddleX, maxPaddleX]);

  // Listen to slider value changes
  useEffect(() => {
    const listener = sliderValue.addListener(({ value }) => {
      handleSliderChange(value);
    });
    return () => sliderValue.removeListener(listener);
  }, [sliderValue, handleSliderChange]);

  // Pan responder for slider
  const sliderPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        const newValue = clamp(touchX / 280, 0, 1);
        sliderValue.setValue(newValue);
      },
      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        const newValue = clamp(touchX / 280, 0, 1);
        sliderValue.setValue(newValue);
      },
    })
  ).current;

  // Shot button handlers
  const handleSmash = useCallback(() => {
    animateButtonPress(smashButtonScale);
    setSelectedShot('smash');
  }, []);

  const handleSpin = useCallback(() => {
    animateButtonPress(spinButtonScale);
    setSelectedShot('spin');
  }, []);

  const handleSoft = useCallback(() => {
    animateButtonPress(softButtonScale);
    setSelectedShot('soft');
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }
      
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      
      // Update ball position with spin curve effect
      setBallPosition((prev) => {
        let newX = prev.x + ballVelocity.current.vx * deltaTime;
        let newY = prev.y + ballVelocity.current.vy * deltaTime;
        let { vx, vy } = ballVelocity.current;
        const spin = ballSpin.current;
        const shotConfig = SHOT_CONFIGS[currentShotType.current];
        
        // Apply spin curve (affects horizontal velocity over time)
        if (spin !== 0) {
          newX += spin * deltaTime * 0.5;
        }
        
        // Wall collision (left/right) with bounce reduction based on shot
        if (newX <= BALL_SIZE / 2 + 4) {
          newX = BALL_SIZE / 2 + 4;
          vx = -vx * shotConfig.bounceReduction;
          ballSpin.current = -ballSpin.current * 0.7; // Spin reverses on wall hit
        } else if (newX >= GAME_WIDTH - BALL_SIZE / 2 - 4) {
          newX = GAME_WIDTH - BALL_SIZE / 2 - 4;
          vx = -vx * shotConfig.bounceReduction;
          ballSpin.current = -ballSpin.current * 0.7;
        }
        
        // Paddle collision - Player
        if (
          newY >= playerPaddleY - PADDLE_SIZE / 2 - BALL_SIZE / 2 &&
          newY <= playerPaddleY + PADDLE_SIZE / 2 &&
          newX >= playerPaddleX - PADDLE_SIZE / 2 &&
          newX <= playerPaddleX + PADDLE_SIZE / 2
        ) {
          newY = playerPaddleY - PADDLE_SIZE / 2 - BALL_SIZE / 2;
          const hitOffset = (newX - playerPaddleX) / (PADDLE_SIZE / 2);
          
          // Apply selected shot type
          const shotType = selectedShot;
          currentShotType.current = shotType;
          const config = SHOT_CONFIGS[shotType];
          
          const currentSpeed = Math.sqrt(vx * vx + vy * vy);
          const newSpeed = currentSpeed * config.speedMultiplier * 1.1;
          const angle = hitOffset * 45 * (Math.PI / 180);
          
          vx = Math.sin(angle) * newSpeed;
          vy = -Math.abs(Math.cos(angle) * newSpeed);
          
          // Apply spin based on shot type
          if (shotType === 'spin') {
            ballSpin.current = config.spinAmount * (hitOffset > 0 ? 1 : -1);
          } else if (shotType === 'smash') {
            ballSpin.current = 0;
            // Smash is faster and straighter
            vy = -Math.abs(vy) * 1.2;
          } else if (shotType === 'soft') {
            ballSpin.current = 0;
            // Soft shot - slower, more arc
            vy = -Math.abs(vy) * 0.7;
          }
          
          setActiveShot(shotType);
          
          // Reset shot selection after use
          setTimeout(() => {
            setSelectedShot('normal');
          }, 200);
        }
        
        // Paddle collision - Bot
        if (
          newY <= botPaddleY + PADDLE_SIZE / 2 + BALL_SIZE / 2 &&
          newY >= botPaddleY - PADDLE_SIZE / 2 &&
          newX >= botPaddleX - PADDLE_SIZE / 2 &&
          newX <= botPaddleX + PADDLE_SIZE / 2
        ) {
          newY = botPaddleY + PADDLE_SIZE / 2 + BALL_SIZE / 2;
          const hitOffset = (newX - botPaddleX) / (PADDLE_SIZE / 2);
          
          // Bot returns with normal shot
          const speed = Math.sqrt(vx * vx + vy * vy) * 1.05;
          const angle = hitOffset * 45 * (Math.PI / 180);
          vx = Math.sin(angle) * speed;
          vy = Math.abs(Math.cos(angle) * speed);
          
          // Reduce spin on bot return
          ballSpin.current = ballSpin.current * 0.5;
          currentShotType.current = 'normal';
          setActiveShot(null);
        }
        
        // Score detection
        if (newY < 0) {
          // Player scores
          setPlayerScore((prev) => prev + 1);
          setTimeout(() => resetBall(-1), 500);
          return { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
        } else if (newY > GAME_HEIGHT) {
          // Bot scores
          setBotScore((prev) => prev + 1);
          setTimeout(() => resetBall(1), 500);
          return { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
        }
        
        ballVelocity.current = { vx, vy };
        return { x: newX, y: newY };
      });
      
      // Bot AI - follow ball with miss chance based on shot difficulty
      setBotPaddleX((prevBotX) => {
        const shotConfig = SHOT_CONFIGS[currentShotType.current];
        
        // Determine if bot should miss this shot
        if (!botShouldMiss.current && currentShotType.current !== 'normal') {
          if (Math.random() < shotConfig.missChance) {
            botShouldMiss.current = true;
            // Set a miss target (offset from actual ball position)
            const missOffset = (Math.random() - 0.5) * PADDLE_SIZE * 2;
            botMissTarget.current = ballPosition.x + missOffset;
          }
        }
        
        // Bot target position
        let targetX: number;
        if (botShouldMiss.current && botMissTarget.current !== null) {
          // Bot aims for wrong position (will miss)
          targetX = botMissTarget.current;
        } else {
          // Bot aims for ball with prediction
          const predictedX = ballPosition.x + ballVelocity.current.vx * 0.1;
          targetX = predictedX;
        }
        
        // Bot reaction speed varies with shot type
        let botSpeed = 4;
        if (currentShotType.current === 'smash') {
          botSpeed = 3; // Slower reaction to smash
        } else if (currentShotType.current === 'soft') {
          botSpeed = 5; // Faster reaction to soft shot
        }
        
        const diff = targetX - prevBotX;
        let newBotX = prevBotX;
        
        if (Math.abs(diff) > botSpeed) {
          newBotX = prevBotX + Math.sign(diff) * botSpeed;
        } else {
          newBotX = targetX;
        }
        
        return clamp(newBotX, minPaddleX, maxPaddleX);
      });
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [playerPaddleX, botPaddleX, playerPaddleY, botPaddleY, ballPosition, minPaddleX, maxPaddleX, resetBall, selectedShot]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with scoreboard */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Exit</Text>
        </TouchableOpacity>
        <Scoreboard playerScore={playerScore} botScore={botScore} />
        <View style={styles.placeholder} />
      </View>

      {/* Game Board */}
      <View style={styles.gameArea}>
        <GameBoard width={GAME_WIDTH} height={GAME_HEIGHT}>
          {/* Bot paddle */}
          <Paddle
            x={botPaddleX}
            y={botPaddleY}
            size={PADDLE_SIZE}
            color="#1565C0"
            isPlayer={false}
          />
          
          {/* Ball */}
          <Ball
            x={ballPosition.x}
            y={ballPosition.y}
            size={BALL_SIZE}
          />
          
          {/* Player paddle */}
          <Paddle
            x={playerPaddleX}
            y={playerPaddleY}
            size={PADDLE_SIZE}
            color="#C62828"
            isPlayer={true}
          />
        </GameBoard>
      </View>

      {/* Slider Control */}
      <View style={styles.controls}>
        <Text style={styles.controlLabel}>← Move Paddle →</Text>
        <View
          style={styles.sliderContainer}
          {...sliderPanResponder.panHandlers}
        >
          <View style={styles.sliderTrack}>
            <Animated.View
              style={[
                styles.sliderThumb,
                {
                  left: sliderValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 260],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Shot Buttons */}
        <View style={styles.shotButtonsRow}>
          <TouchableOpacity
            style={[
              styles.shotButton,
              styles.smashButton,
              selectedShot === 'smash' && styles.selectedButton,
            ]}
            activeOpacity={0.7}
            onPress={handleSmash}
          >
            <Animated.View style={{ transform: [{ scale: smashButtonScale }] }}>
              <Text style={styles.shotButtonText}>SMASH</Text>
              <Text style={styles.shotButtonSubtext}>Fast & Straight</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shotButton,
              styles.spinButton,
              selectedShot === 'spin' && styles.selectedButton,
            ]}
            activeOpacity={0.7}
            onPress={handleSpin}
          >
            <Animated.View style={{ transform: [{ scale: spinButtonScale }] }}>
              <Text style={styles.shotButtonText}>SPIN</Text>
              <Text style={styles.shotButtonSubtext}>Curved Path</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shotButton,
              styles.softButton,
              selectedShot === 'soft' && styles.selectedButton,
            ]}
            activeOpacity={0.7}
            onPress={handleSoft}
          >
            <Animated.View style={{ transform: [{ scale: softButtonScale }] }}>
              <Text style={styles.shotButtonText}>SOFT</Text>
              <Text style={styles.shotButtonSubtext}>Slow Return</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholder: {
    width: 70,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  controls: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 10,
    letterSpacing: 1,
  },
  sliderContainer: {
    width: 280,
    height: 50,
    justifyContent: 'center',
  },
  sliderTrack: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    top: -4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  shotButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
    paddingHorizontal: 5,
  },
  shotButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  smashButton: {
    backgroundColor: '#D32F2F',
  },
  spinButton: {
    backgroundColor: '#0288D1',
  },
  softButton: {
    backgroundColor: '#7B1FA2',
  },
  selectedButton: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },
  shotButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  shotButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default MatchScreen;
