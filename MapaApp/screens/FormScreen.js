import { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Image, ScrollView, Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { guardarArea } from '../services/areasStorage';
import { calcularHectareas } from '../utils/calcularArea';
import { obtenerSesion } from '../services/authStorage';

// Lista de tipos de plantacion disponibles
const TIPOS_PLANTACION = [
    'Papa', 'Arroz', 'Maíz', 'Trigo', 'Cebada', 'Tomate', 'Lechuga', 'Zanahoria', 'Frutilla', 'Manzana',
    'Cebolla', 'Otro'
];

export default function FormScreen({ navigation, route }) {
    
    // Se recibe la lista de vertices desde el mapa
    const { vertices, onGuardado } = route.params;

    // Calcula las hectareas al cargar el formulario
    const hectareas = calcularHectareas(vertices);

    
    // Campos del formulario
    const [nombreArea, setNombreArea] = useState(''); // Nombre del área
    const [nombreAgricultor, setNombreAgricultor] = useState(''); // Nombre del agricultor
    const [tipoPlantacion, setTipoPlantacion] = useState(''); // Tipo de plantación
    const [nombre, setNombre] = useState(''); // Nombre del area
    const [comentario, setComentario] = useState(''); // Comentario adicional
    const [imagen, setImagen] = useState(null); // URI de la imagen seleccionada

    
    // Función para seleccionar una imagen de la galería
    const seleccionarImagen = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true
        });

        if (!resultado.canceled) {
            setImagen(resultado.assets[0].uri);
        }
    };

    // Función para guardar el área
    const handleGuardar = async () => {

        if (!nombreArea.trim()) {
            Alert.alert('Error', 'El nombre del área es obligatorio.');
            return;
        }

        if (!nombreAgricultor.trim()) {
            Alert.alert('Error', 'El nombre del agricultor es obligatorio.');
            return;
        }

        if (!tipoPlantacion) {
            Alert.alert('Error', 'Debe seleccionar un tipo de plantación.');
            return;
        }

        try {

            // Obtener el usuario actual de la sesion
            const sesion = await obtenerSesion();

            // Se arma el objeto del area
            const nuevaArea = {
                nombreArea,
                nombreAgricultor,
                tipoPlantacion,
                comentario,
                imagen,
                vertices,
                hectareas,
            };


            // Se guarda el area en AsyncStorage
            await guardarArea(nuevaArea, Number(sesion.id));
            
            Alert.alert('Éxito', 'Área guardada correctamente.', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Se avisa al mapa que ya se guardó para que se recargue
                        if (onGuardado) onGuardado();
                        navigation.goBack();
                    }
                }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al guardar el área.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.contenedor}>

            <Text style = {styles.titulo}>Nueva área de cultivo</Text>

            {/* Informacion del area */}
            <View style = {styles.infoArea}>
                <View style = {styles.infoFila}>
                    <Text style = {styles.infoLabel}>Puntos marcados</Text>
                    <Text style = {styles.infoValor}>{vertices.length} puntos</Text>
                </View>

                <View style = {styles.separador} />
                
                <View style = {styles.infoFila}>
                    <Text style = {styles.infoLabel}>Área aproximada</Text>
                    {/* Si las hectareas son muy pequeñas, se muestra en m2 */}
                    <Text style = {styles.infoValorDestacado}>
                        {hectareas < 0.01 
                            ? `${Math.round(hectareas * 10000)} m²`
                            : `${hectareas} ha`
                        }
                    </Text>
                </View>
            </View>

            {/* Nombre del area */}
            <Text style = {styles.label}>Nombre del área *</Text>
            <TextInput
                style = {styles.input}
                placeholder = "Ej: Parcela de papas"
                value = {nombreArea}
                onChangeText = {setNombreArea}
            />

            {/* Nombre del agricultor */}
            <Text style = {styles.label}>Nombre del agricultor *</Text>
            <TextInput
                style = {styles.input}
                placeholder = "Ej: Juan Pérez"
                value = {nombreAgricultor}
                onChangeText = {setNombreAgricultor}
            />

            {/* Tipo de plantacion */}
            <Text style = {styles.label}>Tipo de plantación *</Text>
            <View style = {styles.tiposContenedor}>
                {TIPOS_PLANTACION.map((tipo) => (
                    <TouchableOpacity
                        key = {tipo}
                        style = {[
                            styles.tipoBadge,
                            // Su esta seleccionada, cambia el estilo
                            tipoPlantacion === tipo && styles.tipoBadgeSeleccionado
                        ]}
                        onPress = {() => setTipoPlantacion(tipo)}
                    >
                        <Text style = {[
                            styles.tipoBadgeTexto,
                            tipoPlantacion === tipo && styles.tipoBadgeTextoSeleccionado
                        ]}>
                            {tipo}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            
            {/* Campo para ingresar una observacion */}
            <Text style = {styles.label}>Observaciones</Text>
            <TextInput
                style = {[styles.input, styles.inputMultilineal]}
                placeholder = "Ej: Estado del terreno, condiciones, etc..."
                value = {comentario}
                onChangeText = {setComentario}
                multiline
                numberOfLines = {4}
            />

            {/* Botón para seleccionar una imagen */}
            <TouchableOpacity style = {styles.botonImagen} onPress = {seleccionarImagen}>
                <Text style = {styles.botonImagenTexto}>
                    {imagen ? 'Cambiar imagen' : 'Seleccionar imagen (opcional)'}
                </Text>
            </TouchableOpacity>

            {/* Vista previa de la imagen seleccionada */}
            {imagen && (
                <Image source = {{ uri: imagen }} style = {styles.preview} />
            )}

            {/* Botón para guardar el área */}
            <TouchableOpacity style = {styles.botonGuardar} onPress = {handleGuardar}>
                <Text style = {styles.botonGuardarTexto}>Guardar área</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    contenedor: { padding: 20, backgroundColor: '#fff' },
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },

    // Tarjeta de info del área
    infoArea: {
        backgroundColor: '#E8F5E9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    infoFila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    separador: {
        height: 1,
        backgroundColor: '#C8E6C9',
        marginVertical: 10,
    },
    infoLabel: { color: '#388E3C', fontSize: 14 },
    infoValor: { fontWeight: 'bold', color: '#2E7D32' },
    infoValorDestacado: { fontWeight: 'bold', color: '#2E7D32', fontSize: 18 },

    label: { fontWeight: 'bold', marginTop: 15, marginBottom: 8, color: '#2c3e50' },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    inputMultilinea: { height: 100, textAlignVertical: 'top' },

    // Selector de tipo de plantación (badges)
    tiposContenedor: {
        flexDirection: 'row',  // Los badges van en fila
        flexWrap: 'wrap',      // Si no caben, se van a la siguiente línea
        gap: 8,
    },
    tipoBadge: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,       // Forma de pastilla
        borderWidth: 1,
        borderColor: '#4CAF50',
        backgroundColor: 'white',
    },
    tipoBadgeSeleccionado: {
        backgroundColor: '#4CAF50',  // Relleno verde cuando se selecciona
    },
    tipoBadgeTexto: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    tipoBadgeTextoSeleccionado: {
        color: 'white',
    },

    botonImagen: {
        marginTop: 20,
        padding: 12,
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderRadius: 8,
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    botonImagenTexto: { color: '#4CAF50', fontWeight: 'bold' },
    preview: { width: '100%', height: 200, marginTop: 10, borderRadius: 8 },

    botonGuardar: {
        marginTop: 30,
        marginBottom: 10,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    botonGuardarTexto: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});