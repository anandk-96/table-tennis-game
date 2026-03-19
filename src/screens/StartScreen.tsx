import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type StartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Start'>;

interface Props {
  navigation: StartScreenNavigationProp;
}

const StartScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <Text style={styles.title}>TABLE TENNIS</Text>
        <Text style={styles.subtitle}>CHAMPIONSHIP</Text>
        
        <View style={styles.decorationContainer}>
            <View style={styles.paddleDecoration} />
            <View style={styles.ballDecoration} />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Match')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>START MATCH</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
            <Text style={styles.footerText}>Swipe to play • Master the spin</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a472a', // Table green
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  subtitle: {
    fontSize: 24,
    color: '#ffd700',
    fontWeight: '600',
    marginBottom: 50,
    letterSpacing: 2,
  },
  decorationContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  paddleDecoration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#cc0000',
    borderWidth: 5,
    borderColor: '#800000',
  },
  ballDecoration: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 20,
    right: -20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  }
});

export default StartScreen;
