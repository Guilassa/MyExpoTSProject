import React, {useEffect, useDebugValue} from 'react';
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
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoConstants from 'expo-constants';
import {Input} from 'react-native-elements';

const w = Dimensions.get('window');

type filesStruct = {
  cancelled?: boolean;
  uri: string;
  type?: string;
};

type States = {
  name_Model: string;
  description_Model: string;
  file_Data: filesStruct;
  image_Data: filesStruct;
  status_Permision: string;
  uploading: boolean;
};

type Props = {
  navigation: StackNavigationProp<NavParamList, 'UploadStack'>;
  route: RouteProp<NavParamList, 'UploadStack'>;
};

interface IFormDataValue {
  uri: string;
  name: string;
  type: string;
  filename: string;
}

interface FormData {
  append(name: string, value: string | Blob | IFormDataValue, fileName?: string): void;

}

declare var FormData: {
  prototype: FormData;
  new(form?: HTMLFormElement): FormData;
};

interface FormData {
  entries(): IterableIterator<[string, string | File]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string | File>;
  [Symbol.iterator](): IterableIterator<string | File>;
}

export default class ItemUploaderScren extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name_Model: '',
      description_Model: '',
      file_Data: {},
      image_Data: {},
      status_Permision: '',
      uploading: false,
    };
  }

  _askPermission = async (
    type: Permissions.PermissionType,
    failureMessage: any,
  ) => {
    const {status} = await Permissions.askAsync(type);

    if (status === 'denied') {
      alert(failureMessage);
    }
  };

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

  prepareInfoData( uri: string ) : { newUri: string, fileType: string}{

    let fileType = uri.split('.').pop() || '';
    let newUri = uri.replace('file://','');
    
    return {newUri: newUri, fileType: fileType};
  }

  async selectOneFile() {
    await this._askPermission(
      Permissions.LOCATION,
      'We need Location permission to read different files from your phone...',
    );
    //Opening Document Picker for selection of one file
    try {
      // Catching model file
      const res = await DocumentPicker.getDocumentAsync();
      if (res.type === 'success') {
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
    await this._askPermission(
      Permissions.CAMERA_ROLL,
      'We need the camera-roll permission to read pictures from your phone...',
    );
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        this.setState({image_Data: result});
      } else {
        console.log('User cancelled imagePicker');
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      Alert.alert('Unknown Error in method "selectOneImage".');
    }
  }

  async uploadImageAsync() {
    let apiUrl = `http://mbp-guilassa.local:3000/files`
    
    try {

      if (
        this.state.file_Data !== {} &&
        this.state.image_Data !== {} &&
        this.state.name_Model !== '' &&
        this.state.name_Model !== ''
      ) {

        let imageTmpData = this.prepareInfoData(this.state.image_Data.uri);
        let fileTmpData = this.prepareInfoData(this.state.file_Data.uri);
      
        let form = new FormData();
        form.append(
          'model', {
            uri: fileTmpData.newUri,
            name: 'model',
            filename: `model.${fileTmpData.fileType}`,
            type: `model/${fileTmpData.fileType}`,
          }
        );
        form.append(
          'image', {
            uri: imageTmpData.newUri,
            name: 'avatar',
            filename: `photo.${fileTmpData.fileType}`,
            type: `image/${imageTmpData.fileType}`,
          }
        );
        form.append(
          'name',this.state.name_Model
        );
        form.append(
          'description', this.state.description_Model
        );

        /* let formData = JSON.stringify({
            name:this.state.name_Model,
            description:this.state.description_Model,
            model:{
              filename: `model.${imageTmpData.fileType}`,
              filepath: imageTmpData.newUri,
              name: 'model',
              filetype: `image/${imageTmpData.fileType}`,
            },
            avatar:{
              filename: `photo.${imageTmpData.fileType}`,
              filepath: imageTmpData.newUri,
              name: 'avatar',
              filetype: `image/${imageTmpData.fileType}`,
            }}) */

        let options = {
          method: 'POST',
          //body: formData,
          body: form,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        };

        /* fetch(apiUrl, {
          method: 'POST',
          //body: formData,
          body: form,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }).then((response: any) => response.json()).then((response: any) => {
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
        });*/
        return

      } else {
        Alert.alert('Select all files!');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Upload failed, sorry :(');
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
    //this.props.navigation.goBack();
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Upload Screen</Text>
        <Input
          placeholder="Name of Model"
          onChangeText={(value) => this.setState({name_Model: value})}
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
          onPress={this.uploadImageAsync.bind(this)}>
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
