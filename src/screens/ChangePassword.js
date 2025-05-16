import React, {useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useMyContextController} from '../store';

const ChangePassword=({navigation})=> {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const [curenPassword, setCurenPassword] = React.useState('');
  const [newPassword, setNewPassWord] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    if (userLogin == null) navigation.navigate('Login');
  }, [userLogin]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const reauthenticate = curenPassword => {
    var user = auth().currentUser;
    var cred = auth.EmailAuthProvider.credential(user.email, curenPassword);
    return user.reauthenticateWithCredential(cred);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Don not match password');
      return;
    }

    reauthenticate(curenPassword)
      .then(() => {
        var user = auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            firestore()
              .collection('USERS')
              .doc(userLogin.email)
              .update({password: newPassword});
            // Navigate back only after updating Firestore
          })
          //   .then(
          //     firestore().collection('USERS').doc(userLogin.email).update({
          //       password: newPassword,
          //     }),
          //     navigation.goBack(),
          //   )
          .catch(e => console.log(e.message));
      })
      .catch(e => console.log(e.message));
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#dcdcdc',
        padding: 30,
      }}>
      <TextInput
        secureTextEntry={!showPassword}
        label={'Mật khẩu hiện tại'}
        style={styles.txtInput}
        value={curenPassword}
        onChangeText={setCurenPassword}
      />
      <TextInput
        secureTextEntry={!showPassword}
        label={'Mật khẩu mới'}
        style={styles.txtInput}
        value={newPassword}
        onChangeText={setNewPassWord}
      />
      <TextInput
        secureTextEntry={!showPassword}
        label={'Nhập lại mật khẩu mới'}
        style={styles.txtInput}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />
      <Button onPress={toggleShowPassword}>
        {showPassword ? 'Hide Password' : 'Show Password'}
      </Button>
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleChangePassword}>
        Accept
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  txtInput: {
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
export default ChangePassword;