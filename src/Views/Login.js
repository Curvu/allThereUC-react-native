import { Formik } from 'formik'
import * as yup from 'yup'
import { TextInput, Button, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginValidationSchema = yup.object().shape({
  email: yup.string()
    .email("Please enter valid email")
    .required('Email Address is Required') // and must be @student.uc.pt
    .matches(/@student.uc.pt$/, 'Email must be @student.uc.pt'),
  password: yup.string()
    .required('Password is required'),
})

export default Login = ({setToken, tryLogin}) => {
  const storeData = async (value) => {
    // first try to login
    await tryLogin(value.email, value.password)
    .then((token) => {
      if (token === undefined) {
        console.log("Invalid Credentials");
        return;
      }
      // if login is successful, store data and set token state
      setToken(token);
      try {
        AsyncStorage.setItem('@storage_Key', JSON.stringify(value))
      } catch (e) {
        console.log(e); // error while saving data
      }
    })
    .catch((error) => {
      console.log(error); // error while trying to login
    })
  }

  return (
    <View style={styles.loginContainer}>
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => storeData(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              name='email'
              placeholder='Email Address'
              style={styles.textInput}
              onChangeText={handleChange('email')}
              onBlur={() => {handleBlur('email')}}
              value={values.email}
              keyboardType="email-address"
            />
            {(errors.email && touched.email) && <Text style={styles.errorText}>{errors.email}</Text>}
            <TextInput
              name='password'
              placeholder="Password"
              style={styles.textInput}
              onChangeText={handleChange('password')}
              onBlur={() => {handleBlur('password')}}
              value={values.password}
              secureTextEntry
            />
            {(errors.password && touched.password) && <Text style={styles.errorText}>{errors.password}</Text>}
            <Button onPress={handleSubmit} title="Submit" />
          </>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  loginContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    width: '100%',
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingLeft: 10,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
})