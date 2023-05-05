import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Button from '../Components/Button';

const getPresence = async (token, aula) => {
  try {
    const response = await axios.get(`https://academic.fw.uc.pt/v1/student/class/${aula}/presence`, { headers: { 'authorization': token } });
    return response.data; // TODO check this
  } catch (error) {
    return false;
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

export default Main = ({token, setToken}) => {
  const [button, setButton] = useState('');

  const reset = async () => {
    AsyncStorage.clear();
    setToken(null);
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={() => markPresence(token, setButton)}
        title='marcar presença'
        state={button}
      />
      <Button
        onPress={reset}
        title='reset credentials'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
});