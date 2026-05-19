import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Modal, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { obtenerAreasPorUsuario, eliminarArea, formatearFecha } from '../services/areasStorage';
import { obtenerSesion } from '../services/authStorage';

export default function MisPuntosScreen({ navigation, route }) {

    const [areas, setAreas] = useState([]);
    const [usuario, setUsuario] = useState(null);

    // Area que se muestra en el modal al tocar una tarjeta
    const [areaDetalle, setAreaDetalle] = useState(null);

    // Cada vez que se entra a esta pantalla, se cargan las areas guardadas
    useFocusEffect(
        useCallback(() => {
            inicializar();
        }, [])
    );

    const inicializar = async () => {
        const sesion = await obtenerSesion();
        console.log('Sesion:', sesion); // Debug para saber si hay sesion correctamente
        if (!sesion) return;

        // ✅ CORREGIDO: setUsuario en lugar de setUsuarioId
        setUsuario(sesion);

        // Cargar solo las areas del usuario logueado
        const datos = await obtenerAreasPorUsuario(sesion.id);
        console.log('Areas encontradas:', datos); // Debug para saber si hay areas correctamente
        console.log('usuarioId:', sesion.id); // ✅ CORREGIDO: sesion.id en lugar de usuarioId

        setAreas(datos);

        // Si viene desde el mapa por un area especifica, se muestra el detalle de esa area
        if (route.params?.areaId) {
            const areaEncontrada = datos.find(a => a.id === route.params.areaId);
            if (areaEncontrada) setAreaDetalle(areaEncontrada);
        }

    };

    // Confirmar y eliminar un area
    const handleEliminar = (area) => {  // ✅ CORREGIDO: recibe el objeto área completo
        Alert.alert(
            'Eliminar área',
            `¿Seguro que quiere eliminar el área de "${area.nombreAgricultor}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await eliminarArea(area.id);
                        setAreaDetalle(null); // Cerrar el modal si se estaba mostrando el area eliminado
                        inicializar();
                    },
                },
            ]
        );
    };

    // Funcion que al tocar una tarjeta , se dirige a la pantalla mapa y muestra esa area
    const handleVerEnMapa = (area) => {
        setAreaDetalle(null); // Cerrar el modal si se estaba mostrando
        navigation.navigate('Mapa', {
            // Se envia el area completa para que el mapa pueda mostrarla
            areaSeleccionada: area,
        });
    };

    // Modal de detalle //

    const ModalDetalle = () => {
        if (!areaDetalle) return null;

        return (
            <Modal
                visible={!!areaDetalle} // Visible cuando hay un area seleccionada
                animationType="slide"
                transparent
                onRequestClose={() => setAreaDetalle(null)}
            >
                {/* Fondo obscuro semitransparente */}
                <TouchableOpacity
                    style={styles.modalFondo}
                    activeOpacity={1}
                    onPressOut={() => setAreaDetalle(null)} // Cerrar al tocar fuera del modal
                >
                    {/* Contenido del modal */}
                    <TouchableOpacity activeOpacity={1} style={styles.modalContenido}>

                        {/* Imagen del area si tiene */}
                        {areaDetalle.imagen && (
                            <Image source={{ uri: areaDetalle.imagen }} style={styles.modalImagen} />
                        )}

                        <ScrollView style={styles.modalScroll}>

                            {/* Encabezado con tipo de plantacion */}
                            <View style={styles.modalEncabezado}>
                                <View style={styles.tipoBadge}>
                                    <Text style={styles.tipoBadgeTexto}>🌱 {areaDetalle.tipoPlantacion}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setAreaDetalle(null)}>
                                    <Text style={styles.modalCerrar}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Filas de información */}
                            <FilaInfo icono="👤" label="Agricultor" valor={areaDetalle.nombreAgricultor} />
                            <FilaInfo icono="🌿" label="Área" valor={`${areaDetalle.hectareas} hectáreas`} />
                            <FilaInfo icono="📐" label="Vértices" valor={`${areaDetalle.vertices.length} puntos`} />
                            <FilaInfo icono="📅" label="Registrado" valor={formatearFecha(areaDetalle.createdAt)} />

                            {/* Observaciones solo si existen */}
                            {areaDetalle.comentario ? (
                                <View style={styles.observaciones}>
                                    <Text style={styles.observacionesLabel}>📝 Observaciones</Text>
                                    <Text style={styles.observacionesTexto}>{areaDetalle.comentario}</Text>
                                </View>
                            ) : null}

                            {/* Botones */}
                            <View style={styles.modalBotones}>
                                <TouchableOpacity style={styles.botonVerMapa} onPress={() => handleVerEnMapa(areaDetalle)}>
                                    <Text style={styles.botonVerMapaTexto}>🗺️ Ver en mapa</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.botonEliminar} onPress={() => handleEliminar(areaDetalle)}>
                                    <Text style={styles.botonEliminarTexto}>🗑️ Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        );
    };

    // Componente para cada fila del modal
    const FilaInfo = ({ icono, label, valor }) => (
        <View style={styles.filaInfo}>
            <Text style={styles.filaInfoLabel}>{icono} {label}</Text>
            <Text style={styles.filaInfoValor}>{valor}</Text>
        </View>
    );

    // Tarjeta de lista
    const TarjetaArea = ({ area }) => (

        // Al tocar la tarjeta se abre el modal de detalle
        <TouchableOpacity 
            style={styles.tarjeta}
            onPress={() => setAreaDetalle(area)}
            activeOpacity={0.7}
        >
            <View style={styles.tarjetaIzquierda}>
                {/* Badge tipo plantacion */}
                <View style={styles.tipoBadge}>
                    <Text style={styles.tipoBadgeTexto}>🌱 {area.tipoPlantacion}</Text>
                </View>
                <Text style={styles.tarjetaNombre}>{area.nombreAgricultor}</Text>
                <Text style={styles.tarjetaFecha}>📅 {formatearFecha(area.createdAt)}</Text>
            </View>

            {/* Info del área a la derecha */}
            <View style={styles.tarjetaDerecha}>
                <Text style={styles.tarjetaHectareas}>{area.hectareas}</Text>
                <Text style={styles.tarjetaHectareasLabel}>ha</Text>
            </View>
        </TouchableOpacity>
    );


    // Render //
    return (
        <View style={styles.contenedor}>

            {areas.length === 0 ? (
                <View style={styles.vacio}>
                    <Text style={styles.vacioEmoji}>🌾</Text>
                    <Text style={styles.vacioTexto}>No tienes áreas registradas aún</Text>
                    <TouchableOpacity style={styles.botonAgregar} onPress={() => navigation.navigate('Mapa')}>
                        <Text style={styles.botonIrMapaTexto}>Agregar nueva área</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {/* Contador de áreas */}
                    <View style={styles.headerLista}>
                        <Text style={styles.headerTexto}>
                            {areas.length} {areas.length === 1 ? 'área registrada' : 'áreas registradas'}
                        </Text>
                    </View>

                    <FlatList
                        data={areas}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <TarjetaArea area={item} />}
                        contentContainerStyle={{ padding: 15 }}
                    />
                </>
            )}

            <ModalDetalle />

        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: '#f5f5f5' },

    // Header con contador
    headerLista: {
        padding: 15,
        paddingBottom: 5,
    },
    headerTexto: { color: 'gray', fontSize: 13 },

    // Tarjeta de la lista (compacta)
    tarjeta: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 10,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },
    tarjetaIzquierda: { flex: 1 },
    tarjetaNombre: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginTop: 4 },
    tarjetaFecha: { color: '#aaa', fontSize: 12, marginTop: 4 },
    tarjetaDerecha: { alignItems: 'center', marginLeft: 10 },
    tarjetaHectareas: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
    tarjetaHectareasLabel: { fontSize: 12, color: '#4CAF50' },

    tipoBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    tipoBadgeTexto: { color: '#2E7D32', fontWeight: 'bold', fontSize: 12 },

    // Modal
    modalFondo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContenido: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    modalImagen: { width: '100%', height: 180 },
    modalScroll: { padding: 20 },
    modalEncabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalCerrar: {
        fontSize: 20,
        color: '#aaa',
        padding: 5,
    },

    // Filas de info del modal
    filaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    filaInfoLabel: { color: 'gray', fontSize: 14 },
    filaInfoValor: { fontWeight: 'bold', color: '#2c3e50', fontSize: 14 },

    observaciones: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginTop: 15,
    },
    observacionesLabel: { fontWeight: 'bold', color: '#555', marginBottom: 5 },
    observacionesTexto: { color: '#666', lineHeight: 20 },

    modalBotones: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
        marginBottom: 10,
    },
    botonVerMapa: {
        flex: 1, backgroundColor: '#E3F2FD',
        padding: 12, borderRadius: 10, alignItems: 'center',
    },
    botonVerMapaTexto: { color: '#1565C0', fontWeight: 'bold' },
    botonEliminar: {
        flex: 1, backgroundColor: '#FFEBEE',
        padding: 12, borderRadius: 10, alignItems: 'center',
    },
    botonEliminarTexto: { color: '#C62828', fontWeight: 'bold' },

    // Pantalla vacía
    vacio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    vacioEmoji: { fontSize: 60, marginBottom: 15 },
    vacioTexto: { fontSize: 16, color: 'gray', marginBottom: 20, textAlign: 'center' },
    botonAgregar: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 10 },
    botonIrMapaTexto: { color: 'white', fontWeight: 'bold' },
});