import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useMyContextController} from '../store';
import {useRoute} from '@react-navigation/native';

export default function UpdateService({navigation}) {
  const route = useRoute();
  const {id} = route.params;
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;

  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const hasErrorServiceName = () => serviceName === '';
  const hasErrorPrice = () => price <= 0;

  const SERVICES = firestore().collection('SERVICES');

  useEffect(() => {
    if (!userLogin) {
      navigation.navigate('Login');
    } else {
      setIsAdmin(userLogin.role === 'admin');
    }

    const unsubscribe = SERVICES.doc(id).onSnapshot(doc => {
      if (doc.exists) {
        const service = doc.data();
        setServiceName(service.serviceName);
        setPrice(service.price);
      } else {
        Alert.alert('Service not found');
      }
    });

    return unsubscribe;
  }, [id, userLogin]);

  const handleUpdateService = () => {
    if (hasErrorServiceName() || hasErrorPrice()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ và hợp lệ!');
      return;
    }

    SERVICES.doc(id)
      .update({
        serviceName,
        price,
        updatedBy: userLogin.fullname,
      })
      .then(() => {
        Alert.alert('Update success!');
        navigation.goBack();
      })
      .catch(e => Alert.alert('Update failed', e.message));
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <Text style={styles.text}>Service name: </Text>
      <TextInput
        style={styles.inputText}
        label="Input a new service"
        value={serviceName}
        onChangeText={setServiceName}
        underlineColor="transparent"
      />
      <HelperText type="error" visible={hasErrorServiceName()}>
        Service name not empty
      </HelperText>

      <Text style={styles.text}>Price: </Text>
      <TextInput
        keyboardType="numeric"
        style={styles.inputText}
        label="Input price"
        value={price}
        onChangeText={setPrice}
        underlineColor="transparent"
      />
      <HelperText type="error" visible={hasErrorPrice()}>
        Price must be greater than 0
      </HelperText>

      {isAdmin && (
        <Button
          style={styles.button}
          mode="contained"
          onPress={handleUpdateService}>
          Update
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputText: {
    backgroundColor: 'none',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 10,
  },
  button: {
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#ff1493',
  },
});
