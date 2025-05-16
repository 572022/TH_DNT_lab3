import React from 'react';
import {View, Button} from 'react-native';
import {Icon, IconButton, Text} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RouterService from '../routers/RouterService';
// import 'react-native-gesture-handler';
import Transaction from './Transaction';
import Setting from './Setting';
import Appointment from './Appointment';

const Tab = createBottomTabNavigator();
const Customer=()=>{
    return (
        <Tab.Navigator initialRouteName="RouterServices">
          <Tab.Screen
            name="RouterServices"
            component={RouterService}
            options={{
              headerShown: false,
              tabBarLabel: 'Home',
              tabBarIcon: () => <Icon source="home" color="#ff1493" size={26} />,
              tabBarLabelStyle: {color: '#ff1493', fontSize: 13},
            }}
          />
          <Tab.Screen
            name="Appointment"
            component={Appointment}
            options={{
              tabBarLabel: 'Appointment',
              headerStyle: {backgroundColor: '#ff1493'},
              headerTitleStyle: {color: 'white'},
              tabBarIcon: () => <Icon source="cash" color="#ff1493" size={26} />,
              tabBarLabelStyle: {color: '#ff1493', fontSize: 13},
            }}
          />
          <Tab.Screen
            name="Setting"
            component={Setting}
            options={{
              tabBarLabel: 'Setting',
              headerStyle: {backgroundColor: '#ff1493'},
              headerTitleStyle: {color: 'white'},
              tabBarIcon: () => <Icon source="cog" color="#ff1493" size={26} />,
              tabBarLabelStyle: {color: '#ff1493'},
            }}
          />
        </Tab.Navigator>
      );
}
export default Customer;