import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Button from '../Components/Button';

const markPresence = async (token) => {
  console.log(token);
  const payload = { "type": "local" }
  let aula, session, time;

  await axios.get('https://academic.fw.uc.pt/v1/student/sessions/next', { headers: { 'authorization': token } })
  .then(response => {
    // console.log(response.data);
    aula = response.data[0].edition.key;
    time = new Date(response.data[0].start_date);
    session = response.data[0].key;
  })
  .catch(error => console.log(error));

  console.log(aula, session, time);
  // TODO: check if aula aula is ongoing
  if (time > Date.now()) {
    console.log('Aula ainda não começou');
    return;
  }
  await axios.post(`https://academic.fw.uc.pt/v1/student/class/${aula}/session/${session}/presence`, payload, { headers: { 'authorization': token, 'Content-Type': 'application/json' } })
}

export default Main = ({token, setToken}) => {
  console.log(token);
  const reset = async () => {
    AsyncStorage.clear();
    setToken(null);
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={() => markPresence(token)}
        title='marcar presença'
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
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
});