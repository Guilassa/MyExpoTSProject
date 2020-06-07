/*
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Routes} from './App/routes/Routes';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Loading Icon Font
Ionicons.loadFont();

export const status = 'development';

type filesType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  description: string;
  filename: string;
  path: string;
  size: number;
};

export type DataItem = {
  _id: string;
  name: string;
  description: string;
  thumbnail: filesType;
  file: filesType;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <Routes />
    </SafeAreaProvider>
  );
}
