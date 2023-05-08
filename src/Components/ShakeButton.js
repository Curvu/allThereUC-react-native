import React from 'react';
import { TouchableOpacity, Text, Animated } from 'react-native';
import { StyleSheet } from 'react-native';

export default ShakeButton = ({ title, _onPress, shakeAnimation }) => {
  return (
    <Animated.View style={{transform: [{translateX: shakeAnimation}]}}>
      <TouchableOpacity onPress={_onPress} style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 75,
    height: 40,
    backgroundColor: '#1e90ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    transitionDuration: 0.5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textDecorationStyle: 'solid',
    textTransform: 'capitalize',
  },
});
