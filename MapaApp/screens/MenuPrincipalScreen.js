import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function MenuPrincipal({ navigation }) {
    return (
        <View style={styles.contenedor}>

        {/* Título y logo de la app */}
        <View style={styles.encabezado}>
            <Text style={styles.emoji}>🗺️</Text>
            <Text style={styles.titulo}>MapaApp</Text>
            <Text style={styles.subtitulo}>Descubre y comparte lugares</Text>
        </View>

        {/* Botones del menú */}
        <View style={styles.botones}>

            {/* Botón 1: Iniciar sesión */}
            <TouchableOpacity
            style={[styles.boton, styles.botonPrimario]}
            onPress={() => navigation.navigate('Login')}
            >
            <Text style={styles.botonTexto}>Iniciar sesión</Text>
            </TouchableOpacity>

            {/* Botón 2: Ver el mapa */}
            <TouchableOpacity
            style={[styles.boton, styles.botonSecundario]}
            onPress={() => navigation.navigate('Mapa')}
            >
            <Text style={styles.botonTextoSecundario}>Ver mapa</Text>
            </TouchableOpacity>

            {/* Botón 3: Ver mis puntos de interés */}
            <TouchableOpacity
            style={[styles.boton, styles.botonSecundario]}
            onPress={() => navigation.navigate('MisPuntos')}
            >
            <Text style={styles.botonTextoSecundario}>Mis puntos</Text>
            </TouchableOpacity>

        </View>

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
        marginBottom: 60,
    },
    emoji: {
        fontSize: 70,
        marginBottom: 10,
    },
    titulo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subtitulo: {
        fontSize: 16,
        color: 'gray',
        marginTop: 5,
    },
    botones: {
        gap: 15,
    },
    boton: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    botonPrimario: {
        backgroundColor: '#4CAF50',
        elevation: 3,
    },
    botonSecundario: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    botonTexto: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
    },
    botonTextoSecundario: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 17,
    },
});