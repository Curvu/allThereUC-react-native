import { StyleSheet, Text, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useFonts from '../../useFonts.js';
import Button from '../Components/Logout.js';
import SendButton from '../Components/SendButton.js';

const getPresence = async (token, aula) => {
  try {
    const response = await axios.get(`https://academic.fw.uc.pt/v1/student/class/${aula}/presence`, { headers: { 'authorization': token } });
    return response.data.type;
  } catch (error) {
    return true;
  }
}

const submitPresence = async (token, aula, session) => {
  const payload = { "type": "local" }
  try {
    const response = await axios.post(`https://academic.fw.uc.pt/v1/student/class/${aula}/session/${session}/presence`, payload, { headers: { 'authorization': token, 'Content-Type': 'application/json' } });
    return response.data;
  } catch (error) {
    return false;
  }
}

const markPresence = async (token, setButton) => {
  let aula, session;

  await axios.get('https://academic.fw.uc.pt/v1/student/sessions/next', { headers: { 'authorization': token } })
  .then(async response => {
    for (let i = 0; i < response.data.length; i++) {
      element = response.data[i];
      // console.log(element);
      aula = element.edition.key;
      session = element.key;
      let start = new Date(element.start_date);
      let end = new Date(element.end_date);

      let now = Date.now();
      if ((now > start && now < end)) break;
      else {
        aula = null;
        session = null;
        start = null;
        end = null;
      }
    }
  }).catch(error => {});
  
  console.log(aula, session);
  if (aula && session) {
    await getPresence(token, aula)
    .then(presence => {
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
    }).catch(error => {
      console.log(error);
      setButton('e');
      setTimeout(() => setButton(''), 1000);
    });
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