import React from "react";
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { ListItem, Text } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import { FlatList } from "react-native-gesture-handler";
import { DataItem } from "../../App";
import { NavParamList } from "../Routes/Routes";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type State = {
  isLoading: boolean;
  refreshing: boolean;
  dataSource: DataItem[];
};

type Props = {
  navigation: StackNavigationProp<NavParamList, "ListStack">;
  route: RouteProp<NavParamList, "ListStack">;
};

/* function _onLongPressButton() {
  console.log('You long-pressed the button!');
} */

function Item({
  navigation,
  item,
}: {
  navigation: StackNavigationProp<NavParamList, "ListStack">;
  item: DataItem;
}) {
  return (
    <ListItem
      key={item._id}
      leftAvatar={{
        source: {
          uri: `http://mbp-guilassa.local:3000/${item.thumbnail.path}`,
        },
        title: item.name[0],
        size: "medium",
      }}
      title={item.name}
      titleStyle={styles.ListItem_Title}
      subtitle={item.description}
      subtitleStyle={styles.ListItem_Subtitle}
      onPress={() => {
        navigation.navigate("ItemNav", {
          screen: "ItemStack",
          params: { itemParam: item },
        });
      }}
      chevron
    />
  );
}

export default class ListScreen extends React.Component<Props, State> {
  _isMounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: true,
      dataSource: [],
    };
  }

  async makeRemoteRequest() {
    await fetch("http://mbp-guilassa.local:3000/files")
      .then((res) => res.json())
      .then((resJson) => {
        if (this._isMounted) {
          this.setState({
            isLoading: false,
            refreshing: false,
            dataSource: resJson,
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

  async makeRemoteDeleteRequest(itemID: string) {
    this.setState({
      refreshing: true,
    });

    await fetch("http://mbp-guilassa.local:3000/file/" + itemID, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((resJson: { message?: string; error?: string }) => {
        if (resJson.message) {
          this.makeRemoteRequest();
          Alert.alert(resJson.message);
          console.log(resJson);
        } else if (resJson.error) {
          this.setState({
            refreshing: false,
          });
          Alert.alert(resJson.error);
          console.log(resJson);
        } else {
          this.setState({
            refreshing: false,
          });
          console.log("Could not retrive any report about request.");
        }
      })
      .catch((error) => {
        this.setState({
          refreshing: false,
        });
        console.error(error);
      });
  }

  deleteRow(itemID: string) {
    this.makeRemoteDeleteRequest(itemID);
  }

  renderHiddenItem(itemID: string) {
    return (
      <View style={styles.ListItem_RowBack}>
        <TouchableOpacity
          style={[
            styles.ListItem_RowBack_RightBtn,
            styles.ListItem_RowBack_RightBtnRight,
          ]}
          onPress={() => this.deleteRow(itemID)}
        >
          <Text style={styles.ListItem_RowBack_Text}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
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
      return { refreshing: !currentState.refreshing };
    });
    this.makeRemoteRequest();
  }

  renderSeparator() {
    return <View style={styles.Flatlist_Separator} />;
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container_indicator}>
          <ActivityIndicator color="#0095d9" size="large" />
        </View>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <SwipeListView
            useFlatList={true}
            data={this.state.dataSource}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this.renderSeparator}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.handleRefresh()}
              />
            }
            renderItem={({ item }: { item: DataItem }) => (
              <Item navigation={this.props.navigation} item={item} />
            )}
            keyExtractor={(item: DataItem) => item._id}
            renderHiddenItem={({ item }: { item: DataItem }) =>
              this.renderHiddenItem(item._id)
            }
            rightOpenValue={-75}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              this.props.navigation.navigate("UploadStack");
            }}
            style={styles.FloatingButton_TouchableOpacity}
          >
            <Image
              source={{
                uri:
                  "https://reactnativecode.com/wp-content/uploads/2017/11/Floating_Button.png",
              }}
              style={styles.FloatingButton_Image}
            />
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container_indicator: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#rgba(0, 0, 0, 0.2)",
  },
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  Flatlist_Separator: {
    height: 1,
    width: "86%",
    backgroundColor: "#CED0CE",
    marginLeft: "18%",
  },
  ListItem_Title: {
    fontSize: 24,
    color: "#3F3F3F",
  },
  ListItem_Subtitle: {
    color: "#A5A5A5",
  },
  ListItem_RowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  ListItem_RowBack_RightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  ListItem_RowBack_RightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
  ListItem_RowBack_Text: {
    color: "#FFF",
  },
  FloatingButton_TouchableOpacity: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
  },

  FloatingButton_Image: {
    resizeMode: "contain",
    width: 50,
    height: 50,
  },
});
