import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { obtenerSesion, logout } from '../services/authStorage';

export default function MenuPrincipal({ navigation }) {

    const [usuario, setUsuario] = useState(null);

    // Cargar el nombre del usuario desde la sesion guardada
    useEffect(() => {
        (async () => {
            const sesion = await obtenerSesion();
            setUsuario(sesion);
        })();
    }, []);

    // Manejo del logout
    const handleLogout = async () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Seguro que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        // replace() para evitar que el usuario pueda volver al menú con el botón de atrás
                        navigation.replace('Login');
                    },
                },
            ]
        );
    };

    return (
        <View style = {styles.contenedor}>

        {/* Encabezado con saludo */}
        <View style = {styles.encabezado}>
            <Text style = {styles.emoji}>🌾</Text>
            <Text style = {styles.titulo}>MappaCultivo</Text>
            
            {/* Muestra el nombre cuando ya cargo la sesión */}
            {usuario && (
                <Text style = {styles.saludo}>¡Hola, {usuario.nombre.split(' ')[0]}!</Text>
            )}
        </View>

        {/* Botones del menú */}
        <View style={styles.botones}>

            {/* Botón 1: Ver mapa */}
            <TouchableOpacity
                style={[styles.boton, styles.botonPrimario]}
                onPress={() => navigation.navigate('Mapa')}
            >
                <Text style={styles.botonTexto}>Ver mapa</Text>
            </TouchableOpacity>

            {/* Botón 2: Ver el mapa */}
            <TouchableOpacity
                style={[styles.boton, styles.botonSecundario]}
                onPress={() => navigation.navigate('MisPuntos')}
            >
                <Text style={styles.botonTextoSecundario}>Mis áreas de cultivo</Text>
            </TouchableOpacity>

        </View>

        {/* Botón de logout */}
        <TouchableOpacity style = {styles.botonLogout} onPress={handleLogout}>
            <Text style = {styles.botonLogoutTexto}>Cerrar sesión</Text>
        </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        padding: 30,
    },
    encabezado: {
        alignItems: 'center',
        marginBottom: 50,
    },
    emoji: { fontSize: 70, marginBottom: 10 },
    titulo: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50' },
    saludo: { fontSize: 16, color: 'gray', marginTop: 8 },

    botones: { gap: 15 },
    boton: { padding: 18, borderRadius: 12, alignItems: 'center' },
    botonPrimario: { backgroundColor: '#4CAF50', elevation: 3 },
    botonSecundario: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    botonTexto: { color: 'white', fontWeight: 'bold', fontSize: 17 },
    botonTextoSecundario: { color: '#4CAF50', fontWeight: 'bold', fontSize: 17 },

    botonLogout: {
        marginTop: 40,
        alignItems: 'center',
        padding: 12,
    },
    botonLogoutTexto: { color: '#e53935', fontWeight: 'bold' },
});
