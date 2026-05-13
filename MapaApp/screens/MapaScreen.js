import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';

import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

import { obtenerAreas } from '../services/areasStorage';

export default function MapaScreen({ navigation, route }) {

    // Estados //

    // Referencia al MapView para poder controlarlo
    const mapaRef = useRef(null);

    // Ubucacion inicial del mapa
    const [ubicacion, setUbicacion] = useState(null);

    // Lista de areas guardadas (poligonos completos)
    const [areas, setAreas] = useState([]);

    // Vertices del area que el usuario esta diujando
    // Cada vez que toca el mapa, se agrega un punto aqui
    const [verticesActuales, setVerticesActuales] = useState([]);

    // Modo dibujo: true si el usuario esta creando un area. false si solo esta viendo el mapa
    const [modoDibujo, setModoDibujo] = useState(false);

    // Area seleccionada que viene desde MisPuntosScreen para mostrarla en el mapa
    const [areaSeleccionada, setAreaSeleccionada] = useState(null);
    // Efectos //
    
    // Pedir ubicacion al cargar la pantalla
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
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

    
    // Cargar el area seleccionada //
    useEffect(() => {
        // route.params?.areaSeleccionada = si existe route.params y tiene areaSeleccionada, se asigna a esta variable, sino es undefined
        if (route.params?.areaParaMostrar) {
            const area = route.params.areaSeleccionada;
            setAreaSeleccionada(area);

            // Calcualr el centro del poligono para centrar el mapa
            const centro = calcularCentro(area.vertices);

            // Centrar el mapa en el area seleccionada
            // el mapRef.current da acceso al componente MapView para poder controlarlo
            if (mapaRef.current) {
                mapaRef.current.animateToRegion({
                    ...centro,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 1000); // Animacion de 1 segundo
            }
        }
    }, [route.params?.areaSeleccionada]); // Se ejecuta cuando cambia de area


    // Cargar areas al enfocar //
    useFocusEffect(
        useCallback(() => {
            cargarAreas();
        }, [])
    );

    const cargarAreas = async () => {
        const areasGuardadas = await obtenerAreas();
        setAreas(areasGuardadas);
    };


    // Calcular centro del poligono //

    // Promedia todas las latitudes y longitudes de los vertices para obtener un punto central aproximado
    const calcularCentro = (vertices) => {
        const sumaLat = vertices.reduce((sum, v) => sum + v.latitude, 0);
        const sumaLng = vertices.reduce((sum, v) => sum + v.longitude, 0);
        return {
            latitude: sumaLat / vertices.length,
            longitude: sumaLng / vertices.length,
        };
    };


    // Acciones del usuario //

    // Cuando el usuairo toca el mapa
    const handleToqueMapa = (event) => {
        // Solo se agregan vertices si estamos en modo dibujo
        if (!modoDibujo) return;

        // Obtiene coordenadas del toque en el mapa
        const { coordinate } = event.nativeEvent;

        // Se agrega el nuevo vertice al array existente
        // Esto copia los actuales y añade el nuevo
        setVerticesActuales([...verticesActuales, coordinate]);
    };

    // Empezar a dibujar un nuevo area
    const iniciarDibujo = () => {
        setAreaSeleccionada(null); // Se limpia cualquier area seleccionada para mostrar el mapa vacio
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
            Alert.alert('Faltan puntos', 'Necesitas al menos 3 puntos para crear un área.');
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
                ref = {mapaRef}
                style = {styles.mapa}
                initialRegion = {ubicacion} // Centra el mapa en la ubicacion del usuario
                onPress = {handleToqueMapa} // Cada vez que se toca el mapa, se llama a esta funcion para agregar un vertice si estamos en modo dibujo
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

                {/* Area seleccionada desde MisPuntosScreen */}
                {areaSeleccionada && (
                    <Polygon
                        coordinates = {areaSeleccionada.vertices}
                        fillColor = "rgba(25, 118, 210, 0.3)" // Azul
                        strokeColor = "#1976D2" // Azul solido para el borde
                        strokeWidth = {3} // Un borde mas grueso para destacar el area seleccionada
                    />
                )}

                {/* Area que se esta dibujando y solo se dibuja si hay al menos 3 puntos */}
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

            {/* Info del area seleccionada */}
            {areaSeleccionada && !modoDibujo && (
                <View style = {styles.panelAreaSeleccionada}>
                    <Text style = {styles.panelTipo}>{areaSeleccionada.tipoPlantacion}</Text>
                    <Text style = {styles.panelNombre}>{areaSeleccionada.nombreAgricultor}</Text>
                    <Text style = {styles.panelInfo}> {areaSeleccionada.vertices.length} puntos | {areaSeleccionada.hectareas} ha</Text>
                
                    {/* Boton para cerrar el panel */ }
                    <TouchableOpacity onPress = {() => setAreaSeleccionada(null)}>
                        <Text style = {styles.panelCerrar}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            )}


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

    // Panel info del área seleccionada (aparece en la parte superior del mapa)
    panelAreaSeleccionada: {
        position: 'absolute',
        top: 15,
        left: 15,
        right: 15,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        elevation: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#1976D2',  // Línea azul a la izquierda
    },
    panelTipo: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 4,
    },
    panelNombre: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    panelInfo: { color: 'gray', fontSize: 13, marginBottom: 8 },
    panelCerrar: {
        color: '#1976D2',
        fontWeight: 'bold',
        textAlign: 'right',
    },

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    botonPequeno: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    botonGris: { backgroundColor: '#757575' },
    botonVerde: { backgroundColor: '#4CAF50' },
    botonDeshabilitado: { backgroundColor: '#bdbdbd' },
    botonTextoBlanco: { color: 'white', fontWeight: 'bold' },
});