import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MenuPrincipal from './screens/MenuPrincipalScreen';
import LoginScreen from './screens/LoginScreen';
import MapaScreen from './screens/MapaScreen';
import MisPuntosScreen from './screens/MisPuntosScreen';
import FormScreen from './screens/FormScreen';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Con esto se apilan las pantallas y se puede navegar entre ellas
const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Sin header en el login
        />
        <Stack.Screen
          name="Menu"
          component={MenuPrincipal}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Mapa"
          component={MapaScreen}
          options={{ title: 'Mapa de cultivos' }}
        />
        <Stack.Screen
          name="MisPuntos"
          component={MisPuntosScreen}
          options={{ title: 'Mis áreas de cultivo registradas' }}
        />
        <Stack.Screen
          name="Formulario"
          component={FormScreen}
          options={{ title: 'Nueva área de cultivo' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}