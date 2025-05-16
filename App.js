import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/routers/Router';
import { MyContextControllerProvider } from './src/store'; 

export default function App() {
  return (
    <MyContextControllerProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </MyContextControllerProvider>
  );
}
