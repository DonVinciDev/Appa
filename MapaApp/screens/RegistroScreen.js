import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function RegistroScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');

    const handleRegistro = () => {
        // Validaciones simples
        if (!nombre || !email || !password || !confirmar) {
        Alert.alert('Error', 'Completa todos los campos');
        return;
        }
        if (password !== confirmar) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
        }
        if (password.length < 8) {
        Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
        return;
        }

        // Proxima llamada a la API para registrar al usuario
        Alert.alert('¡Cuenta creada!', 'Ya puedes iniciar sesión', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
    };

    return (
        <ScrollView contentContainerStyle={styles.contenedor}>

        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.subtitulo}>Es gratis y solo toma un momento :D</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={setNombre}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
            style={styles.input}
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
            style={styles.input}
            placeholder="Repite tu contraseña"
            value={confirmar}
            onChangeText={setConfirmar}
            secureTextEntry
        />

        <TouchableOpacity style={styles.botonRegistro} onPress={handleRegistro}>
            <Text style={styles.botonTexto}>Crear cuenta</Text>
        </TouchableOpacity>

        {/* Link para volver al login */}
        <TouchableOpacity
            style={styles.linkLogin}
            onPress={() => navigation.goBack()}
        >
            <Text style={styles.linkTexto}>
            ¿Ya tienes cuenta? <Text style={styles.linkDestacado}>Inicia sesión</Text>
            </Text>
        </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        padding: 25,
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginTop: 10,
    },
    subtitulo: {
        color: 'gray',
        marginBottom: 25,
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
        marginBottom: 16,
        fontSize: 16,
    },
    botonRegistro: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
        elevation: 2,
    },
    botonTexto: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
    },
    linkLogin: {
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