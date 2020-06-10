import React from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Platform,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {NavParamList} from '../Routes/Routes';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AR} from 'expo';
import {GraphicsView} from 'expo-graphics';
import ExpoTHREE, {Renderer, THREE} from 'expo-three';
import {BackgroundTexture, Camera} from 'expo-three-ar';
import {DataItem} from '../../App';

const w = Dimensions.get('window');
console.disableYellowBox = true;

type Props = {
  navigation: StackNavigationProp<NavParamList, 'ItemViewerThreeStack'>;
  route: RouteProp<NavParamList, 'ItemViewerThreeStack'>;
};
type States = {
  item: DataItem;
  camera: THREE.Camera | undefined;
};

let renderer: Renderer,
  scene: THREE.Scene,
  camera: {aspect: number; updateProjectionMatrix: () => void},
  mesh: any;

export default class ItemViewerAR extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      item: this.props.route.params.itemData,
      camera: undefined,
    };
  }

  //if (Platform.OS !== 'ios') return null;

  onContextCreate = async ({gl, pixelRatio, width, height}:any) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // await addDetectionImageAsync(image);

    renderer = new Renderer({gl, pixelRatio, width, height});
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    // renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();
    scene.background = new BackgroundTexture(renderer);

    // camera
    camera = new Camera(width, height, 0.1, 500);

    // lights
    const directionalLightA = new THREE.HemisphereLight(0x000000);
    directionalLightA.position.set(100, 100, 100);
    scene?.add(directionalLightA);

    const directionalLightB = new THREE.HemisphereLightHelper(directionalLightA,1,0xffffff);
    directionalLightB.position.set(-100, -100, -100);
    scene?.add(directionalLightB);

    /* const ambientLight = new THREE.AmbientLight(0xffeedd);
    scene?.add(ambientLight); */
    

    function getModel(id: string): any {
      switch (id) {
        case '5edfc8883c840858f4f189ff':
          return require('../assets/3DModels/5edfc8883c840858f4f189ff.obj');
        case '5edfc9703c840858f4f18a01':
          return require('../assets/3DModels/5edfc9703c840858f4f18a01.obj');
        case '5edfd31b3c840858f4f18a03':
          return require('../assets/3DModels/5edfd31b3c840858f4f18a03.obj');
        case '5edfd3553c840858f4f18a05':
          return require('../assets/3DModels/5edfd3553c840858f4f18a05.obj');
        case '5edfd3a33c840858f4f18a07':
          return require('../assets/3DModels/5edfd3a33c840858f4f18a07.obj');
        case '5edfd4053c840858f4f18a09':
          return require('../assets/3DModels/5edfd4053c840858f4f18a09.obj');
        default:
          return require('../assets/3DModels/5edfd3a33c840858f4f18a07.obj');
      }
    }

    const model: any = getModel(this.state.item._id);

    if (!model) {
      Alert.alert('Sorry =( \nImposible to load the model desired.');
      this.props.navigation.goBack();
    }

    /*TODO: Download asynchronously the model file into a temporaly directory. 
              Then get the localUri variable to require the raw data and finally loadAsync data.
  
      /* const asset = Asset.fromModule(require(`../assets/3DModels/super_boo.stl`));
      await asset.downloadAsync();
      const uri = asset.localUri;
      console.log(JSON.stringify(asset)); */

    mesh = await ExpoTHREE.loadAsync([model], null, () => {
      return this.state.item._id;
    });

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 0.5);
    ExpoTHREE.utils.alignMesh(mesh, {x: 1, y: 0, z: -1});

    //const pivot = new THREE.Group();
    //pivot.add(mesh);
    scene.add(mesh);

    /* // Combine our geometry and material
    const cube = new THREE.Mesh(geometry, material);
    // Place the box 0.4 meters in front of us.
    cube.position.z = -0.4;
    // Add the cube to the scene
    scene.add(cube);
    // Setup a light so we can see the cube color
    // AmbientLight colors all things in the scene equally.
    scene.add(new THREE.AmbientLight(0xffffff)); */
  };

  onResize = ({scale, width, height}:any) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
  };

  onRender = (delta: any) => {
    /* if (mesh) {
      mesh.update(delta);
    } */

    renderer.render(scene, camera);
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <GraphicsView
          style={{flex: 1}}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          isArEnabled
          isArRunningStateEnabled
          isArCameraStateEnabled
        />
      </View>
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
