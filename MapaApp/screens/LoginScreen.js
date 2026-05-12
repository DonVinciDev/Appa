import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Por ahora se simula el login
    const handleLogin = () => {
        if (!email || !password) {
        Alert.alert('Error', 'Completa todos los campos');
        return;
        }
        // Aqui mas adelante ira la llamada a la api para autenticar al usuario
        Alert.alert('¡Bienvenido!', `Hola ${email}`);
    };

    return (
        <View style={styles.contenedor}>

        <Text style={styles.titulo}>Bienvenid@</Text>
        <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>

        {/* Campo email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />

        {/* Campo contraseña */}
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Oculta el texto como contraseña
        />

        {/* Botón login */}
        <TouchableOpacity style={styles.botonLogin} onPress={handleLogin}>
            <Text style={styles.botonLoginTexto}>Iniciar sesión</Text>
        </TouchableOpacity>

        {/* Link para ir a registro */}
        <TouchableOpacity
            style={styles.linkRegistro}
            onPress={() => navigation.navigate('Registro')}
        >
            <Text style={styles.linkTexto}>
            ¿No tienes cuenta? <Text style={styles.linkDestacado}>Regístrate aquí</Text>
            </Text>
        </TouchableOpacity>

        </View>
    );
    }

    const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        padding: 25,
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginTop: 20,
    },
    subtitulo: {
        color: 'gray',
        marginBottom: 30,
        marginTop: 5,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#2c3e50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginBottom: 18,
        fontSize: 16,
    },
    botonLogin: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
        elevation: 2,
    },
    botonLoginTexto: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
    },
    linkRegistro: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkTexto: {
        color: 'gray',
        fontSize: 15,
    },
    linkDestacado: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    });