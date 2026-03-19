import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ScoreboardProps {
  playerScore: number;
  botScore: number;
  playerLabel?: string;
  botLabel?: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  playerScore,
  botScore,
  playerLabel = 'YOU',
  botLabel = 'BOT',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreSection}>
        <Text style={styles.label}>{playerLabel}</Text>
        <Text style={[styles.score, styles.playerScore]}>{playerScore}</Text>
      </View>
      
      <View style={styles.divider}>
        <Text style={styles.dash}>-</Text>
      </View>
      
      <View style={styles.scoreSection}>
        <Text style={styles.label}>{botLabel}</Text>
        <Text style={[styles.score, styles.botScore]}>{botScore}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  scoreSection: {
    alignItems: 'center',
    minWidth: 60,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 2,
  },
  playerScore: {
    color: '#4CAF50',
  },
  botScore: {
    color: '#FF5722',
  },
  divider: {
    paddingHorizontal: 15,
  },
  dash: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default Scoreboard;
