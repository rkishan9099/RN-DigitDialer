import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const DialPadButton = ({ button, typeNumber }: { button: any; typeNumber: any }) => {
  const clickHandler = () => {
    typeNumber(button);
  };

  return (
    <TouchableOpacity onPress={clickHandler} style={styles.button}>
      <Text style={styles.buttonText}>{button}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor:"#ffff",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  buttonText: {
    fontSize: 25,
  },
});

export default DialPadButton;
