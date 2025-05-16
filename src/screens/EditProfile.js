import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useMyContextController} from '../store';

const EditProfile = ({navigation}) => {
  const [controller] = useMyContextController();
  const {userLogin} = controller;

  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const USERS = firestore().collection('USERS');

  useEffect(() => {
    if (!userLogin) {
      navigation.navigate('Login');
      return;
    }

    const unsubscribe = USERS.doc(userLogin.email).onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        setFullname(data.fullname || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setPassword(data.password || '');
      } else {
        Alert.alert('User not found');
      }
    });

    return () => unsubscribe();
  }, [userLogin]);

  const updateInfo = () => {
    USERS.doc(userLogin.email)
      .update({
        fullname,
        phone,
        address,
        password,
      })
      .then(() => {
        Alert.alert('Cập nhật thành công!');
      })
      .catch(error => {
        console.error('Update failed: ', error);
        Alert.alert('Lỗi khi cập nhật thông tin');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa thông tin</Text>

      <TextInput
        style={styles.input}
        label="Họ và tên"
        value={fullname}
        onChangeText={setFullname}
      />
      <TextInput
        style={styles.input}
        label="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        label="Địa chỉ"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button mode="contained" style={styles.button} onPress={updateInfo}>
        Cập nhật
      </Button>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ff1493',
    paddingVertical: 5,
    borderRadius: 10,
  },
});
