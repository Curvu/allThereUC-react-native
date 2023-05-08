import { useState } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';

export default Button = ({ onPress, title, state, style, titleStyle }) => {
  const [pressed, setPressed] = useState('#1e90ff');

  return(
    <Animated.View
      style={[
        styles.button,
        style,
        {borderColor: pressed},
        ((state === 'e') && styles.errorButton) || ((state === 's') && styles.successButton),
      ]}
    >
      <Pressable onPress={onPress} style={[styles.button, styles.click]} onPressIn={() => setPressed('#fff')} onPressOut={() => setPressed('#1e90ff')}>
        <Text style={[styles.text, titleStyle]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  errorButton : {
    borderColor: 'red',
  },
  successButton : {
    borderColor: '#4d7c0f',
  },
  text: {
    fontSize: 16,
    color: 'white',
    textDecorationStyle: 'solid',
    textTransform: 'capitalize',
  },
  click: {
    width: '100%',
    height: '100%',
  },
  onPressed: {
    borderColor: 'white'
  }
});
