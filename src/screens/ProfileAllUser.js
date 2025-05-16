import React, { useEffect } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Avatar, Button, Icon, Text } from 'react-native-paper';
import { logout, useMyContextController } from '../store';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileAllUser({ navigation }) {
  const [controller, dispatch] = useMyContextController();
  const route = useRoute();
  const { fullname, role, email, phone } = route.params;
  const { userLogin } = controller;
  const USERS = firestore().collection('USERS');

  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate('Lognin');
    }
    const showInfo = USERS.doc(email).onSnapshot(doc => {
      if (!doc.exists) {
        Alert.alert('User not found');
      }
    });
    return () => showInfo();
  }, [navigation, userLogin]);

  const onSubmit = () => {
    logout(dispatch);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={28} color="#ff1493" />
        <Text style={styles.backText}></Text>
      </TouchableOpacity>

      <View style={styles.containerInfo}>
        <Text style={styles.title}>Thông tin khách hàng</Text>

        <View style={styles.infoRow}>
          <Icon source="account" size={30} color="#ff1493" />
          <Text style={styles.label}>User Name:</Text>
          <Text style={styles.value}>{fullname}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon source="email" size={30} color="#ff1493" />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon source="phone" size={30} color="#ff1493" />
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon source="card-account-details-outline" size={30} color="#ff1493" />
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{role}</Text>
        </View>
      </View>

      <Button
        mode="contained"
        icon="pencil"
        style={styles.updateButton}
        onPress={() => {
          navigation.navigate('EditProfileAllUser', {
            fullname,
            email,
            phone,
            role,
          });
        }}
      >
        Chỉnh sửa
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 5,
    paddingVertical: 40,
    textAlign:'center',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  backText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },

  containerInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 32,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 24,
    textAlign: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginLeft: 8,
    width: 100,
  },

  value: {
    fontSize: 16,
    color: '#000',
    flexShrink: 1,
  },

  updateButton: {
    backgroundColor: '#ff1493',
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
});
