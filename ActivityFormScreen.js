import React from 'react';
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  Switch,
} from 'react-native';

export default function ActivityFormScreen({navigation, route}) {
  const [title, setTitle] = React.useState('');
  const [hour, setHour] = React.useState(0);
  const [minute, setMinute] = React.useState(0);
  const [sec, setSec] = React.useState(0);
  const [repeat, setRepeat] = React.useState(1);
  const [breakHr, setBreakHr] = React.useState(0);
  const [breakMin, setBreakMin] = React.useState(0);
  const [breakSec, setBreakSec] = React.useState(0);
  const [isBreak, setBreak] = React.useState(false);
  const toggleSwitch = () => setBreak(previousState => !previousState);

  if (!isBreak) {
    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.text}>Title:</Text>
          <TextInput style={styles.input} onChangeText={setTitle} />
        </View>
        <View style={styles.container}>
          <Text style={styles.text}>Time:</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="HR"
            placeholderTextColor="black"
            keyboardType="numeric"
            onChangeText={setHour}
          />
          <Text style={styles.text}>:</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="MIN"
            placeholderTextColor="black"
            keyboardType="numeric"
            onChangeText={setMinute}
          />
          <Text style={styles.text}>:</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="SEC"
            placeholderTextColor="black"
            keyboardType="numeric"
            onChangeText={setSec}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.text}>Number of Cycles:</Text>
          <TextInput
            style={styles.smallInput}
            keyboardType="numeric"
            onChangeText={setRepeat}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.text}>Include a Break Between Each Cycle?</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isBreak ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isBreak}
          />
        </View>

        <Button
          title="Done"
          style={styles.button}
          onPress={() => {
            if (minute > 60 || sec > 60) {
              alert('You must provide a valid time');
              return false;
            }
            navigation.navigate({
              name: 'ProfileFormScreen',
              params: {
                title: title,
                hour: hour,
                minute: minute,
                sec: sec,
                repeat: repeat,
                isBreak: isBreak,
              },
            });
          }}
        />
      </View>
    );
  } else {
    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.text}>Title:</Text>
          <TextInput style={styles.input} onChangeText={setTitle} />
        </View>
        <View style={styles.container}>
          <Text style={styles.text}>Time:</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="HR"
            placeholderTextColor="black"
            keyboardType="numeric"
            onChangeText={setHour}
          />
          <Text style={styles.text}>:</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="MIN"
            placeholderTextColor="black"
            keyboardType="numeric"
            onChangeText={setMinute}
          />
          <Text style={styles.text}>:</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="SEC"
            placeholderTextColor="black"
            keyboardType="numeric"
            onChangeText={setSec}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.text}>Number of Cycles:</Text>
          <TextInput
            style={styles.smallInput}
            keyboardType="numeric"
            onChangeText={setRepeat}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.text}>Include a Break Between Each Cycle?</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isBreak ? '#81b0ff' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isBreak}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.text}>Break Time:</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="HR"
            placeholderTextColor="black"
            onChangeText={setBreakHr}
            keyboardType="numeric"
          />
          <Text style={styles.text}>:</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="MIN"
            placeholderTextColor="black"
            onChangeText={setBreakMin}
            keyboardType="numeric"
          />
          <Text style={styles.text}>:</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="SEC"
            placeholderTextColor="black"
            onChangeText={setBreakSec}
            keyboardType="numeric"
          />
        </View>

        <Button
          title="Done"
          style={styles.button}
          onPress={() => {
            if (minute > 60 || sec > 60) {
              alert('You must provide a valid time');
              return false;
            }
            if (breakMin > 60 || breakSec > 60) {
              alert('You must provide a valid time for your break');
              return false;
            }
            navigation.navigate({
              name: 'ProfileFormScreen',
              params: {
                title: title,
                hour: hour,
                minute: minute,
                sec: sec,
                repeat: repeat,
                isBreak: isBreak,
                breakHr: breakHr,
                breakMin: breakMin,
                breakSec: breakSec,
              },
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  smallInput: {
    width: 50,
    height: 50,
    paddingLeft: 10,
    backgroundColor: '#c2d4dd',
  },

  text: {
    fontWeight: 'bold',
    padding: 5,
    marginTop: 10,
  },

  input: {
    width: Math.round(Dimensions.get('window').width),
    backgroundColor: '#c2d4dd',
    height: 50,
  },

  inputBorder: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    width: 75,
  },

  button: {
    width: Math.round(Dimensions.get('window').width) / 2,
  },
});
