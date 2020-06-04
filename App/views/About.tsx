import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

export default class AboutScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/icons/hp_logo_transparente.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.text}>About us</Text>
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
  image: {width: '80%', height: '30%'},
  text: {fontWeight: 'bold', fontSize: 18},
});
