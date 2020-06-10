import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import ListScreen from '../views/List';
import ItemScreen from '../views/Item';
import ItemViewerThreeScreen from '../views/ItemViewerThree';
import ItemViewerARScreen from '../views/ItemViewerAR';
import ItemUploaderScren from '../views/ItemUploader';

const ListStack = createStackNavigator();
const ItemStack = createStackNavigator();

export function List() {
  return (
    <ListStack.Navigator
      initialRouteName="ListStack"
      mode="modal"
      screenOptions={({route, navigation}) => ({
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerStatusBarHeight:
          navigation.dangerouslyGetState().routes.indexOf(route) > 0
            ? 0
            : undefined,
        ...TransitionPresets.ModalPresentationIOS,
      })}>
      <ListStack.Screen
        name="ListStack"
        component={ListScreen}
        options={{
          title: '3D Models',
          headerStyle: {
            backgroundColor: '#0095d9',
          },
          headerTintColor: '#fff',
        }}
      />
      <ListStack.Screen
        name="UploadStack"
        component={ItemUploaderScren}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0095d9',
          },
          headerTintColor: '#fff',
          gestureResponseDistance: {vertical: 100},
          headerLeft: undefined,
        }}
      />
    </ListStack.Navigator>
  );
}

export function ItemViewer() {
  return (
    <ItemStack.Navigator
      initialRouteName="ItemStack"
      mode="modal"
      screenOptions={({route, navigation}) => ({
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerStatusBarHeight:
          navigation.dangerouslyGetState().routes.indexOf(route) > 0
            ? 0
            : undefined,
        ...TransitionPresets.ModalPresentationIOS,
      })}>
      <ItemStack.Screen
        name="ItemStack"
        component={ItemScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0095d9',
          },
          headerTintColor: '#fff',
        }}
      />
      <ItemStack.Screen
        name="ItemViewerThreeStack"
        component={ItemViewerThreeScreen}
        options={{
          title: '3D Viewer',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0095d9',
          },
          headerTintColor: '#fff',
        }}
      />
      <ItemStack.Screen
        name="ItemViewerARStack"
        component={ItemViewerARScreen}
        options={{
          title: 'AR Viewer',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0095d9',
          },
          headerTintColor: '#fff',
        }}
      />
    </ItemStack.Navigator>
  );
}
