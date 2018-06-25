import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button, FlatList } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Constants, Location, Permissions } from 'expo';

export default class App extends React.Component {


  state = {
    text: "",
    location: null,
    errorMessage: null,
    /*Εδώ θα είναι το state των markers σε έναν αρχικά κενό πίνακα 
    που θα το γεμίζουμε καλώντας το api με το xml που θα μετατρέπουμε σε json*/
    markers: []
    /*{
      latitude: 37.7944539,
      longitude: 26.7071266,
      title: 'Ράμπα',
      description: 'Δυσκολία μέτρια'
    },
    {
      latitude: 37.7943539,
      longitude: 26.7075266,
      title: 'Ράμπα',
      description: 'Δυσκολία εύκολη'
    }*/



  };

  componentWillMount() {

    /*fetch('http://zogasmybio.000webhostapp.com/myxmlTest.xml')
              .then(response => response.json())
              .then(({ results: markers }) => this.setState({ markers }))*/

    fetch('http://zogasmybio.000webhostapp.com/jsondata.json')
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.data.ramps)
        this.setState({
          markers: responseJson.data.ramps.ramp
        });
      }).catch((err) => {
        console.log('fetch', err)
      })





    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }


  /* Η μέθοδος όπου ζητάμε τα δικαιώματα από τον χρήστη για να ανοίξει ο χάρτης*/
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    /* Βάζουμε σε μία μεταβλητή loation την τοποθεσία του χρήστη που παίρνουμε από το gps της συσκευής του */
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    this.setState({ location });
  };


  render() {
    let latitude;
    let longitude;

    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      /* Από το location παιρνάμε τις συντεταγμένες σε 2 μεταβλητές */
      latitude = JSON.stringify(this.state.location.coords.latitude);
      longitude = JSON.stringify(this.state.location.coords.longitude);
    }

    //let arrayjson= this.state.markers["ramp"];
    console.log("to state exei " + this.state.markers);

    return (
      <View style={styles.container}>

      {/*<FlatList
      data= {this.state.markers.ramp}
      renderItem={({item}) => <Text>{item.latitude}, {item.longitude}</Text>}
          keyExtractor={(item, index) => index}
      />*/}

       <MapView style={styles.map} region={{
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.2,
          longitudeDelta: 0.2
        }} >
          {this.state.markers.map(marker => (
            <MapView.Marker
            key={marker["-ID"]}
              coordinate={{
                latitude: parseFloat(marker["latitude"]),
                longitude: parseFloat(marker["longitude"])
              }}
              title={"Ράμπα"}
              description={"to index einai " +marker["-ID"]}
            />
          ))}
        </MapView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
