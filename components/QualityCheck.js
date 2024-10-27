import React from 'react';
import { StyleSheet, Image, View, Text, SafeAreaView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ref, get, getDatabase } from 'firebase/database';
import { format, subMinutes } from 'date-fns';
import {  database } from './firebase';

export default class Quality_Check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      responseText: '',
      isModalVisible: false,
      firebaseData: null,
      loading: false,
    };
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Quality Check',
    headerStyle: {
      backgroundColor: '#008000',
      elevation: 0,
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24,
    },

    headerLeft: () => (
      <View style={{ marginLeft: 10, marginTop: 5 }}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
          <MaterialCommunityIcons name="menu" color='#008000' size={30} />
        </TouchableOpacity>
      </View>
    ),
  });
  // Image Picker Functions
  pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      this.setState({ responseText: 'Sorry, we need camera roll permissions to make this work!' });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      this.setState({ image: result.assets[0].uri });
      this.uploadImage(result.assets[0].uri);
    }
  };

  takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      this.setState({ responseText: 'Sorry, we need camera permissions to make this work!' });
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      this.setState({ image: result.assets[0].uri });
      this.uploadImage(result.assets[0].uri);
    }
  };

  uploadImage = async (uri) => {
    let filename = uri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('photo', { uri, name: filename, type });

    try {
      let response = await fetch('https://5ac76134-7577-48c5-9c10-f9f7a304e291-00-5bgxc17zhtzy.kirk.replit.dev/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      let responseJson = await response.json();
      setResponseText(responseJson.message);
    } catch (error) {
      console.error('Error uploading image:', error);
      setResponseText('Error analyzing tea. Please try again.');
    }
  };

  fetchFirebaseData = async () => {
    this.setState({ loading: true });

    const now = new Date();
    const twoMinutesAgo = subMinutes(now, 2);
    const year = format(twoMinutesAgo, 'yyyy');
    const month = format(twoMinutesAgo, 'MM');
    const day = format(twoMinutesAgo, 'dd');
    const hour = format(twoMinutesAgo, 'HH');
    const minute = format(twoMinutesAgo, 'mm:ss');
   
    const path = `Updates/${year}/${month}/${day}/${hour}/${minute}`;
    const dataRef = ref(database, path);

    try {
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        this.setState({ firebaseData: snapshot.val() });
      } else {
        this.setState({ firebaseData: 'No data available for this time.' });
      }
    } catch (error) {
      console.error('Error fetching Firebase data:', error);
      this.setState({ firebaseData: 'Error fetching data.' });
    }
    this.setState({ loading: false });
  };

  openModal = () => {
    this.setState({ isModalVisible: true });
    this.fetchFirebaseData();
  };

  render() {
    const { image, responseText, isModalVisible, firebaseData, loading } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.topRightButton} onPress={this.openModal}>
          <Ionicons name="information-circle-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => this.setState({ isModalVisible: false })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {loading ? (
                <ActivityIndicator size="large" color="#008000" />
              ) : (
                <View>
                  {firebaseData ? (
                    <Text style={styles.modalText}>{JSON.stringify(firebaseData, null, 2)}</Text>
                  ) : (
                    <Text style={styles.modalText}>No data found</Text>
                  )}
                </View>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => this.setState({ isModalVisible: false })}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.title}>TeaMate</Text>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.placeholderText}>No image selected</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={this.pickImage}>
            <Ionicons name="images-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={this.takePhoto}>
            <Ionicons name="camera-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {responseText ? <Text style={styles.responseText}>{responseText}</Text> : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  dashboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topRightButton: {
    position: 'absolute',
    top: 50, // Adjust this value to move the button down (previously 20)
    right: 20,
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A6741',
    marginBottom: 30,
  },
  imageContainer: {
    width: 250,
    height: 250,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  iconButton: {
    backgroundColor: '#4A6741',
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
  },
  responseText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4A6741',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
