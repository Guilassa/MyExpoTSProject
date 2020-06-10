import ExpoTHREE, {THREE, Renderer} from 'expo-three';
import * as React from 'react';

import {StackNavigationProp} from '@react-navigation/stack';
import {NavParamList} from '../routes/Routes';
import {RouteProp} from '@react-navigation/native';
import {DataItem} from '../../App';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import {PerspectiveCamera, Scene} from 'three';
import {
  View, Alert,
} from 'react-native';
import OrbitControlsView from 'expo-three-orbit-controls';

console.disableYellowBox = true;

type Props = {
  navigation: StackNavigationProp<NavParamList, 'ItemViewerThreeStack'>;
  route: RouteProp<NavParamList, 'ItemViewerThreeStack'>;
};
type States = {
  item: DataItem;
  camera: THREE.Camera | undefined;
  speedRotation_X: Number;
  speedRotation_Y: Number;
};

export default class ItemViewer extends React.Component<Props, States> {
  camera: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      item: this.props.route.params.itemData,
      camera: undefined,
      speedRotation_X: 0.0,
      speedRotation_Y: 0.0,
    };
  }

  timeout: any;

  componentWillUnMount() {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(this.timeout);
  }

  onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    //TODO: Refactor function
    const {drawingBufferWidth: width, drawingBufferHeight: height} = gl;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({gl});
    renderer.setSize(width, height);
    renderer.setClearColor(0xcccccc);

    const camera = new PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 6, 12);
    camera.lookAt(0, 0, 0);

    this.setState({camera: camera});

    // scene
    const scene = new Scene();
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    // lights
    const directionalLightA = new THREE.DirectionalLight(0xffffff);
    directionalLightA.position.set(1, 1, 1);
    scene?.add(directionalLightA);

    const directionalLightB = new THREE.DirectionalLight(0xffeedd);
    directionalLightB.position.set(-1, -1, -1);
    scene?.add(directionalLightB);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene?.add(ambientLight);

    // TODO: Delete hardcode list of models and threat it dinamically

    function getModel(id:string):any{
      
      switch (id) {
        case "5edfc8883c840858f4f189ff":
          return require('../assets/3DModels/5edfc8883c840858f4f189ff.obj');
        case "5edfc9703c840858f4f18a01":
          return require('../assets/3DModels/5edfc9703c840858f4f18a01.obj');
        case "5edfd31b3c840858f4f18a03":
          return require('../assets/3DModels/5edfd31b3c840858f4f18a03.obj');
        case "5edfd3553c840858f4f18a05":
          return require('../assets/3DModels/5edfd3553c840858f4f18a05.obj');
        case "5edfd3a33c840858f4f18a07":
          return require('../assets/3DModels/5edfd3a33c840858f4f18a07.obj');
        case "5edfd4053c840858f4f18a09":
          return require('../assets/3DModels/5edfd4053c840858f4f18a09.obj');
        default:
          return require('../assets/3DModels/5edfd3a33c840858f4f18a07.obj');
      }
    }
    const model:any = getModel(this.state.item._id);

    if (!model) {
      Alert.alert('Sorry =( \nImposible to load the model desired.')
      this.props.navigation.goBack()
    }

    /*TODO: Download asynchronously the model file into a temporaly directory. 
            Then get the localUri variable to require the raw data and finally loadAsync data.

    /* const asset = Asset.fromModule(require(`../assets/3DModels/super_boo.stl`));
    await asset.downloadAsync();
    const uri = asset.localUri;
    console.log(JSON.stringify(asset)); */

    const mesh = await ExpoTHREE.loadAsync(
      [model],
      null,
      () => {
        return this.state.item._id;
      },
    );

    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 3);
    ExpoTHREE.utils.alignMesh(mesh, {x: 0.5, y: 0.5, z: 0.5});

    const pivot = new THREE.Group();
    pivot.add(mesh);
    scene.add(pivot);

    camera.lookAt(mesh.position);

    function update() {
      mesh.rotation.x += 0;
      mesh.rotation.y += 0;
    }

    // Setup an animation loop
    const render = () => {
      this.timeout = requestAnimationFrame(render);
      update();
      renderer.render(scene, camera);

      //ref.current.getControls()?.update();
      gl.endFrameEXP();
    };
    render();
  };
  render() {
    return (
      <View style={{flex: 1}}>
        {/*TODO: Allow change dinamically speed rotation and size of object*/}
        {/* <TouchableOpacity
        activeOpacity={0.5}
        style={styles.FloatingButton_X}
        onPress={() => {
          if (this.state.speedRotation_X === 0.00) {
            this.setState({speedRotation_X : 0.01});
          } else {
            this.setState({speedRotation_X : 0.00});
          }
        }}>
        <Text style={styles.FloatingButton_Text}>X</Text>
      </TouchableOpacity> */}
        <OrbitControlsView style={{flex: 1}} camera={this.state.camera}>
          <GLView
            style={{flex: 1}}
            onContextCreate={this.onContextCreate}
            key="d"
          />
        </OrbitControlsView>
      </View>
    );
  }
}


