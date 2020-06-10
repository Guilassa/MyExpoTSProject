import React from 'react';
import {StyleSheet, ImageBackground, View} from 'react-native';
import {Text} from 'react-native-elements';
export default function Home() {

  return (
    <View style={styles.container}>
      <Text h2 style={styles.text}>Escher</Text>
      <ImageBackground
        style={styles.headerBackgroundImage}
        blurRadius={0}
        source={require('../assets/images/EscherCube.png')}
      />
      
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
    top:'10%',
  },
});
