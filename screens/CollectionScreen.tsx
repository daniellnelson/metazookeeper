
import {StatusBar} from 'expo-status-bar'
import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, ImageBackground} from 'react-native'
import {Camera} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library';
const tag = '[CAMERA]'

export default function CollectionScreen({ navigation }: RootTabScreenProps<'CollectionScreen'>) {
 const [hasPermission, setHasPermission] = useState<any>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<any>(null)
 declare global {
  var myAlbums: any;
  var album: any;
    var photos: any;
  var myString: any;
}
  const [startOver, setStartOver] = useState(true)
  const [type, setType] = useState(Camera.Constants.Type.back)
  let camera: Camera
  
  useEffect(() => {
    ;(async () => {
	  const [status, requestPermission] = MediaLibrary.usePermissions()
      setHasPermission(status === 'granted')
    })()
  }, [])


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
  if(doesExist === null)
  {

	console.log("need to create album")
	   const throwAway = await MediaLibrary.createAlbumAsync("MetaZooKeepers")
	   console.log("album created")
	   }
	
	   globalThis.album = await MediaLibrary.getAlbumAsync("MetaZooKeepers")
	   console.log("Logging the album because it exists: ")
	   console.log(globalThis.album)
	
  }
  function visitParent(parent, obj, callback) {
    for (const [key, value] of Object.entries(parent)) {
		if(key === "assetCount" && value === 2)
		{
			console.log("assets found")
			console.log(value)
			if(key === "assets"){
			console.log("visiting child")
			visitParent(obj, value)}
		}
       
    }
	}
	
	  function visitChildren(obj) {
    for (const [key, value] of Object.entries(obj)) {
			if(typeof obj === "Object")
			{
			    console.log("starting recursion")
				visitChildren(obj)
			}
			console.log(key)
			console.log(value)
    }
	}

  const _saveToLibrary = async () => {
  createAnAlbum()
  console.log("going to save photo")
    globalThis.photos = await MediaLibrary.getAssetsAsync({ album: globalThis.album })
	console.log(globalThis.photos)
	console.log("photos received")
	visitParent(globalThis.album, globalThis.photos, (key, value) => {
	});
}


  const __savePhoto = async () => {}
  return (
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
                    onPress={_saveToLibrary}
                    style={{
                      width: 130,
                      height: 40,

                      alignItems: 'center',
                      borderRadius: 4
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 20
                      }}
                    >
                      Show Cards
                    </Text>
                  </TouchableOpacity>
                </View>
              
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