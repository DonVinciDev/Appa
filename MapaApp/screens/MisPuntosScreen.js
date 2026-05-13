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

    // Funcion que al tocar una tarjeta , se dirige a la pantalla mapa y muestra esa area
    const handleVerEnMapa = (area) => {
        navigation.navigate('Mapa', {
            // Se envia el area completa para que el mapa pueda mostrarla
            areaSeleccionada: area,
        });
    };

    // Componente individual para mostrar cada area en la lista
    const TarjetaArea = ({ area }) => (
        <TouchableOpacity
            style = {styles.tarjeta}
            onPress = {() => handleVerEnMapa(area)}
            activeOpacity = {0.7}
        >   

            {/* Si el area tiene imagen, se muestra arriba */}
            {area.imagen && (
                <Image source = {{ uri: area.imagen }} style = {styles.imagen} />
            )}

            <View style = {styles.tarjetaContenido}>

                {/* Tipo de plantacion */ }
                <View style = {styles.tipoBadge}>
                    <Text style = {styles.tipoBadgeTexto}>{area.tipoPlantacion}</Text>
                </View>

                { /* Nombre del area */ }
                <Text style = {styles.tarjetaNombre}>Nombre del área: {area.nombreArea}</Text>

                { /* Nombre del agricultor */ }
                <Text style = {styles.tarjetaNombre}>Nombre del agricultor: {area.nombreAgricultor}</Text>

                { /* Observaciones del area */ }
                {area.comentario ? (
                    <Text style = {styles.tarjetaComentario}>Observaciones: {area.comentario}</Text>
                ) : <Text style = {styles.tarjetaComentario}>No hay observaciones</Text>}

                {/* Info del area */}
                <View style = {styles.infoFila}>
                    <Text style = {styles.infoTexto}>
                        {area.vertices.length} puntos
                    </Text>
                    <Text style = {styles.infoTexto}>
                        Hectáreas: {area.hectareas}
                    </Text>
                    <Text style = {styles.infoTexto}>
                        {new Date(area.fecha).toLocaleDateString()}
                    </Text>
                </View>

                {/* Botones de accion */ }
                <View style = {styles.botonesFila}>
                    <TouchableOpacity
                        style = {styles.botonVerMapa}
                        onPress = {() => handleVerEnMapa(area)}
                    >
                        <Text style = {styles.botonVerMapaTexto}>Ver en mapa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style = {styles.botonEliminar}
                        onPress = {() => handleEliminar(area.id, area.nombre)}
                    >
                        <Text style = {styles.botonEliminarTexto}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </TouchableOpacity>
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
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        overflow: 'hidden',
    },
    imagen: { width: '100%', height: 150 },
    tarjetaContenido: { padding: 15 },

    tipoBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',  // El badge solo ocupa lo que necesita
        marginBottom: 8,
    },
    tipoBadgeTexto: { color: '#2E7D32', fontWeight: 'bold', fontSize: 12 },

    tarjetaNombre: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
    tarjetaComentario: { color: 'gray', marginTop: 4, fontSize: 14 },

    infoFila: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
        flexWrap: 'wrap',
    },
    infoTexto: { color: '#888', fontSize: 12 },

    botonesFila: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    botonVerMapa: {
        flex: 1,
        backgroundColor: '#E3F2FD',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    botonVerMapaTexto: { color: '#1565C0', fontWeight: 'bold', fontSize: 13 },
    botonEliminar: {
        flex: 1,
        backgroundColor: '#FFEBEE',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    botonEliminarTexto: { color: '#C62828', fontWeight: 'bold', fontSize: 13 },

    vacio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    vacioEmoji: { fontSize: 60, marginBottom: 15 },
    vacioTexto: { fontSize: 16, color: 'gray', marginBottom: 20, textAlign: 'center' },
    botonIrMapa: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 10 },
    botonTexto: { color: 'white', fontWeight: 'bold' },
});