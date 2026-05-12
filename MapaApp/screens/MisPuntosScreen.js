import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { obtenerAreas, eliminarArea } from '../services/areasStorage';

export default function MisPuntosScreen({ navigation }) {

    const [areas, setAreas] = useState([]);

    // Cada vez que se entra a esta pantalla, se cargan las areas guardadas
    useFocusEffect(
        useCallback(() => {
            cargarAreas();
        }, [])
    );

    const cargarAreas = async () => {
        const datos = await obtenerAreas();
        setAreas(datos);
    };

    // Confirmar y eliminar un area
    const handleEliminar = (id, nombre) => {
        Alert.alert(
            'Eliminar área',
            '¿Seguro que quiere eliminar el área ' + nombre + '?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await eliminarArea(id);
                        cargarAreas();
                    },
                },
            ]
        );
    };

    // Componente individual para mostrar cada area en la lista
    const TarjetaArea = ({ area }) => (
        <View style={styles.tarjeta}>

            {/* Si el area tiene imagen, se muestra arriba */}
            {area.imagen && (
                <Image source = {{ uri: area.imagen }} style = {styles.imagen} />
            )}

            <View style = {styles.tarjetaContenido}>
                <Text style = {styles.tarjetaNombre}>{area.nombre}</Text>

                {area.comentario ? (
                    <Text style = {styles.tarjetaComentario}>{area.comentario}</Text>
                ) : null}

                <Text style = {styles.tarjetaInfo}>
                    {area.vertices.length} puntos º {new Date(area.fecha).toLocaleDateString()}
                </Text>

                <TouchableOpacity
                    style = {styles.botonEliminar}
                    onPress = {() => handleEliminar(area.id, area.nombre)}
                >
                    <Text style = {styles.botonEliminarTexto}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style = {styles.contenedor}>
            {areas.length === 0 ? (
                <View style = {styles.vacio}>
                    <Text style = {styles.vacioTexto}>Aún no tienes áreas creadas.</Text>
                    <TouchableOpacity
                        style = {styles.botonIrMapa}
                        onPress = {() => navigation.navigate('Mapa')}
                    >
                        <Text style = {styles.botonTexto}>Ir al mapa a crear una</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data = {areas}
                    keyExtractor = {(item) => item.id}
                    renderItem = {({ item }) => <TarjetaArea area = {item} />}
                    contentContainerStyle = {{ padding: 16 }}
                />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: '#f5f5f5' },
    tarjeta: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
        overflow: 'hidden', // Para que la imagen respete los bordes redondeados
    },
    imagen: { width: '100%', height: 150 },
    tarjetaContenido: { padding: 15 },
    tarjetaNombre: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
    tarjetaComentario: { color: 'gray', marginTop: 4 },
    tarjetaInfo: { color: '#aaa', fontSize: 12, marginTop: 8 },
    botonEliminar: {
        marginTop: 12,
        backgroundColor: '#ffebee',
        padding: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    botonEliminarTexto: { color: '#c62828', fontWeight: 'bold' },
    vacio: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    vacioTexto: { fontSize: 16, color: 'gray', marginBottom: 20 },
    botonIrMapa: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 10 },
    botonTexto: { color: 'white', fontWeight: 'bold' },
});