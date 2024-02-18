import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const PokeApi = () => {
    // Estado para almacenar los datos del Pokémon
    const [pokemonData, setPokemonData] = useState(null);
    // Estado para controlar el estado de carga
    const [loading, setLoading] = useState(true);
    // Estado para almacenar el ID del Pokémon ingresado
    const [pokemonIdInput, setPokemonIdInput] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    // Función para obtener datos del Pokémon desde la API
    const fetchData = async (id) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id || getRandomInt(1, 809)}`);
            const data = await response.json();
            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);
            const speciesData = await speciesResponse.json();

            // Almacena los datos del Pokémon en el estado
            setPokemonData({
                id: data.id,
                imgCvg: data.sprites.front_default,
                nombre: data.name,
                hp: data.stats[0].base_stat,
                ataque: data.stats[1].base_stat,
                defensa: data.stats[2].base_stat,
                especial: data.stats[3].base_stat,
                descripcion: obtenerDescripcion(speciesData, 'es'),
            });
            // Cambiando "setLoading" a falso cuando ya se haya terminado de cargar los datos
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Pokemon data:', error);
        }
    };

    // Función para obtener la descripción del Pokémon en español
    const obtenerDescripcion = (speciesData, language) => {
        const description = speciesData.flavor_text_entries.find(entry => entry.language.name === language);
        return description ? description.flavor_text : 'No hay descripción disponible.';
    };

    // Función para manejar la búsqueda del Pokémon
    const handleSearch = () => {
        const id = parseInt(pokemonIdInput);
        if (!isNaN(id) && id >= 1 && id <= 809) {
            fetchData(id);
        } else {
            alert('Ingresa un número válido entre 1 y 809');
        }
    };

    const pintarCard = (pokemon) => {
        return (
            <View key={pokemon.id} style={styles.card}>
                <Image source={{ uri: pokemon.imgCvg }} style={styles.cardImage} />
                <Text style={styles.cardText}>Nombre: {pokemon.nombre}</Text>
                <Text style={styles.cardText}>HP: {pokemon.hp}</Text>
                <Text style={styles.cardText}>Ataque: {pokemon.ataque}</Text>
                <Text style={styles.cardText}>Defensa: {pokemon.defensa}</Text>
                <Text style={styles.cardText}>Ataque Especial: {pokemon.especial}</Text>
                <Text style={styles.cardText}>{pokemon.descripcion}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null} enabled>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ingrese el número del Pokémon (1-809)"
                    keyboardType="numeric"
                    value={pokemonIdInput}
                    onChangeText={text => setPokemonIdInput(text)}
                />
                <Button title="Buscar" onPress={handleSearch} />
                <View style={styles.cardContainer}>
                    {loading ? <Text>Cargando, espere un momento...</Text> : pokemonData && pintarCard(pokemonData)}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#e64e4e',
        padding: 20,
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    cardContainer: {
        alignItems: 'center',
    },
    card: {
        marginTop: '5%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    cardImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 5,
    },
};

// Función para generar un número aleatorio entre min y max
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default PokeApi;
