/* eslint-disable react-native/no-inline-styles */
import {Alert, StyleSheet, View, Image} from 'react-native';
import {Button, Text, TextInput, HelperText} from 'react-native-paper';
import React from 'react';
import auth from '@react-native-firebase/auth';
import '@react-native-firebase/app';
import { signup } from '../store';

function Register({navigation}) {
  const [email, setEmail] = React.useState('');

  const [pass, setPass] = React.useState('');

  const [fullname, setFullname] = React.useState('');

  const [phone, setPhone] = React.useState('');

  const [showPassword, setShowPassword] = React.useState(false);
  const [errorEmail, setErrorEmail] = React.useState('');
  const [errorPass, setErrorPass] = React.useState('');
  const [errorFullname, setErrorFullname] = React.useState('');
  // const [errorconfirmpass, setErrorConfirmpass] = React.useState('');
  const [errorphone, setErrorPhone] = React.useState('');
  const handleCreateAccount = () => {
    const role = 'customer';
    let regEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(regEmail)) {
      setErrorEmail('Invalid Email Address');
    } else if (fullname === '') {
      setErrorFullname('Invalid fullname');
    } else if (pass.length < 6) {
      setErrorPass('Password need 6 keywords or more');
    } else if (phone ==='') {
      setErrorPhone('Invalid phone');
    } else{
      signup(email, pass, fullname, phone, role);
      navigation.goBack();
    }
    
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerName}>Register</Text>
      <TextInput
        style={styles.textInput}
        label={'Email'}
        value={email}
        onChangeText={setEmail}
        underlineColor="transparent"
        underlineStyle={0}
      />
       {errorEmail && <HelperText type="error">{errorEmail}</HelperText>}
      <TextInput
        style={styles.textInput}
        secureTextEntry={!showPassword}
        label={'Password'}
        value={pass}
        onChangeText={setPass}
        underlineColor="transparent"
        underlineStyle={0}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      {errorPass && <HelperText type="error">{errorPass}</HelperText>}
      <TextInput
        style={styles.textInput}
        label={'Full Name'}
        value={fullname}
        onChangeText={setFullname}
        underlineColor="transparent"
        underlineStyle={0}
      />
      {errorFullname && <HelperText type="error">{errorFullname}</HelperText>}
      <TextInput
        style={styles.textInput}
        label={'Phone'}
        value={phone}
        onChangeText={setPhone}
        underlineColor="transparent"
        underlineStyle={0}
      />
      {errorphone && (
        <HelperText type="error">{errorphone}</HelperText>
      )}
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleCreateAccount}>
        Create account
      </Button>
      <View style={{flexDirection: 'row'}}>
        <Button onPress={() => navigation.navigate('Login')}>
          Login account
        </Button>
      </View>
    </View>
  );
}
export default Register;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#dcdcdc',
    padding: 30,
  },
  headerName: {
    alignSelf: 'center',
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF1493',
  },

  textInput: {
    marginBottom: 10,
    backgroundColor: 'none',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
  },

  button: {
    borderRadius: 10,
    marginTop: 20,
    padding: 5,
    backgroundColor: '#ff1493',
  },
});