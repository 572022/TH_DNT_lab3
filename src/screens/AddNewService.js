import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useMyContextController } from '../store';

const AddNewService = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');

  const SERVICES = firestore().collection('SERVICES');

  const hasErrorServiceName = () => serviceName.trim() === '';
  const hasErrorPrice = () => Number(price) <= 0;

  const handleAddNewService = () => {
    if (hasErrorServiceName() || hasErrorPrice()) {
      Alert.alert('Validation Error', 'Please enter valid service name and price.');
      return;
    }

    SERVICES.add({
      serviceName: serviceName.trim(),
      price: Number(price),
      createBy: userLogin?.fullname || 'Unknown',
       createAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    })
      .then((response) => {
        SERVICES.doc(response.id).update({ id: response.id });
        Alert.alert('Success', 'Service added successfully.');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert('Error', 'Failed to add new service.');
      });
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={styles.text}>Service Name:</Text>
      <TextInput
        style={styles.inputText}
        label="Enter service name"
        value={serviceName}
        onChangeText={setServiceName}
        underlineColor="transparent"
      />
      <HelperText type="error" visible={hasErrorServiceName()}>
        Service name must not be empty.
      </HelperText>

      <Text style={styles.text}>Price (VND):</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.inputText}
        label="Enter price"
        value={price}
        onChangeText={setPrice}
        underlineColor="transparent"
      />
      <HelperText type="error" visible={hasErrorPrice()}>
        Price must be greater than 0.
      </HelperText>

      <Button
        style={styles.button}
        mode="contained"
        onPress={handleAddNewService}
      >
        Add
      </Button>
    </View>
  );
};

export default AddNewService;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputText: {
    backgroundColor: 'none',
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 10,
  },
  button: {
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#ff1493',
    marginTop: 10,
  },
});
