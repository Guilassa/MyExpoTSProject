import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../views/Home';

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

export const Routes: React.FC<RoutesProps> = ({}) => {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="3D Models">
          <Drawer.Screen name="Home" component={Home} />
          {/* <Drawer.Screen name="3D Models" component={Main} />
          <Drawer.Screen name="About" component={About} /> */}
        </Drawer.Navigator>
      </NavigationContainer>
    );
  };