import { Pressable, Text, StyleSheet } from 'react-native';

export default Button = ({ onPress, title, style, titleStyle }) => {
  return(
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.text, titleStyle]}>{title}</Text>
    </Pressable>
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
  text: {
    fontSize: 16,
    color: 'white',
    textDecorationStyle: 'solid',
    textTransform: 'capitalize',
  },
});
