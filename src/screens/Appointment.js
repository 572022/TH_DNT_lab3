import React, {useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useMyContextController} from '../store';
import {useRoute} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';

export default function Appointment({navigation}) {
  const cAPPOINTMENT = firestore().collection('APPOINTMENTS');
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const [appointmetLst, setAppointmentLst] = React.useState([]);


  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate('Login');
      return;
    }
    
    const list = cAPPOINTMENT
      .where('email', '==', userLogin.email)
      .onSnapshot(async response => {
        const newArr = [];
        for (const doc of response.docs) {
          const appointmentData = doc.data();
          const serviceDocRef = firestore()
            .collection('SERVICES')
            .doc(appointmentData.serviceId);

          const serviceDoc = await serviceDocRef.get();
          if (serviceDoc.exists) {
            const serviceData = serviceDoc.data();
            const appointmentWithServiceName = {
              ...appointmentData,
              service: serviceData.serviceName,
            };
            newArr.push(appointmentWithServiceName);
          }
        }
        setAppointmentLst(newArr);
      });
    return () => list();
  }, [userLogin]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('AppointmentDetail', {id: item.id})}>
        <View style={{...styles.borderFlatlst, flexDirection: 'row'}}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'column',
              padding: 5,
              marginLeft: 5,
              marginRight: 5,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                User name:{' '}
              </Text>
              <Text style={{fontSize: 18}}>{item.customerId}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                Service name:{' '}
              </Text>
              <Text style={{fontSize: 18}}>{item.service}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Date: </Text>
              <Text style={{fontSize: 18}}>
                {item.datetime.toDate().toLocaleString()}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              left: 59,
            }}>
            <IconButton
              icon={
                item.complete ? 'check-circle' : 'checkbox-blank-circle-outline'
              }
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={appointmetLst}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  borderFlatlst: {
    borderWidth: 1,
    borderColor: 'grey',
    marginBottom: 10,
    margin: 10,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});