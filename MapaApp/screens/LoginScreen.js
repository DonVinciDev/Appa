import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

import { login } from '../services/authStorage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estado para mostrar un indicador de carga mientras se procesa el login
    const [cargando, setCargando] = useState(false);

    // Manejo del login
    const handleLogin = async () => {

        if (!email.trim() || !password) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        setCargando(true); // Muesra el indicador de carga

        // Intenta el login
        const usuario = await login(email, password);

        setCargando(false); // Oculta el indicador de carga

        if (!usuario) {
            Alert.alert('Error', 'Email o contraseña incorrectos');
            return;
        }

        // Login exitoso y se navega al menú principal
        navigation.replace('Menu');
    };

    return (
        <View style={styles.contenedor}>

            <View style = {styles.encabezado}>
                <Text style={styles.titulo}>MappaCultivos</Text>
                <Text style={styles.subtitulo}>Inicia sesión con tu cuenta asignada</Text>
            </View>

            {/* Campo email */}
            <View style = {styles.formulario}>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="tu@empresa.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!cargando} // No editable mientras se carga
                />

                {/* Campo contraseña */}
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // Oculta el texto como contraseña
                    editable={!cargando}
                />

                {/* Botón login */}
                <TouchableOpacity 
                    style={styles.botonLogin, cargando && styles.botonDesactivado}
                    onPress={handleLogin}
                    disabled={cargando} // Desactiva el botón mientras se carga
                >
                    {/* Si esta cargando muestra un spinener, sino el texto */}
                    {cargando 
                        ? <ActivityIndicator color = "white" />
                        : <Text style={styles.botonLogin}>Iniciar Sesión</Text>
                    }
                </TouchableOpacity>
                
                {/* Credenciales de prueba */}
                <View style={styles.ayuda}>
                    <Text style={styles.ayudaTitulo}>Credenciales de prueba:</Text>
                    <Text style={styles.ayudaTexto}>juan@test.com | 1234</Text>
                    <Text style={styles.ayudaTexto}>maria@test.com | 1234</Text>
                    <Text style={styles.ayudaTexto}>carlos@test.com | 1234</Text>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 25,
        justifyContent: 'center',
    },
    encabezado: {
        alignItems: 'center',
        marginBottom: 40,
    },
    emoji: { fontSize: 60, marginBottom: 10 },
    titulo: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
    subtitulo: { color: 'gray', marginTop: 5 },

    formulario: { gap: 8 },

    label: { fontWeight: 'bold', color: '#2c3e50', marginTop: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 13,
        fontSize: 16,
    },

    botonLogin: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    botonDeshabilitado: { backgroundColor: '#a5d6a7' },
    botonTexto: { color: 'white', fontWeight: 'bold', fontSize: 17 },

    // Bloque de ayuda para desarrollo
    ayuda: {
        marginTop: 40,
        padding: 15,
        backgroundColor: '#FFF9C4',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#F9A825',
    },
    ayudaTitulo: { fontWeight: 'bold', color: '#F57F17', marginBottom: 5 },
    ayudaTexto: { color: '#795548', fontSize: 13 },
});