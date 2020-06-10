import React from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';
import {Divider, Text} from 'react-native-elements';

const w = Dimensions.get('window');
export default class AboutScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text h2 style={styles.text}>About us</Text>
        <Image
          source={require('../assets/images/EscherCube.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text h4 style={styles.DataContainer_Name}>
          Colaborators
        </Text>
        <Text style={styles.DataContainer_Description}>
          Guillermo Lastra Santamatilde, 71467327W
        </Text>
        <Divider style={styles.DataContainer_Divider} />
        <Text h4 style={styles.DataContainer_Name}>
          Company
        </Text>
        <Text style={styles.DataContainer_Description}>Designed as Master Final Project for Leon University.</Text>
        <Divider style={styles.DataContainer_Divider} />
        <Text h4 style={styles.DataContainer_Name}>
          Licence
        </Text>
        <Text style={styles.DataContainer_Description}>
          MIT
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {width: '80%', height: '30%', marginBottom: 10},
  text: {
    fontWeight: 'bold',
    fontSize: 28,
    position: 'absolute',
    top:'5%',
  },
  DataContainer_Name: {
    color: '#5E5E5E',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  DataContainer_Description: {
    color: '#5E5E5E',
    alignSelf: 'flex-start',
    marginTop: 5,
    marginHorizontal: 30,
    fontSize: 14,
  },
  DataContainer_Divider: {
    backgroundColor: '#C0C0C0',
    width: w.width - 60,
    margin: 20,
  },
});
