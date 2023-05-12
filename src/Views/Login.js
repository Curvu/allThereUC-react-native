import { Formik } from 'formik'
import * as yup from 'yup'
import { TextInput, Text, View, StyleSheet, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShakeButton from '../Components/ShakeButton.js';
import { tryLogin } from '../Api.js';

const loginSchema = yup.object().shape({
  email: yup.string()
    .email('Invalid email')
    .required('Email address is required') // and must be @student.uc.pt
    .matches(/@student.uc.pt$/, 'Email must end with @student.uc.pt'),
  password: yup.string()
    .required('Password is required')
});

const shakeAnimation = new Animated.Value(0);
const startShake = () => {
  Animated.sequence([
    Animated.timing(shakeAnimation, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimation, {
      toValue: -10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimation, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};

export default Login = ({setToken}) => {
  const storeData = async (value) => {
    // first try to login
    const token = await tryLogin(value.email, value.password);
    if (token === '') {
      console.log("Invalid Credentials");
      startShake();
      return
    } else {
      try {
        // if login is successful, store data and set token state
        AsyncStorage.setItem('@storage_Key', JSON.stringify(value))
        setToken(token);
      } catch (e) {
        console.log('Error', e); // error while saving data
        startShake();
      }
    }
  }

  return (
    <View style={styles.loginContainer}>
      <Formik
        validationSchema={loginSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => storeData(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              name='email'
              placeholder='email@student.uc.pt'
              placeholderTextColor={'gray'}
              style={[styles.textInput, (errors.email && touched.email) && styles.errorInput]}
              onChangeText={handleChange('email')}
              onBlur={() => {handleBlur('email')}}
              value={values.email}
              keyboardType='email-address'
              caretHidden={false}
              autoCapitalize='none'
            />
            <Text style={[styles.errorText, (errors.email && touched.email) && {opacity: 1}]}>{errors.email}</Text>
            <TextInput
              name='password'
              placeholder="Password"
              placeholderTextColor={'gray'}
              style={[styles.textInput, (errors.password && touched.password) && styles.errorInput]}
              onChangeText={handleChange('password')}
              onBlur={() => {handleBlur('password')}}
              value={values.password}
              caretHidden={false}
              secureTextEntry
            />
            <Text style={[styles.errorText, (errors.password && touched.password) && {opacity: 1}]}>{errors.password}</Text>
            <ShakeButton _onPress={handleSubmit} title='Login' shakeAnimation={shakeAnimation}/>
            <Text style={{fontSize: 10, color: 'gray', marginTop: 10}}>Made by: Filipe Rodrigues</Text>
          </>
        )}
      </Formik>
    </View>
  )
}

getHeigth = Dimensions.get('window').height;

const styles = StyleSheet.create({
  loginContainer: {
    position: 'absolute',
    top: getHeigth/2 - 100,
    height: 200,
    width: '80%',
    alignItems: 'center',
    padding: 10,
    elevation: 10,
    backgroundColor: '#2d2d2d',
    color: 'white',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  textInput: {
    height: 40,
    width: '100%',
    color: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingLeft: 10,
  },
  errorText: {
    padding: 5,
    fontSize: 10,
    color: 'red',
    opacity: 0,
  },
  errorInput: {
    borderColor: 'red',
  }
})