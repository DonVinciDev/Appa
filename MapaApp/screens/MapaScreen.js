import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { obtenerAreas } from '../services/areasStorage';

export default function MapaScreen({ navigation }) {

    // Estados //

    // Ubucacion inicial del mapa
    const [ubicacion, setUbicacion] = useState(null);

    // Lista de areas guardadas (poligonos completos)
    const [areas, setAreas] = useState([]);

    // Vertices del area que el usuario esta diujando
    // Cada vez que toca el mapa, se agrega un punto aqui
    const [verticesActuales, setVerticesActuales] = useState([]);

    // Modo dibujo: true si el usuario esta creando un area. false si solo esta viendo el mapa
    const [modoDibujo, setModoDibujo] = useState(false);


    // Efectos //
    
    // Pedir ubicacion al cargar la pantalla
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Se necesita permiso de ubicación.');
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            setUbicacion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    // Ek useFocusEffect se ejecuta cada vez que esta pantalla se vuelve activa
    // lo cual ayuda para refresacar la lista cuando se vuelve desde el formulario
    useFocusEffect(
        useCallback(() => {
            cargarAreas();
        }, [])
    );

    // Funcion para cargar las areas desde AsyncStorage
    const cargarAreas = async () => {
        const areasGuardadas = await obtenerAreas();
        setAreas(areasGuardadas);
    };


    // Acciones del usuario //

    // Cuando el usuairo toca el mapa
    const handleToqueMapa = (event) => {
        // Solo se agregan vertices si estamos en modo dibujo
        if (!modoDibujo) return;

        const { coordinate } = event.nativeEvent;

        // Se agrega el nuevo vertice al array existente
        // Esto copia los actuales y añade el nuevo
        setVerticesActuales([...verticesActuales, coordinate]);
    };

    // Empezar a dibujar un nuevo area
    const iniciarDibujo = () => {
        setModoDibujo(true);
        setVerticesActuales([]); // Se limpia cualquier vertice anterior
    };

    // Cancelar el dibujo actual
    const cancelarDibujo = () => {
        setModoDibujo(false);
        setVerticesActuales([]);
    };

    // Quitar el ultimo vertice agregado en caso de error por el usuario
    const deshacerUltimo = () => {
        // .slice(0, -1) devuelve el array sin el ultimo elemento
        setVerticesActuales(verticesActuales.slice(0, -1));
    };

    // Ir al formulario para guardar el area
    const guardarArea = () => {
        // Validacion que verifica al menos 3 puntos para formar el poligono
        if (verticesActuales.length < 3) {
            Alert.alert(
                'Faltan puntos',
                'Necesitas al menos 3 puntos para crear un área.'

            );
            return;
        }

        navigation.navigate('Formulario', {
            vertices: verticesActuales,
            // Callback que se ejecuta cuando el usuario termina de guardar
            onGuardado: () => {
                setModoDibujo(false);
                setVerticesActuales([]);
                cargarAreas(); // Recarga las areas para que aparezca la nueva
            },
        });
    };


    // Render //

    if (!ubicacion) {
        return (
            <View style={styles.cargando}>
                <Text> Cargando mapa...</Text>
            </View>
        );
    }

    return (
        <View style = {styles.contenedor}>
            
            <MapView
                style = {styles.mapa}
                initialRegion = {ubicacion}
                onPress = {handleToqueMapa}
            >

                {/* Areas ya guardadas */}
                {areas.map((area) => (
                    <Polygon
                        key = {area.id}
                        coordinates = {area.vertices} // El array de puntos que forman el poligono
                        fillColor = "rgba(76, 175, 80, 0.3)" // Verde medio transparente
                        stokeColor = "#4CAF50" // Verde solido para el borde
                        strokeWidth = {2}
                    />
                ))}

                {/* Area que se esta dibujando */}
                {verticesActuales.length >= 3 && (
                    <Polygon
                        coordinates = {verticesActuales}
                        fillColor = "rgba(255, 152, 0, 0.3)" // Naranja medio transparente
                        strokeColor = "#FF9800" // Naranja solido para el borde
                        strokeWidth = {2}
                    />
                )}

                {/* Puntos que se van agregando mientras se dibuja el area */}
                {verticesActuales.map((vertice, index) => (
                    <Marker
                        key = {index}
                        coordinate = {vertice}
                        title = {'Punto ' + (index + 1)}
                        pinColor= 'orange'
                    />
                ))}

            </MapView>

            {/* Controles superpuestos al mapa */}

            {/* Si no esta en modo dibujo, muestra el boton para empezar */ }
            {!modoDibujo && (
                <TouchableOpacity style = {styles.botonFlotante} onPress = {iniciarDibujo}>
                    <Text style = {styles.botonTexto}>Dibujar área</Text>
                </TouchableOpacity>
            )}

            {/* Si esta en modo dibujo, muestra los botones de acciones */ }
            {modoDibujo && (
                <View style = {styles.panelDibujo}>

                    {/* Contador de puntos */ }
                    <Text style = {styles.contador}>
                        Puntos: {verticesActuales.length}
                        {verticesActuales.length < 3 && ' (Necesitas al menos 3)'}
                    </Text>

                    <Text style = {styles.instruccion}>
                        Toca el mapa para agregar puntos.
                    </Text>

                    {/* Fila de botones */ }
                    <View style = {styles.botonesFila}>

                        <TouchableOpacity
                            style = {[styles.botonPequeno, styles.botonGris]}
                            onPress = {cancelarDibujo}
                        >
                            <Text style = {styles.botonTextoBlanco}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style = {[styles.botonPequeno, styles.botonGris]}
                            onPress = {deshacerUltimo}
                            disabled = {verticesActuales.length === 0} // Deshabilitado si no hay puntos
                        >
                            <Text style = {styles.botonTextoBlanco}>Deshacer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style = {[
                                styles.botonPequeno,
                                // Su hay 3 o mas puntos el boton verde estará activo, sinó estará gris y deshabilitado
                                verticesActuales.length >= 3 ? styles.botonVerde : styles.botonGris,
                            ]}
                            onPress = {guardarArea}
                            disabled = {verticesActuales.length < 3}
                        >
                            <Text style = {styles.botonTextoBlanco}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { flex: 1 },
    mapa: { flex: 1 },
    cargando: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    botonFlotante: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 30,
        elevation: 5,
    },
    botonTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    panelDibujo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
    },
    contador: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2c3e50',
    },
    instruccion: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 5,
        marginBottom: 15,
    },
    botonesFila: {
        flexDirection: 'row',     // Coloca los hijos en fila horizontal
        justifyContent: 'space-between',
        gap: 8,
    },
    botonPequeno: {
        flex: 1,                  // Cada botón ocupa el mismo espacio
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    botonGris: { backgroundColor: '#757575' },
    botonVerde: { backgroundColor: '#4CAF50' },
    botonDeshabilitado: { backgroundColor: '#bdbdbd' },
    botonTextoBlanco: { color: 'white', fontWeight: 'bold' },
});