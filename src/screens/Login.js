import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useMyContextController, login as loginAction } from '../store';

function Login({ navigation }) {
  const [controller, dispatch] = useMyContextController();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [errorPass, setErrorPass] = useState('');

  const { userLogin } = controller;

  useEffect(() => {
    if (userLogin != null) {
      if (userLogin.role === "admin") {
        navigation.navigate('Admin');
      } else if (userLogin.role === "customer") {
        navigation.navigate('Customer');
      }
      console.log('User login info:', userLogin);
    }
  }, [userLogin, navigation]);

  const handleLogin = () => {
    setError('');
    setErrorPass('');

    const regEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email.match(regEmail)) {
      setError('Invalid Email Address');
    } else if (pass.length < 6) {
      setErrorPass('Password must be at least 6 characters');
    } else {
      loginAction(dispatch, email, pass);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginTextl}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        underlineColor="#fff"
      />
      {error && <HelperText type="error">{error}</HelperText>}

      <TextInput
        label="Password"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={styles.input}
        underlineColor="#fff"
      />
      {errorPass && <HelperText type="error">{errorPass}</HelperText>}

      <Button
        style={styles.loginButton}
        mode="contained"
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>Login</Text>
      </Button>

      <View style={styles.footer}>
        <Button
          style={{ borderRadius: 0 }}
          textColor="blue"
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{ color: '#000' }}>Don't have an account? </Text>
          Create account
        </Button>
      </View>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
  },
  loginTextl:{
    fontSize:50,
    color:'#ff1493',
    textAlign:'center',
    marginBottom:20,
    fontWeight:'bold',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  loginButton: {
    borderRadius: 0,
    backgroundColor: '#ff1493',
    borderRadius:10,
    margin:10,
  },
  loginText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    marginBottom: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
