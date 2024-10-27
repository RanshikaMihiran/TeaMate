import React from 'react';
import { ActivityIndicator, TextInput, View, StyleSheet, TouchableOpacity, Text, Image, AsyncStorage, Dimensions, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import LocalIP from "./localIPAddress";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class Price extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Price Prediction',
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

  constructor(props) {
    super(props);

    this.state = {
      region: '',
      quality: '',
      texture: '',
      humidity: '',
      date: '12/31/2000',
      level: '',
      message: '',
      resultTxt: '',
      result: false,
      showAlert: false,
      title: '',
    };

  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      message: '',
      title: ''
    });
  };

  onInsert = async (e) => {
    if (this.state.region != "") {
      if (this.state.quality != "") {
        if (this.state.texture != "") {
          if (this.state.date != "") {
            if (this.state.level != "") {
              this.setState({ loader: true })
              const url = "http://" + LocalIP + ":2222/price"
              const data = JSON.stringify({ region: this.state.region, quality: this.state.quality, texture: this.state.texture, date: this.state.date, water_level: this.state.level });
              await axios.post(url, data, {
                headers: { "Content-Type": "application/json" }
              }).then(async (res) => {
                console.log(res.data)
                this.setState({ loader: false, result: true })
                this.setState({ resultTxt: "Predicted Price : "+ res.data.predicted_price})
                console.log(res.data.res_text)
              })
            } else {
              this.setState({ title: "Error!", message: "Please Water Level!" })
              this.showAlert()
            }
          } else {
            this.setState({ title: "Error!", message: "Please Date supply leaf!" })
            this.showAlert()
          }
        } else {
          this.setState({ title: "Error!", message: "Please Texture!" })
          this.showAlert()
        }
      } else {
        this.setState({ title: "Error!", message: "Please Select Quality!" })
        this.showAlert()
      }
    } else {
      this.setState({ title: "Required!", message: "Please Select Region!" })
      this.showAlert()
    }
  }

  render() {
    const { showAlert } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>

          <View style={styles.center}>
            <Image
              source={require("./../assets/tea.png")}
              style={{ width: 150, height: 150, marginBottom: 20, marginTop: 10 }}
            />
          </View>

          <Text style={styles.labelText}>Date Format(MM/DD/YYYY):</Text>
          <View style={styles.center}>
            <TextInput
              value={this.state.date}
              onChangeText={(date) => this.setState({ date })}
              placeholder={'Date'}
              style={styles.input}
            />
          </View>

          <Text style={styles.labelText}>Region:</Text>
          <View style={styles.center}>
            <View
              style={{
                borderBottomWidth: 1,
                width: 80 + '%',
                height: 45,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: '#c4c4c4',
                color: '#000000'
              }}>
              <Picker
                selectedValue={this.state.region}
                style={{
                  width: 100 + '%',
                  height: 45
                }}
                onValueChange={(itemValue, itemIndex) => this.setState({ region: itemValue })}
              >
                <Picker.Item label="Select Region" value="" />
                <Picker.Item label="Nuwara Eliya" value="Nuwara Eliya" />
                <Picker.Item label="Uda Pussellawa" value="Uda Pussellawa" />
                <Picker.Item label="Dimbula" value="Dimbula" />
                <Picker.Item label="Ruhuna" value="5" />
                <Picker.Item label="Sabaragamuwa" value="6" />
                <Picker.Item label="Kandy" value="7" />
              </Picker>
            </View>
          </View>

          <Text style={styles.labelText}>Quality :</Text>
          <View style={styles.center}>
            <View
              style={{
                borderBottomWidth: 1,
                width: 80 + '%',
                height: 45,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: '#c4c4c4',
                color: '#000000'
              }}>
              <Picker
                selectedValue={this.state.quality}
                style={{
                  width: 100 + '%',
                  height: 45
                }}
                onValueChange={(itemValue, itemIndex) => this.setState({ quality: itemValue })}
              >
                <Picker.Item label="Select Quality" value="" />
                <Picker.Item label="Below Best" value="Below Best" />
                <Picker.Item label="Best" value="Best" />
              </Picker>
            </View>
          </View>

          <Text style={styles.labelText}>Texture :</Text>
          <View style={styles.center}>
            <View
              style={{
                borderBottomWidth: 1,
                width: 80 + '%',
                height: 45,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: '#c4c4c4',
                color: '#000000'
              }}>
              <Picker
                selectedValue={this.state.texture}
                style={{
                  width: 100 + '%',
                  height: 45
                }}
                onValueChange={(itemValue, itemIndex) => this.setState({ texture: itemValue })}
              >
                <Picker.Item label="Select Texture" value="" />
                <Picker.Item label="Fresh" value="fresh" />
                <Picker.Item label="Smooth" value="smooth" />
                <Picker.Item label="Coarse" value="coarse" />
              </Picker>
            </View>
          </View>

          <Text style={styles.labelText}>Water Level (%):</Text>
          <View style={styles.center}>
            <TextInput
              value={this.state.level}
              onChangeText={(level) => this.setState({ level })}
              placeholder={'Level'}
              keyboardType='numeric'
              style={styles.input}
            />
          </View>

          <View style={styles.center}>
            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={this.onInsert}>
              {!this.state.loader ? (
                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Submit</Text>
              ) : null}
              {this.state.loader ? (
                <ActivityIndicator size="large" color={"#008000"} />
              ) : null}
            </TouchableOpacity>
          </View>

          {this.state.result == true ? ([
            <View style={styles.center}>
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.state.resultTxt}</Text>
              </View>
            </View>]
          ) : null}

          <AwesomeAlert
            show={showAlert}
            title={this.state.title}
            message={this.state.message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            cancelButtonColor="#008000"
            onCancelPressed={() => {
              this.hideAlert();
            }}
          />

        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    alignItems: 'center',
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10 + '%'
  },
  firstLabelText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10 + '%',
    marginTop: 2 + '%',
  },
  input: {
    borderBottomWidth: 1,
    width: 80 + '%',
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#c4c4c4',
    color: '#000000'
  },
  TextInputStyleClass: {
    borderBottomWidth: 1,
    width: 80 + '%',
    height: 100,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    borderBottomColor: '#c4c4c4',
    color: '#000000'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 80 + '%',
    height: 40,
    borderRadius: 60
  },
  loginButton: {
    backgroundColor: "#008000",
  },
  registerButton: {
    backgroundColor: "#ffc400",
  }
});