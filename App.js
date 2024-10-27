import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import Device from './components/Device';
import Water_Auto from './components/WaterAuto';
import Water_Condition from './components/Water';
import Churn from './components/Churn';
import Price from './components/Price';
import Loading from './components/Loading';
import ForgotPassword from './components/ForgotPassword';
import Welcome from './components/Welcome';
import { initializeApp } from "firebase/app";
import { LogBox } from 'react-native';
import Quality_Check from './components/QualityCheck';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Warning: ...'], (isAffected, bundle) => {
  return isAffected || bundle.includes('example.js');
});
 
const firebaseConfig = {
  apiKey: "AIzaSyCwtNsusBOUayMXy7ctFy98S4oqbOGQ8EU",
  authDomain: "iot-water-research-2024.firebaseapp.com",
  projectId: "iot-water-research-2024",
  storageBucket: "iot-water-research-2024.appspot.com",
  messagingSenderId: "134174858078",
  appId: "1:134174858078:web:01d0496ac1167df287cdcf",
  measurementId: "G-SHCXMVCW57"
};

initializeApp(firebaseConfig);

const App = createStackNavigator({
    Loading                     : { screen: Loading }, 
    Welcome                     : { screen: Welcome },
    HomePage                    : { screen: HomePage },
    Device                    : { screen: Device },
    Login                       : { screen: Login }, 
    Register                    : { screen: Register },
    ForgotPassword              : { screen: ForgotPassword },
    Water_Auto                  : { screen: Water_Auto },
    Water_Condition             : { screen: Water_Condition },
    Churn                       : { screen: Churn },
    Price                       : { screen: Price },
    Quality_Check               : {screen : Quality_Check}
  },
  {
    initialRouteName: 'Loading',
  }
);
export default createAppContainer(App);