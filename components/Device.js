import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from "axios";
import LocalIP from "./localIPAddress";
import ESP32IP from "./ESP32IP";

export default class Device extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fan1: '0',
      fan2: '0',
      fan3: '0',
      humidifier: '0',
      light: '',
      temperature: '',
      humidity: '',
      message: '',
      showAlert: false,
      title: ''
    };

  }

  componentDidMount = async () => {
    this.setState({ loader: true })
    const url = "http://" + ESP32IP + "/data"
    await axios.get(url, {
      headers: { "Content-Type": "application/json" },
      timeout: 20000
    }).then(async (res) => {
      console.log(res.data)
      this.setState({ loader: false, humidity: res.data.humidity + "", temperature: res.data.temperature + "", light: res.data.light + "" })
    })
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Devices Control',
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

  fun_fan1 = async () => {
    if (this.state.fan1 == "0") {
      this.call_fun(1,this.state.fan2,this.state.fan3,this.state.humidifier)
    } else {
      this.call_fun(0,this.state.fan2,this.state.fan3,this.state.humidifier)
    }
  };

  fun_fan2 = async () => {
    if (this.state.fan1 == "0") {
      this.call_fun(this.state.fan1,1,this.state.fan3,this.state.humidifier)
    } else {
      this.call_fun(this.state.fan1,0,this.state.fan3,this.state.humidifier)
    }
  };

  fun_fan3 = async () => {
    if (this.state.fan1 == "0") {
      this.call_fun(this.state.fan1,this.state.fan2,1,this.state.humidifier)
    } else {
      this.call_fun(this.state.fan1,this.state.fan2,0,this.state.humidifier)
    }
  };

  fun_humidifier = async () => {
    if (this.state.fan1 == "0") {
      this.call_fun(this.state.fan1,this.state.fan2,this.state.fan3,1)
    } else {
      this.call_fun(this.state.fan1,this.state.fan2,this.state.fan3,0)
    }
  };

  call_fun = async (fan1,fan2,fan3,humidifier) => {
    const url = "http://" + ESP32IP + "/control?fan1="+fan1+"&fan2="+fan2+"&fan3="+fan3+"&hu_f="+humidifier
    await axios.get(url, {
      headers: { "Content-Type": "application/json" },
      timeout: 20000
    }).then(async (res) => {
      console.log(res.data)
      this.setState({fan1:res.data.fan1,fan2:res.data.fan2,fan3:res.data.fan3,humidifier:res.data.hu_f})
    })
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

  render() {
    const { showAlert } = this.state;
    return (
      <View style={styles.container}>
        <Image source={require('./../assets/tea.png')}
          style={{ width: 200, height: 200, marginBottom: 40 }} />
        <View style={styles.center}>
          {!this.state.loader ? (
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Temperature : {this.state.temperature} °C</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Humidity : {this.state.humidity} %</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Light Value : {this.state.light} </Text>
            </View>
          ) : null}
          {this.state.loader ? (
            <ActivityIndicator size="large" color={"#000000"} />
          ) : null}
        </View>
        <View style={styles.dashboardContainer}>
          <TouchableOpacity style={styles.card} onPress={this.fun_fan1}>
            <MaterialCommunityIcons name="fan" color='#4CAF50' size={48} />
            <Text style={styles.cardText}>Fan 1</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={this.fun_fan2}>
            <MaterialCommunityIcons name="fan" color='#4CAF50' size={48} />
            <Text style={styles.cardText}>Fan 2</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={this.fun_fan3}>
            <MaterialCommunityIcons name="fan" color='#4CAF50' size={48} />
            <Text style={styles.cardText}>Fan 3</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={this.fun_humidifier}>
            <MaterialCommunityIcons name="air-humidifier" color='#3F51B5' size={48} />
            <Text style={styles.cardText}>Humidifier</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.center}>
          {this.state.fan1 == "0" ? (
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Fan 1 Status : Turn ON</Text>
          ) : (<Text style={{ fontWeight: 'bold', fontSize: 18 }}>Fan 1 Status : Turn OFF</Text>)}
          {this.state.fan2 == "0" ? (
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Fan 2 Status : Turn ON</Text>
          ) : (<Text style={{ fontWeight: 'bold', fontSize: 18 }}>Fan 2 Status : Turn OFF</Text>)}
          {this.state.fan3 == "0" ? (
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Fan 3 Status : Turn ON</Text>
          ) : (<Text style={{ fontWeight: 'bold', fontSize: 18 }}>Fan 3 Status : Turn OFF</Text>)}
          {this.state.humidifier == "0" ? (
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Humidifier Status : Turn ON</Text>
          ) : (<Text style={{ fontWeight: 'bold', fontSize: 18 }}>Humidifier Status : Turn OFF</Text>)}
        </View>

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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  input: {
    borderBottomWidth: 1,
    width: 80 + '%',
    height: 45,
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
    backgroundColor: "#0e2025",
  },
  dashboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
  },
  card: {
    width: 40 + '%',
    height: 120,
    margin: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});