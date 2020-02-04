import React, { useState, useEffect } from 'react'
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api'
import { connect, disconnect } from '../services/socket'

function Main({ navigation }) {
    //Estado para armazenar os Devs
    const [devs, setDevs] = useState([])
    const [currentRegion, setCurrentRegion] = useState(null)

    //Salvando dados que o usuário digita no input
    const [techs, setTechs] = useState('')

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync()

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                })

                const { latitude, longitude } = coords

                setCurrentRegion({
                    latitude,
                    longitude,
                    //Obtendo o zoom e sua precisão
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                })
            }
        }

        loadInitialPosition()
    }, [])

    //Monitorando a variável devs, quando alterar executo subscribeToNewDevs()
    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]))
    }, [devs])

    //Regra de Negócio do socket
    function setupWebsocket() {
        disconnect()

        const { latitude, longitude } = currentRegion

        connect(
            latitude,
            longitude,
            techs,
        )
    }

    //Carregar usuários pegando minha localização atual
    async function loadDevs() {
        const { latitude, longitude } = currentRegion

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        })

        setDevs(response.data.devs)
        setupWebsocket()
    }

    function handleRegionChanged(region) {
        setCurrentRegion(region)
    }

    if (!currentRegion) {
        return null //Para ele não renderizar nada na tela
    }

    return (
    <>
        <MapView 
            onRegionChangeComplete={handleRegionChanged} 
            initialRegion={currentRegion} 
            style={styles.map}
        >
            {devs.map(dev => (
                <Marker 
                key={dev._id}
                coordinate={{ 
                    longitude: dev.location.coordinates[0],
                    latitude: dev.location.coordinates[1],
                }}
            >
                <Image 
                     style={styles.avatar} 
                     source={{ uri: dev.avatar_url }} 
                />
 
                <Callout onPress={() => {
                    //Navegação entre Telas
                    navigation.navigate('Profile', { github_username: dev.github_username })
                }}>
                    <View style={styles.callout}>
                        <Text style={styles.devName}>{dev.name}</Text>
                        <Text style={styles.devBio}>{dev.bio}</Text>
                        <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                    </View>
                </Callout>
            </Marker>
        ))}
        </MapView>
        <View style={styles.searchForm}>
            <TextInput 
                style={styles.searchInput}
                placeholder="Buscar devs por techs..."
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoCorrect={false}
                value={techs}
                onChangeText={text => setTechs(text)}
            />

            <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                <MaterialIcons name="my-location" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF',
    },

    callout: {
        width: 260,
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    devBio: {
        color: '#666',
        marginTop: 5,
    },

    devTechs: {
        marginTop: 5,
    },

    searchForm: {
        position: 'absolute',//Para ele flutuar por cima do nosso formulário.
        //Margin
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,//Para forçar ele ficar em cima do mapa.
        flexDirection: 'row',
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        //No IOS
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        //No Android
        elevation: 2,
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    }
})

export default Main