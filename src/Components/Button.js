import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default Button = ({ onPress, title, state }) => {
  return(
    <TouchableOpacity onPress={onPress} style={[styles.button, ((state === 'e') && styles.errorButton) || ((state === 's') && styles.successButton)]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#1e90ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  errorButton : {
    backgroundColor: 'red',
  },
  successButton : {
    backgroundColor: 'green',
  },
  text: {
    fontSize: 16,
    color: 'white',
    textDecorationStyle: 'solid',
    textTransform: 'capitalize',
  },
});
