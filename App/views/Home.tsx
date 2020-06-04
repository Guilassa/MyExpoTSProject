import React from 'react';
import {StyleSheet, Text, ImageBackground, View} from 'react-native';

export default function Home() {

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.headerBackgroundImage}
        blurRadius={0}
        source={require('../assets/icons/hp_logo_transparente.png')}
      />
      <Text style={styles.text}>Welcome 3D HP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackgroundImage: {
    paddingBottom: '50%',
    paddingTop: '50%',
    width: '100%',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 28,
    position: 'absolute',
    height: '60%',
  },
});
