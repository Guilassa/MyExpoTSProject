import React from 'react';
import {StyleSheet, Text, Dimensions} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {NavParamList} from '../Routes/Routes';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const w = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<NavParamList, 'ItemViewerStack'>;
  route: RouteProp<NavParamList, 'ItemViewerStack'>;
};

export default class ItemViewer extends React.Component<Props> {
  render() {
    const {itemData} = this.props.route.params;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>{itemData.name}</Text>
        <Text style={styles.text}>{itemData.description}</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {width: w.width, paddingTop: '50%', paddingBottom: '50%'},
  text: {fontWeight: 'bold', fontSize: 18},
});
