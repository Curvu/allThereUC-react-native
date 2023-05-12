import React from 'react';
import Login from './src/Views/Login.js';
import Main from './src/Views/Main.js'
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryLogin } from './src/Api.js';

export default App = () => {
  const [token, setToken] = useState('')

  useEffect(() => {
    AsyncStorage.getItem('@storage_Key').then(async (values) => {
      if (values != null) {
        let payload = JSON.parse(values);
        setToken(await tryLogin(payload.email, payload.password));
      }
    })
  }, []) // Runs once it's mounted (on start)

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      { token !== null ? 
        <Main token={token} setToken={setToken}/>
        :
        <Login setToken={setToken}/>
      }
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1b1b1b',
    alignItems: 'center',
    justifyContent: 'center',
  },
});