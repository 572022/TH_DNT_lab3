import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';
import {useRoute, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export default function EditProfileAllUser() {
  const route = useRoute();
  const navigation = useNavigation();
  const {fullname, email, phone, role} = route.params;

  const [newFullname, setNewFullname] = useState(fullname);
  const [newPhone, setNewPhone] = useState(phone);
  const [newRole, setNewRole] = useState(role);
  const [newEmail, setNewEmail] = useState(email);

  const handleSave = async () => {
    try {
      const USERS = firestore().collection('USERS');

      if (newEmail !== email) {
        const docSnapshot = await USERS.doc(email).get();
        if (!docSnapshot.exists) {
          Alert.alert('Lỗi', 'Không tìm thấy người dùng!');
          return;
        }

        const currentData = docSnapshot.data();
        await USERS.doc(newEmail).set({
          ...currentData,
          fullname: newFullname,
          phone: newPhone,
          role: newRole,
          email: newEmail, 
        });

        await USERS.doc(email).delete();
      } else {
        await USERS.doc(email).update({
          fullname: newFullname,
          phone: newPhone,
          role: newRole,
        });
      }

      Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa thông tin</Text>

      <TextInput
        label="Họ và tên"
        value={newFullname}
        onChangeText={setNewFullname}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Email"
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Số điện thoại"
        value={newPhone}
        onChangeText={setNewPhone}
        keyboardType="phone-pad"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Vai trò"
        value={newRole}
        onChangeText={setNewRole}
        style={styles.input}
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        icon="content-save"
      >
        Lưu thay đổi
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    color: '#ff1493',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff1493',
    padding: 6,
  },
});
