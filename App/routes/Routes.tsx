import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../views/Home';
import AboutScreen from '../views/About';
import {List, ItemViewer} from './MainRoutes';
import {DataItem} from '../../App';

export type NavParamList = {
    HomeStack: undefined;
    AboutStack: undefined;
    ListNav: undefined;
    ListStack: {isModified:boolean};
    UploadStack: undefined;
    ItemNav: {screen: string; params: {itemParam: DataItem}};
    ItemStack: {itemParam: DataItem};
    ItemViewerThreeStack: {itemData: DataItem};
    ItemViewerARStack: {itemData: DataItem};
  };

interface RoutesProps {}

const Drawer = createDrawerNavigator();
export const MainStack = createStackNavigator();

function Home() {
  return (
    <MainStack.Navigator headerMode="none">
      <MainStack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{
          title: 'HP SCDS',
          headerStyle: {
            backgroundColor: '#0095d9',
          },
          headerTintColor: '#fff',
        }}
      />
    </MainStack.Navigator>
  );
}

export function Main() {
    return (
      <MainStack.Navigator initialRouteName="ListNav">
        <MainStack.Screen
          name="ListNav"
          component={List}
          options={{
            headerShown: false,
          }}
        />
        <MainStack.Screen
          name="ItemNav"
          component={ItemViewer}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#0095d9',
            },
            headerTintColor: '#fff',
          }}
        />
      </MainStack.Navigator>
    );
  }

function About() {
    return (
      <MainStack.Navigator headerMode="none">
        <MainStack.Screen
          name="AboutStack"
          component={AboutScreen}
          options={{
            title: 'About us',
            headerStyle: {
              backgroundColor: '#0095d9',
            },
            headerTintColor: '#fff',
          }}
        />
      </MainStack.Navigator>
    );
  }

export const Routes: React.FC<RoutesProps> = ({}) => {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="3D Models">
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="3D Models" component={Main} />
          <Drawer.Screen name="About" component={About} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  };