import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Button,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import {DataItem} from '../../App';
import {Divider, Text} from 'react-native-elements';
import {StackNavigationProp} from '@react-navigation/stack';
import {NavParamList} from '../routes/Routes';
import {RouteProp} from '@react-navigation/native';
import ProgressiveImageViewer from '../components/ProgressiveImageViewer';
import {SafeAreaView} from 'react-native-safe-area-context';

const w = Dimensions.get('window');

type States = {
  isLoading: boolean;
  refreshing: boolean;
  item: DataItem;
};

type Props = {
  navigation: StackNavigationProp<NavParamList, 'ItemStack'>;
  route: RouteProp<NavParamList, 'ItemStack'>;
};

export default class ItemScreen extends React.Component<Props, States> {
  _isMounted = false;

  constructor(props: Props) {
    super(props);
    this.props.navigation.setOptions({
      title: this.props.route.params.itemParam.name,
    });
    this.state = {
      isLoading: true,
      refreshing: true,
      item: this.props.route.params.itemParam,
    };
  }

  async makeRemoteRequest() {
    await fetch(`http://mbp-guilassa.local:3000/file/${this.state.item._id}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (this._isMounted) {
          this.setState({
            isLoading: false,
            refreshing: false,
            item: resJson,
          });
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          refreshing: false,
        });
        console.error(error);
      });
  }

  componentDidMount() {
    this._isMounted = true;
    this.makeRemoteRequest();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleRefresh() {
    this.setState((currentState) => {
      return {refreshing: !currentState.refreshing};
    });
    this.makeRemoteRequest();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.handleRefresh()}
            />
          }>
          <View style={styles.ImageContainer}>
            <ProgressiveImageViewer
              thumbnailSource={{
                uri: `http://mbp-guilassa.local:3000/${
                  this.state.item.thumbnail.path
                }?w=50&buster=${Math.random()}`,
              }}
              source={{
                uri: `http://mbp-guilassa.local:3000/${
                  this.state.item.thumbnail.path
                }?w=${w.width * 2}&buster=${Math.random()}`,
              }}
              style={styles.ImageViewer}
              resizeMode="cover"
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.FloatingButton_3D}
              onPress={() => {
                this.props.navigation.navigate('ItemViewerThreeStack', {
                  itemData: this.state.item,
                });
              }}>
              <Text style={styles.FloatingButton_Text}>3D</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.FloatingButton_AR}
              onPress={() => {
                this.props.navigation.navigate('ItemViewerARStack', {
                  itemData: this.state.item,
                });
              }}>
              <Text style={styles.FloatingButton_Text}>AR</Text>
            </TouchableOpacity>
          </View>
          <Text h4 style={styles.DataContainer_Name}>
            {this.state.item.name}
          </Text>
          <Text style={styles.DataContainer_Description}>
            Designed for Company S.A.
          </Text>
          <Divider style={styles.DataContainer_Divider} />
          <Text style={styles.DataContainer_Description}>
            {this.state.item.description}
          </Text>
          <Divider style={styles.DataContainer_Divider} />
          <Text style={styles.DataContainer_Description}>
            Find me on Social here
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingTop:0,
  },
  ImageContainer: {
  },
  ImageViewer: {
    width: w.width-5,
    height: w.width-5,
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
  FloatingButton_3D: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: 10,
    bottom: 10,
    borderRadius: 50,
    borderColor: '#FFF',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FloatingButton_AR: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 10,
    bottom: 10,
    borderRadius: 50,
    borderColor: '#FFF',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FloatingButton_Text: {
    color: '#FFF',
  },
});
