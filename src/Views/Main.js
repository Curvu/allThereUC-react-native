import { StyleSheet, Text, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFonts from '../../useFonts.js';
import Button from '../Components/Logout.js';
import SendButton from '../Components/SendButton.js';
import { getAula, getPresence, submitPresence } from '../Api.js';

const markPresence = async (token, setButton) => {
  let { aula, session } = await getAula(token);
  console.log(aula, session);

  if (aula && session) {
    let presence = await getPresence(token, aula);
    console.log(presence);

    if (presence) {
      setButton('e');
      setTimeout(() => setButton(''), 1000);
    } else {
      submitPresence(token, aula, session)
      .then(response => {
        console.log(response);
        setButton('s');
        setTimeout(() => setButton(''), 1000);
      }).catch(error => {
        console.log(error);
        setButton('e');
        setTimeout(() => setButton(''), 1000);
      });
    }
  } else {
    setButton('e');
    setTimeout(() => setButton(''), 1000);
  }
}



// animation that changes the color of the button when pressed
const pressedAnimation = new Animated.Value(0);
const pressedStart = () => {
  Animated.timing(pressedAnimation, {
    toValue: 1,
    duration: 100,
    useNativeDriver: true,
  }).start();
}


export default Main = ({token, setToken}) => {
  const [font, setFont] = useState(false);
  const [button, setButton] = useState('');

  useEffect(() => {
    useFonts().then(() => setFont(true));
  }, []);

  const reset = async () => {
    AsyncStorage.clear();
    setToken(null);
  };

  return (
    <>
      {font && <Text style={styles.topText}>Marcar Presença</Text>}
      {font && <SendButton
        onPress={() => markPresence(token, setButton)}
        title='click'
        state={button}
        style={styles.clickButton}
        titleStyle={{...styles.textButton, fontSize: 24 }}
        animation={{transform: [{scale: pressedAnimation.interpolate({inputRange: [0, 1], outputRange: [1, 0.9]})}]}}
      />}
      {font && <Button
        onPress={reset}
        title='logout'
        style={styles.logoutButton}
        titleStyle={{...styles.textButton, fontSize: 16}}
      />}
    </>
  );
};

const styles = StyleSheet.create({
  topText: {
    fontSize: 30,
    fontFamily: 'Comfortaa',
    color: 'white',
    textDecorationStyle: 'solid',
    textTransform: 'capitalize',
    position: 'absolute',
    top: '10%',
  },
  logoutButton: {
    position: 'absolute',
    bottom: '5%',
  },
  textButton: {
    fontFamily: 'Comfortaa',
  }
});