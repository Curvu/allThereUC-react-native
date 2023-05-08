import React from 'react';
import Login from './src/Views/Login.js';
import Main from './src/Views/Main.js'
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// force white background on android

export default App = () => {
  const [token, setToken] = useState(null)

  const tryLogin = async (email, password) => {
    console.log(email)
    let payload = {
      "email": email,
      "password": password,
      "longLivedToken": false,
    }
    return await axios.post('https://id.fw.uc.pt/v1/login', payload)
    .then(response => response.data.token)
    .catch(error => undefined);
  }

  useEffect(() => {
    AsyncStorage.getItem('@storage_Key').then((values) => {
      if (values != null) {
        let payload = JSON.parse(values);
        tryLogin(payload.email, payload.password).then((token) => {
          setToken(token);
        })
      }
    })
  }, []) // Runs once it's mounted (on start)

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      { token !== null ? 
        <Main token={token} setToken={setToken}/>
        :
        <Login setToken={setToken} tryLogin={tryLogin}/>
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