
import {StatusBar} from 'expo-status-bar'
import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, ImageBackground} from 'react-native'
import {Camera} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library';
import RNTextDetector from "rn-text-detector";

const tag = '[CAMERA]'

export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabTwo'>) {

  const [hasPermission, setHasPermission] = useState<any>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<any>(null)
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

    
 declare global {
  var myAlbums: any;
  var album: any;
  var assetUri: string;

}

  const [state, setState] = useState<{
  loading: boolean;
  image: string | null;
  toast: { 
   message: string;
   isVisible: boolean;
  };
  textRecognition: [] | null; 
 }>({
  loading: false,
  image: null,
  textRecognition: null,
  toast: {
  message: "",
  isVisible: false,
  },
 });
 
async function onImageTaken(file) {
alert("checking if file is provided")
alert(file.uri)
if(!file)
{
	alert("no asset uri was correctly provided")
}
else {
  const textRecognition = await RNTextDetector.detectFromUri(file.uri);
  console.log("logging text recognition\n")
  console.log(textRecognition)
  alert(textRecognition)
  }
}

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraPermission.status === 'granted');

    if (cameraPermission.status !== 'granted')
	{
      alert('Permission for media access needed.');
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync()
      console.log(photo)
    setPreviewVisible(true)
    setCapturedImage(photo)
    }
  };



  const [startOver, setStartOver] = useState(true)
  const [type, setType] = useState(Camera.Constants.Type.back)
  let camera: Camera
  
  useEffect(() => {
    ;(async () => {
const [status, requestPermission] = MediaLibrary.usePermissions();
      setHasPermission(status === 'granted')
    })()
  }, [])
  
  const __closeCamera = () => {
    setStartOver(true)
  }

  const getAlbums = async () => {
  console.log("looking for all albums")
    const res = await MediaLibrary.requestPermissionsAsync()
    if (res.granted) {
      MediaLibrary.getAlbumsAsync()
                     .then((albums) => globalThis.myAlbums = albums)
                     .catch((err) => console.warn(err))				 
    }
  }
  
  const createAnAlbum = async () => 
  {
  getAlbums()
  console.log("looking if MetaZooKeepers exists")
  const doesExist = await MediaLibrary.getAlbumAsync("MetaZooKeepers")
  if(doesExist == null)
  {

	console.log("need to create album")
	   const throwAway = await MediaLibrary.createAlbumAsync("MetaZooKeepers")
	   console.log("album created")
	   }
	
	   globalThis.album = await MediaLibrary.getAlbumAsync("MetaZooKeepers")
	   console.log(globalThis.album)
	
  }
  
  const _saveToLibrary = async () => 
  {
   setState({ ...state, loading: true });
   createAnAlbum()
   console.log("going to save photo")
   console.log(capturedImage)
   globalThis.assetUri = capturedImage.uri
   const asset = await MediaLibrary.createAssetAsync(capturedImage.uri);
   onImageTaken(asset)
   console.log("Createing asset for storage")
   console.log(asset)
   console.log(globalThis.album)
   const albumId = globalThis.album.id
   MediaLibrary.addAssetsToAlbumAsync(asset, albumId )
   navigation.navigate("TabOne")
}

  const __savePhoto = async () => {}
  return (
    <View
      style={{
        flex: 1
      }}
    >
      {startOver ? (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => setStartOver(false)}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Capture Page (Card)
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flex: 1
          }}
        >
          {previewVisible ? (
            <ImageBackground
              source={{uri: capturedImage && capturedImage.uri}}
              style={{
                flex: 1
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  padding: 15,
                  justifyContent: 'flex-end'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setPreviewVisible(false)}
                    style={{
                      width: 130,
                      height: 40,

                      alignItems: 'center',
                      borderRadius: 4
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 20}}>
                      Re-take
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={_saveToLibrary}
                    style={{
                      width: 130,
                      height: 40,

                      alignItems: 'center',
                      borderRadius: 4
                    }}
                  >
                  <Text style={{ color: '#fff', fontSize: 20}}>
                      Save Image
                    </Text>
                  </TouchableOpacity>
                </View>
				
              </View>
            </ImageBackground>
          ) : (
            <Camera
              style={{flex: 1}}
              type={type}
              ref={(r) => {
                camera = r
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: '5%',
                    right: '5%'
                  }}
                >
                  <TouchableOpacity onPress={__closeCamera}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 20
                      }}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: '5%',
                    left: '5%'
                  }}
                  onPress={() => {
                    setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
                  }}
                >
                  <Text style={{fontSize: 18, marginBottom: 10, color: 'white'}}> Flip Camera </Text>
                </TouchableOpacity>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  }
})




