import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {NavParamList} from '../Routes/Routes';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DocumentPicker from 'expo-document-picker';
import ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {Input} from 'react-native-elements';
import deviceConstants from 'expo-constants';

const w = Dimensions.get('window');

type filesStruct = {
  uri: string;
  name?: string;
  size?: number;
};

type States = {
  name_Model: string;
  description_Model: string;
  file_Data: filesStruct;
  image_Data: filesStruct;
  status_Permision: string;
};

type Props = {
  navigation: StackNavigationProp<NavParamList, 'UploadStack'>;
  route: RouteProp<NavParamList, 'UploadStack'>;
};

export default class ItemUploaderScren extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name_Model: '',
      description_Model: '',
      file_Data: {},
      image_Data: {},
      status_Permision: '',
    };
  }
  
  componentDidMount(){
    // Check if user has approved access to inspect camera roll
    async () => {
      if (deviceConstants.platform?.ios) {
        const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
        this.setState({status_Permision: status})
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      } else if (deviceConstants.platform?.android) {
        const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
        this.setState({status_Permision: status})
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    }
  }

  // Prepare data for each file (Model || Avatar)
  wrappingData(
    path: string,
  ): {_name: string; _inbox: string; _realPath: string} {
    try {
      let split = path.split('/');
      let name = split.pop() || '';
      let inbox = split.pop() || '';
      let realPath = 'RNFS.TemporaryDirectoryPath';
      if (path.indexOf('.jpg') >= 0 || path.indexOf('.png') >= 0) {
        realPath = `${realPath}${name}`;
      } else {
        realPath = `${realPath}${inbox}/${name}`;
      }

      return {_name: name, _inbox: inbox, _realPath: realPath};
    } catch (error) {
      console.log(error);
      return {_name: '', _inbox: '', _realPath: ''};
    }
  }

  async selectOneFile() {
    //Opening Document Picker for selection of one file
    try {
      // Catching model file
      const res = await DocumentPicker.getDocumentAsync();
      if (res.type === 'success'){
        if (res.size > 20971520) {
          console.log(`The size of file is too big. ${res.size}`);
          Alert.alert('Pick any other file. This is too big.');
        } else {
          this.setState({file_Data: res});
        }
      } else {
        console.log(res.type);
        Alert.alert('Unknown Error in method "selectOneFile".');
      }
    } catch (err) {
      //Handling any exception (If any)
      console.log(JSON.stringify(err));
      Alert.alert('Unknown Error in method "selectOneFile".');
    }
  }

  async selectOneImage() {
    try {

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        this.setState({image_Data: result.uri});
      } else {
        console.log('User cancelled imagePicker');
      }

    } catch (err) {
      console.log(JSON.stringify(err));
      Alert.alert('Unknown Error in method "selectOneImage".');
    }
  }

  async uploadModel() {
    try {
      //Check if any file is selected or not
      if (
        this.state.file_Data !== {} &&
        this.state.image_Data !== {} &&
        this.state.name_Model !== '' &&
        this.state.name_Model !== ''
      ) {
        const file_dataParser = this.wrappingData(this.state.file_Data.uri);
        const image_dataParser = this.wrappingData(this.state.image_Data.uri);

        const uploadBegin = (response: {jobId: any}) => {
          const jobId = response.jobId;
          console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
        };

        const uploadProgress = (response: {
          totalBytesSent: number;
          totalBytesExpectedToSend: number;
        }) => {
          const percentage = Math.floor(
            (response.totalBytesSent / response.totalBytesExpectedToSend) * 100,
          );
          console.log('UPLOAD IS ' + percentage + '% DONE!');
        };

        /* await RNFS.uploadFiles({
          toUrl: 'http://mbp-guilassa.local:3000/files',
          files: [
            {
              // Model File
              name: 'model',
              filename: file_dataParser._name || 'modelFileName',
              filetype: this.state.file_Data.type || 'model/stl',
              filepath: file_dataParser._realPath,
            },
            {
              // Avatar Image
              name: 'avatar',
              filename: image_dataParser._name || 'imageAvatarName',
              filetype: this.state.image_Data.type || 'image/jpeg',
              filepath: image_dataParser._realPath,
            },
          ],
          fields: {
            name: this.state.name_Model,
            description: this.state.description_Model,
          },
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          begin: uploadBegin,
          beginCallback: uploadBegin, // Don't ask me, only way I made it work as of 1.5.1
          progressCallback: uploadProgress,
          progress: uploadProgress,
        })
          .promise.then((response: {statusCode: number}) => {
            console.log(response, '<<< Response');
            if (response.statusCode === 200) {
              Alert.alert('File uploaded!');
              console.log('FILES UPLOADED!');
            } else {
              Alert.alert('Error uploading!');
              console.log('SERVER ERROR');
            }
          })
          .catch((err: {description: any}) => {
            if (err.description) {
              switch (err.description) {
                case 'cancelled':
                  Alert.alert('Upload cancelled!');
                  console.log('Upload cancelled');
                  break;
                case 'empty':
                  Alert.alert('Upload cancelled!');
                  console.log('Files are empty!');
              }
            }
            console.log(JSON.stringify(err));
          }); */
      } else {
        Alert.alert('It is required to select a file!');
      }
    } catch (error) {
      Alert.alert('Unknown Error: An error appeared trying to upload a model!');
      console.log(JSON.stringify(error));
    }
    this.props.navigation.goBack();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Upload Screen</Text>
        <Input
          placeholder="Name of Model"
          onChangeText={value => this.setState({name_Model: value})}
        />
        <Input
          placeholder="Description of Model"
          allowFontScaling
          onChangeText={value => this.setState({description_Model: value})}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => this.selectOneFile()}>
          {/*Single file selection button*/}
          <Text style={{marginRight: 10, fontSize: 19}}>
            Click here to pick one file
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={styles.imageIconStyle}
          />
        </TouchableOpacity>
        <Text style={styles.textStyle}>
          File Name:{' '}
          {this.state.file_Data.name ? this.state.file_Data.name : ''}
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => this.selectOneImage()}>
          {/*Single file selection button*/}
          <Text style={{marginRight: 10, fontSize: 19}}>
            Click here to pick one image
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={styles.imageIconStyle}
          />
        </TouchableOpacity>
        <Text style={styles.textStyle}>
          Image Name: {JSON.stringify(this.state.image_Data.name)}
        </Text>
        <Image
          source={this.state.image_Data}
          style={{width: 100, height: 100}}
        />
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={this.uploadModel.bind(this)}>
          <Text style={styles.buttonTextStyle}>Upload File</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
  image: {
    width: w.width,
    paddingTop: '50%',
    paddingBottom: '50%',
  },
  text: {fontWeight: 'bold', fontSize: 18},
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  imageIconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
