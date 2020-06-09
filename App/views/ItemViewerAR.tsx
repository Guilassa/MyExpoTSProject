import * as React from 'react';
import {StyleSheet, Text, Dimensions, View, Platform} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {NavParamList} from '../Routes/Routes';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import OrbitControlsView from 'expo-three-orbit-controls';
import {
  AmbientLight,
  BoxBufferGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
  Camera,
} from 'three';
require('./OBJLoader');
import { Asset } from 'expo-asset';

const w = Dimensions.get('window');


type Props = {
  navigation: StackNavigationProp<NavParamList, 'ItemViewerStack'>;
  route: RouteProp<NavParamList, 'ItemViewerStack'>;
};


export default function ItemViewer (){
  const [camera, setCamera] = React.useState<Camera | null>(null);
  const [loaded, setLoaded] = React.useState<Boolean>();

  let timeout: number;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const preloadAssetsAsync = async () => {
    await Promise.all([
      require('../assets/3DModels/12140_Skull_v3_L2.mtl'),
      require('../assets/3DModels/12140_Skull_v3_L2.obj'),
      require('../assets/waternormals.jpg'),
    ].map((module) => Asset.fromModule(module).downloadAsync()));
    setLoaded(true);
  }
  
  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = 0x6ad6f0;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);

    setCamera(camera);

    const scene = new Scene();
    scene.fog = new Fog(sceneColor, 1, 10000);
    scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    const cube = new IconMesh();
    scene.add(cube);

    camera.lookAt(cube.position);


    // Setup an animation loop
    const render = () => {
      timeout = requestAnimationFrame(render);
      renderer.render(scene, camera);

      // ref.current.getControls()?.update();
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <OrbitControlsView style={{ flex: 1 }} camera={camera}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} key="d" />
    </OrbitControlsView>
  );
}

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({
        map: new TextureLoader().load(
          require('./3DModels/Skull/Skull.jpg')
        ),
      })
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
