import React, { useState, useEffect } from 'react';
import {  
  Button,
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ToastAndroid,
} from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial';
import NoteButton from './components/NoteButton';

const App = () => {

  const [isEnabled, setEnable] = useState(false);
  const [discovering, setDiscoverable] = useState(false);
  const [devices, setDevices] = useState([]);
  const [unpairedDevices, setUnpairedDevices] = useState([]);
  const [connected, setConnected] = useState(false);

  const keyboardButtonList = [
    {stringName: 'C', fnArg: 'C'},
    {stringName: 'C#', fnArg: 'c'},
    {stringName: 'D', fnArg: 'D'},
    {stringName: 'D#', fnArg: 'd'},
    {stringName: 'E', fnArg: 'E'},
    {stringName: 'F', fnArg: 'F'},
    {stringName: 'G', fnArg: 'G'},
    {stringName: 'G#', fnArg: 'g'},
    {stringName: 'A', fnArg: 'A'},
    {stringName: 'A#', fnArg: 'a'},   
    {stringName: 'B', fnArg: 'B'},
    {stringName: 'No Note', fnArg: '0'},
  ];

  useEffect(() => {
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()      
    ])
    .then((values) => {
      const [enabled, deviceList] = values;
      setEnable(enabled);
      console.log(enabled);
      setDevices(deviceList);
      console.log(deviceList);
    });

    BluetoothSerial.on('bluetoothEnabled', () => {
      Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ])
      .then((values) => {
        const [enable, deviceList] = values;        
        setDevices(deviceList);
      });
    });

    BluetoothSerial.on('bluetoothDisabled', () => {
      setDevices([]);
    });

    BluetoothSerial.on('error', (err) => {
      console.log(`Error: ${err.message}`);
    });

  }, []);

  const connect = (device) => {
    setConnected(true);
    BluetoothSerial.connect(device.id)
    .then((res) => {
      console.log(`Connected to device: ${device.name}`);

      ToastAndroid.show(`Connected to device: ${device.name}`, ToastAndroid.SHORT);
    })
    .catch((err) => console.log(err.message));
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => connect(item.item)}
      >
        <View style={styles.deviceNameWrap}>
          <Text style={styles.deviceName}>{ item.item.name ? item.item.name : item.item.id }</Text>
        </View>
      </TouchableOpacity>
    )
  };

  const enable = () => {
    BluetoothSerial.enable()
    .then((res) => setEnable(true))
    .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT));
  };

  const disable = () => {
    BluetoothSerial.disable()
    .then((res) => setEnable(false))
    .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT));
  };

  const toggleBluetooth = (value) => {
    if (value === true) {
      enable();
    } else {
      disable();
    }
  };

  const discoverableDevices = () => {
    console.log('scan for devices btn clicked');
    if (discovering) {
      setDiscoverable(false);
    } else {
      setDiscoverable(true);
      BluetoothSerial.discoverUnpairedDevices()
      .then((unpairedDevices) => {
        setUnpairedDevices(unpairedDevices);
        console.log(`Unpaired Devices: ${unpairedDevices.length}`);
        setDiscoverable(false);
      })
      .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT));
    }
  };

  const onOffButton = (note) => {
    BluetoothSerial.write(note)
    .then((res) => {
      console.log(res);
      console.log(`Successfully wrote to device: ${note}`);
      setConnected(true);
    })
    .catch((err) => console.log(err.message));
  };

  const keyboardButtons =  keyboardButtonList.map(({stringName, fnArg}) => {
    return (
      <NoteButton btnText={stringName} onPress={() => onOffButton(fnArg)}/>
    )
  });

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Bluetooth Device List</Text>
        <View style={styles.toobarButton}>
          <Switch
            value={isEnabled}
            onValueChange={(val) => toggleBluetooth(val)}
          />
        </View>
      </View>

      <Button
        onPress={() => discoverableDevices()}
        title='Scan for Devices'
        color='#4F5D2F'
      />

      <FlatList
        style={{ flex: 1 }}
        data={devices}
        keyExtractor={item => item.id}
        renderItem={(item => renderItem(item))}
      />

      <View style={styles.keyboardBtns}>
        {keyboardButtons}
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD6EA',
    padding: 5,
  },
  toolbar: {
    paddingTop: 30,
    paddingBottom: 30,
    flexDirection: 'row',
  },
  toolbarButton: {
    width: 50,
    marginTop: 8,
  },
  toolbarTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    marginTop: 6,
  },
  deviceName: {
    fontSize: 17,
    color: '#423629',
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth: 1,
  },
  keyboardBtns: {
    flex: 1,
    flexWrap: 'wrap',
    margin: 10,
    alignContent: 'center',
  },
});

export default App;