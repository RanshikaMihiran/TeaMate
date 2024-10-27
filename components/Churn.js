import React from 'react';
import { ActivityIndicator, TextInput, View, StyleSheet, TouchableOpacity, Text, Image, AsyncStorage, Dimensions, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import LocalIP from "./localIPAddress";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class Churn extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Churn Prediction',
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
      profit: '',
      price_received: '',
      pet_disease: '',
      humidity: '',
      total: '',
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
    if (this.state.profit != "") {
      if (this.state.price_received != "") {
        if (this.state.pet_disease != "") {
          if (this.state.famer_satistraction != "") {
            this.setState({ loader: true })
            const url = "http://" + LocalIP + ":2222/churn"
            const data = JSON.stringify({ profit: this.state.profit, price_received: this.state.price_received, pet_disease: this.state.pet_disease, famer_satistraction: this.state.famer_satistraction });
            await axios.post(url, data, {
              headers: { "Content-Type": "application/json" }
            }).then(async (res) => {
              console.log(res.data)
              this.setState({ loader: false, result: true })
              if (res.data.res_text == "0") {
                this.setState({ resultTxt: "No Churn" })
              } else {
                this.setState({ resultTxt: "Churn" })
              }
              console.log(res.data.res_text)
            })
          } else {
            this.setState({ title: "Error!", message: "Please Famer Satistraction!" })
            this.showAlert()
          }
        } else {
          this.setState({ title: "Error!", message: "Please Pet Disease!" })
          this.showAlert()
        }
      } else {
        this.setState({ title: "Error!", message: "Please Select Price Received!" })
        this.showAlert()
      }
    } else {
      this.setState({ title: "Required!", message: "Please Select Profit!" })
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

          <Text style={styles.labelText}>Profit:</Text>
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
                selectedValue={this.state.profit}
                style={{
                  width: 100 + '%',
                  height: 45
                }}
                onValueChange={(itemValue, itemIndex) => this.setState({ profit: itemValue })}
              >
                <Picker.Item label="Select Profit" value="" />
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>
          </View>

          <Text style={styles.labelText}>Price Received :</Text>
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
                selectedValue={this.state.price_received}
                style={{
                  width: 100 + '%',
                  height: 45
                }}
                onValueChange={(itemValue, itemIndex) => this.setState({ price_received: itemValue })}
              >
                <Picker.Item label="Select Price Received" value="" />
                <Picker.Item label="Full" value="full" />
                <Picker.Item label="Partial" value="partial" />
                <Picker.Item label="Benefits" value="beneficial" />
              </Picker>
            </View>
          </View>

          <Text style={styles.labelText}>Pet Disease :</Text>
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
                selectedValue={this.state.pet_disease}
                style={{
                  width: 100 + '%',
                  height: 45
                }}
                onValueChange={(itemValue, itemIndex) => this.setState({ pet_disease: itemValue })}
              >
                <Picker.Item label="Select Pet Disease" value="" />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
              </Picker>
            </View>
          </View>

          <Text style={styles.labelText}>Famer Satistraction:</Text>
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
                selectedValue={this.state.famer_satistraction}
                style={{
                  width: 100 + '%',
                  height: 45
                }}
                onValueChange={(itemValue, itemIndex) => this.setState({ famer_satistraction: itemValue })}
              >
                <Picker.Item label="Select Famer Satistraction" value="" />
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>
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