import React from 'react';
import {StyleSheet, Text, Dimensions, View, Platform} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {NavParamList} from '../Routes/Routes';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AR} from 'expo';
import {GraphicsView} from 'expo-graphics';
import {Renderer, THREE} from 'expo-three';
import {BackgroundTexture, Camera} from 'expo-three-ar';

const w = Dimensions.get('window');
let renderer: Renderer,
  scene: THREE.Scene,
  camera: {aspect: number; updateProjectionMatrix: () => void};

type Props = {
  navigation: StackNavigationProp<NavParamList, 'ItemViewerStack'>;
  route: RouteProp<NavParamList, 'ItemViewerStack'>;
};

export default function ItemViewer() {
  if (Platform.OS !== 'ios') return null;

  const onContextCreate = async ({gl, pixelRatio, width, height}) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // await addDetectionImageAsync(image);

    renderer = new Renderer({gl, pixelRatio, width, height});
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    // renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();
    scene.background = new BackgroundTexture(renderer);

    camera = new Camera(width, height, 0.01, 1000);

    // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    // Simple color material
    const material = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
    });

    //await this.loadModel();

    // Combine our geometry and material
    const cube = new THREE.Mesh(geometry, material);
    // Place the box 0.4 meters in front of us.
    cube.position.z = -0.4;
    // Add the cube to the scene
    scene.add(cube); 
    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    scene.add(new THREE.AmbientLight(0xffffff));
  };

  /* loadModel = async () => {
    const obj = {
      "museu.obj": require('../Conteudos_AV/museu1.obj')
    }

    const model = await ExpoTHREE.loadAsync(
      obj['museu.obj'],
      null,
      obj
    );

    // this ensures the model will be small enough to be viewed properly
    ExpoTHREE.utils.scaleLongestSideToSize(model, 1);

    this.scene.add(model)

  }; */

  const onResize = ({scale, width, height}) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
  };

  const onRender = (delta: any) => {
    // if (mesh) {
    //   mesh.update(delta);
    // }

    renderer.render(scene, camera);
  };

  return (
    <View style={{flex: 1}}>
      <GraphicsView
        style={{flex: 1}}
        onContextCreate={onContextCreate}
        onRender={onRender}
        onResize={onResize}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
      />
    </View>
  );
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
