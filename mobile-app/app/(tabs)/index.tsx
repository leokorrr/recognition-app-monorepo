import { Pressable, Text, StyleSheet, View, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useState } from 'react'
import { Image } from 'expo-image'

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (uri: string) => {
    console.log('invoke uploadImage')
    setUploading(true)

    try {
      const response = await FileSystem.uploadAsync(
        'http://192.168.1.186:3000/api/results/',
        uri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'file'
        }
      )

      const parsed = JSON.parse(response.body)
      const hasBlacklisted = parsed?.data?.newSubstance?.hasBlacklisted

      console.log('Upload success. Blacklisted:', hasBlacklisted)

      if (hasBlacklisted) {
        Alert.alert('Uwaga!', 'Produkt zawiera czarną listę składników.')
      } else {
        Alert.alert('OK', 'Produkt nie zawiera niepożądanych składników.')
      }
      // Alert.alert('Success', 'Image uploaded successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
      Alert.alert('Error', 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Camera access is required.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri
      setImageUri(uri)
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={openCamera}
      >
        <Text style={styles.buttonText}>Zrob zdjecie produktu</Text>
      </Pressable>
      {imageUri && (
        <View style={styles.container}>
          <Image
            source={{ uri: imageUri }}
            style={styles.preview}
            contentFit='cover'
          />

          <Pressable
            style={styles.button}
            onPress={() => uploadImage(imageUri)}
          >
            <Text style={styles.buttonText}>Wyslij zdjecie</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setImageUri(null)}
          >
            <Text style={styles.buttonText}>Skasuj zdjecie</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16
  },
  button: {
    backgroundColor: '#1A2E6C',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600'
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 8
  }
})
