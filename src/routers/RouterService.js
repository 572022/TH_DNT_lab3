import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../store";
import Services from "../screens/Services";
import AddNewService from "../screens/AddNewService";
import ServiceDetail from "../screens/ServiceDetail";
import Profile from "../screens/Profile";
import { IconButton } from "react-native-paper";
import {color} from 'react-native-reanimated';
import React, {useEffect} from 'react';
const Stack = createStackNavigator();
const RouterSevice = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  useEffect(() => {
    if (userLogin == null) navigation.navigate('Login');
  }, [navigation, userLogin]);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Services"
        component={Services}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: "Thông tin cá nhân",
          headerStyle: { backgroundColor: "#ff1493" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="AddNewService"
        component={AddNewService}
        options={{
          headerTitle: 'Service',
          headerStyle: {backgroundColor: '#ff1493'},
          headerTitleStyle: {color: 'white'},
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetail}
        options={{
          headerTitle: 'Service Detail',
          headerStyle: {backgroundColor: '#ff1493'},
          headerTitleStyle: {color: '#fff'},
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
  
};
export default RouterSevice;
