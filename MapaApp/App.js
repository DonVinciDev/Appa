import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MenuPrincipal from './screens/MenuPrincipalScreen';
import LoginScreen from './screens/LoginScreen';
import RegistroScreen from './screens/RegistroScreen';
import MapaScreen from './screens/MapaScreen';
import MisPuntosScreen from './screens/MisPuntosScreen';
import FormScreen from './screens/FormScreen';

// Con esto se apilan las pantallas y se puede navegar entre ellas
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">

        <Stack.Screen
          name="Menu"
          component={MenuPrincipal}
          options={{ headerShown: false }} // Sin header en el menú principal
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Iniciar Sesión' }}
        />
        <Stack.Screen
          name="Registro"
          component={RegistroScreen}
          options={{ title: 'Crear Cuenta' }}
        />
        <Stack.Screen
          name="Mapa"
          component={MapaScreen}
          options={{ title: 'Mapa' }}
        />
        <Stack.Screen
          name="MisPuntos"
          component={MisPuntosScreen}
          options={{ title: 'Mis Puntos' }}
        />
        <Stack.Screen
          name="Formulario"
          component={FormScreen}
          options={{ title: 'Agregar Punto' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}