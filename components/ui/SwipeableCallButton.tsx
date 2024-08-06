import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';

interface SwipeableCallButtonProps {
  onAnswer: () => void;
  onHangup: () => void;
}

const SwipeableCallButton: React.FC<SwipeableCallButtonProps> = ({ onAnswer, onHangup }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  // Handle gesture updates
  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  // Handle gesture end
  const handleGestureEnd = (event: PanGestureHandlerStateChangeEvent) => {
    const { translationX } = event.nativeEvent;
    if (translationX > 100) {
      onAnswer();
    } else if (translationX < -100) {
      onHangup();
    }
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setIsSwiping(false);
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={handleGestureEnd}
    >
      <Animated.View style={[styles.buttonContainer, { transform: [{ translateX }] }]}>
        <TouchableOpacity onPress={onAnswer} style={styles.answerButton}>
          <Text style={styles.buttonText}>Answer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onHangup} style={styles.hangupButton}>
          <Text style={styles.buttonText}>Hangup</Text>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  answerButton: {
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 10,
  },
  hangupButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SwipeableCallButton;
