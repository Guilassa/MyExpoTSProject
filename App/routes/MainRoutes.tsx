import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import ListScreen from '../views/List';
import ItemScreen from '../views/Item';
import ItemViewerScreen from '../views/ItemViewer';
import ItemUploaderScren from '../views/ItemUploader';

const ListStack = createStackNavigator();
const ItemStack = createStackNavigator();

export function List() {
  return (
    <ListStack.Navigator initialRouteName="ListStack" mode="modal">
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
      {/* <ListStack.Screen
        name="UploadStack"
        component={ItemUploaderScren}
        options={{
          title: 'Upload 3D Model',
          headerStyle: {
            backgroundColor: '#0095d9',
          },
          headerTintColor: '#fff',
        }}
      /> */}
    </ListStack.Navigator>
  );
}

export function ItemViewer() {
  return (
    <ItemStack.Navigator initialRouteName="ItemStack" mode="modal">
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
        name="ItemViewerStack"
        component={ItemViewerScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTintColor: '#000',
        }}
      />
    </ItemStack.Navigator>
  );
}


