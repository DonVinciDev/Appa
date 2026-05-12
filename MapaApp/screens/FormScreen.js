import { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Image, ScrollView, Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { guardarArea } from '../services/areasStorage';

export default function FormScreen({ navigation, route }) {
    
    // Se recibe la lista de vertices desde el mapa
    const { vertices, onGuardado } = route.params;

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
        if (!nombre.trim()) {
            Alert.alert('Error', 'El nombre del área es obligatorio.');
            return;
        }

        // Se arma el objeto del area
        const nuevaArea = {
            nombre,
            comentario,
            imagen,
            vertices,
        };

        try {
            // Se guarda el area en AsyncStorage
            await guardarArea(nuevaArea);
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

            <Text style = {styles.titulo}>Nueva área de interés</Text>

            {/* Se muestra la cantidad de vertices utilizados para formar el área */}
            <View style = {styles.infoArea}>
                <Text style = {styles.infoTexto}>
                    Área definida por {vertices.length} puntos
                </Text>
            </View>

            {/* Campo para ingresar el nombre del área */}
            <Text style = {styles.label}>Nombre del área *</Text>
            <TextInput
                style = {styles.input}
                placeholder = "Ej: Parque Central"
                value = {nombre}
                onChangeText = {setNombre}
            />

            {/* Campo para ingresar un comentario adicional */}
            <Text style = {styles.label}>Comentario</Text>
            <TextInput
                style = {[styles.input, styles.inputMultilineal]}
                placeholder = "Ej: Área de juegos para niños"
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
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
    infoArea: {
        backgroundColor: '#E8F5E9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    infoTexto: { color: '#2E7D32', fontWeight: 'bold', textAlign: 'center' },
    label: { fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    inputMultilinea: { height: 100, textAlignVertical: 'top' },
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
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    botonGuardarTexto: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});