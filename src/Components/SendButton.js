import { useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default Button = ({ onPress, title, state, style, titleStyle }) => {
  const [pressed, setPressed] = useState('#1e90ff');

  return(
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        style,
        {borderColor: pressed},
        ((state === 'e') && styles.errorButton) || ((state === 's') && styles.successButton),
      ]}
      onPressIn={() => setPressed('#fff')}
      onPressOut={() => setPressed('#1e90ff')}
    >
      <Text style={[styles.text, titleStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: '40%',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#1e90ff',
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
  onPressed: {
    borderColor: 'white'
  }
});
