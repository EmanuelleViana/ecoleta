import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from "expo-constants";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { ScrollView, StyleSheet, Text, View, Image , Alert, Route} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, {Marker} from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from '../../services/api';
import axios from 'axios';
import * as Location from 'expo-location';

interface Item {
  id: number;
  title: string;
  image_url: string
}

interface Point {
  id: number;
  image: string;
  image_url: string;
  name: string,
  latitude: number,
  longitude: number,
}

interface Params {
  uf: string,
  city: string
}

const Points = () => {
  const navigation = useNavigation();
  const [items, setItems ]= useState<Item[]>([]);
  const [selectedItem, setselectedItem] = useState<number[]>([]);
  const [ initialPosition, setInitiaPosition] = useState<[number,number]>([0, 0 ]);
  const [points, setpoints] = useState<Point[]>([]);

  const route = useRoute();
  const routeParams = route.params as Params;

  useEffect(()=>{
    api.get('points', {
      params: {
        cidade: routeParams.city,
        uf: routeParams.uf,
        items: selectedItem
      }
    }).then(response =>{
      setpoints(response.data);
    })
  },[selectedItem]) 

    useEffect(() => {
        async function loadPosition() {
          //pedir pro usuario para poder acessar a localizacao dele
          const { status } = await Location.requestPermissionsAsync();

          if(status != 'granted') {
              Alert.alert('OOOPS, Precisamos da sua permissão para obter a localização')
            return;
            }

            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude} = location.coords;
            setInitiaPosition([ latitude, longitude ]);
        }

        loadPosition();
    })
    useEffect(() => {
      api.get('items').then(response => {
        setItems(response.data);
      })

    }, []);

  function handleBack() {
    navigation.goBack();
  }
  function handleNavigateToDetail(id: number) {
      navigation.navigate('Detail', { point_id: id });
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItem.findIndex(item => item === id );
    if(alreadySelected >= 0) {
      const filteredItems = selectedItem.filter(item => item !== id);
      setselectedItem(filteredItems);//mantem o que esta no array e adiciona umm id novo
    } else {
      setselectedItem([...selectedItem, id]);//mantem o que esta no array e adiciona umm id novo
    }
  }

  
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta
        </Text>

        <View style={styles.mapContainer}>
         { initialPosition[0] !== 0 && (
            <MapView 
            style={styles.map}
            loadingEnabled={ initialPosition[0] === 0}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014
        }}>
        {points.map(point => (
               <Marker key={String(point.id)}
               style={styles.mapMarker}
                onPress={() => handleNavigateToDetail(point.id)}
                coordinate={{
                   latitude: point.latitude,
                   longitude: point.longitude,
                 }}>
                 <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }}/>
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                 </View>
               </Marker>
        ))}

        </MapView>
         ) }
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20 }}
          horizontal
          showsVerticalScrollIndicator={false}
        >
         {items.map(item=> (
            <TouchableOpacity 
              key={String(item.id)} 
              activeOpacity={0.6}
              onPress={() => handleSelectedItem(item.id)}
              style={[styles.item, 
              selectedItem.includes(item.id) ?  styles.selectedItem : {}]}>
            <SvgUri
              width={42}
              height={42}
              uri={item.image_url}
            />
            <Text style={styles.itemTitle}>{item.title}}</Text>
          </TouchableOpacity>))

        }
        </ScrollView>
      </View>
    </>
  );
};

export default Points;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: "#34CB79",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    color: "#FFF",
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",

    textAlign: "center",
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
  },
});
