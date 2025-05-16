import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Button, Icon, Text} from 'react-native-paper';
import {logout, useMyContextController} from '../store';
import firestore from '@react-native-firebase/firestore';

export default function Profile({navigation}) {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;

  const [imageAvatar, setImageAvatar] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!userLogin) {
      navigation.navigate('Login');
      return;
    }

    const loadInfo = async () => {
      try {
        const userDoc = await firestore()
          .collection('USERS')
          .doc(userLogin.email)
          .get();

        if (userDoc.exists) {
          const data = userDoc.data();
          setImageAvatar(data.image || '');
          setFullName(data.fullname || '');
          setPhone(data.phone || '');
          if (
            data.fullname !== userLogin.fullname ||
            data.phone !== userLogin.phone
          ) {
            dispatch({
              type: 'UPDATE_USER',
              payload: {
                ...userLogin,
                fullname: data.fullname,
                phone: data.phone,
              },
            });
          }
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadInfo();
  }, [userLogin, navigation, dispatch]);

  if (!userLogin) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <View style={[styles.avatarContainer, {backgroundColor: '#ff1493'}]}>
        <Avatar.Image
          size={150}
          style={styles.avatarImage}
          source={
            imageAvatar
              ? {uri: imageAvatar}
              : require('../assets/R.png')
          }
        />
      </View>

      <View style={styles.containerInfo}>
        <View style={styles.infoRow}>
          <Icon source="account" size={30} />
          <Text style={styles.label}>User Name: </Text>
          <Text style={styles.value}>{userLogin.fullname || 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon source="email" size={30} />
          <Text style={styles.label}>Email: </Text>
          <Text style={styles.value}>{userLogin.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon source="phone" size={30} />
          <Text style={styles.label}>Phone: </Text>
          <Text style={styles.value}>{phone || 'N/A'}</Text>
        </View>

        <Button
          style={styles.editButton}
          mode="contained"
          onPress={() =>
            navigation.navigate('EditProfile', {email: userLogin.email})
          }>
          Chỉnh sửa
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    height: 154,
    width: 154,
    borderColor: 'white',
    borderWidth: 2,
  },
  containerInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  value: {
    fontSize: 18,
    marginLeft: 5,
    flexShrink: 1,
  },
  editButton: {
    marginTop: 50,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ff1493',
  },
});
