import React from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  Button,
  Vibration,
  Dimensions,
  ScrollView,
} from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';
import {withNavigation} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackgroundTimer from 'react-native-background-timer';

class Timer extends React.Component {
  state = {
    isRunning: false,
    title: '',
    breakHr: 0,
    breakMin: 0,
    breakSec: 0,
    header: 'Select Active Profile',
    hour: 0,
    minute: 0,
    second: 0,
    isBreak: false,
    index: 0,
    position: 0,
    repeat: 1,
    activeProfile: '',
    profiles: [],
    modalVisible: false,
  };
  interval;

  getAllKeys = async () => {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (err) {
      alert('Unable to retrieve Keys');
    }
  };

  updateData = async () => {
    //Get Storage Keys for All profiles
    let keys = await this.getAllKeys();

    //Populate profiles array with previously created Profiles
    const results = keys.map(async key => {
      return await readData(key);
    });

    Promise.all(results)
      .then(results => this.setState({profiles: results}))
      .catch(e => {
        alert('Its not you its Me :(');
      });
  };

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.updateData();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  countdown = () => {
    this.setState({isRunning: true});
    this.interval = BackgroundTimer.setInterval(this.timeCheck, 1000);
  };

  secondCount = () => {
    if (this.state.second === 0) {
      this.setState(prevState => ({second: 59, minute: prevState.minute - 1}));
    } else {
      this.setState(prevState => ({second: this.state.second - 1}));
    }
  };

  pause = () => {
    BackgroundTimer.clearInterval(this.interval);
    this.setState({isRunning: false});
  };

  reset = () => {
    if (this.state.activeProfile === '') {
    } else {
      this.setState(prevState => ({
        hour: this.state.activeProfile.userActivities[0].hour,
        minute: this.state.activeProfile.userActivities[0].minute,
        second: this.state.activeProfile.userActivities[0].sec,
        title: this.state.activeProfile.userActivities[0].title,
        repeat: this.state.activeProfile.userActivities[0].repeat,
        position: 0,
        isRunning: false,
      }));
      BackgroundTimer.clearInterval(this.interval);
    }
  };

  timeCheck = async () => {
    if (this.state.activeProfile !== '') {
      if (
        this.state.hour === 0 &&
        this.state.minute === 0 &&
        this.state.second === 4
      ) {
        let Sound = require('react-native-sound');

        Sound.setCategory('Playback', true);

        let noise = new Sound('countdown.wav', Sound.MAIN_BUNDLE, error => {
          if (error) {
            alert('No Sound');
            return false;
          }
          noise.play(success => {
            if (success) {
            }
          });
        });
      }

      if (
        this.state.hour === 0 &&
        this.state.minute === 0 &&
        this.state.second === 1
      ) {
        Vibration.vibrate(2000, false);
      }
      if (
        this.state.hour === 0 &&
        this.state.minute === 0 &&
        this.state.second === 0
      ) {
        if (this.state.isBreak === true && this.state.title !== 'Break') {
          this.setState({
            hour: this.state.breakHr,
            minute: this.state.breakMin,
            second: this.state.breakSec,
            title: 'Break',
          });
        } else if (this.state.repeat > 1) {
          let currentAct = this.state.activeProfile.userActivities[
            this.state.position
          ];

          this.setState({
            hour: currentAct.hour,
            minute: currentAct.minute,
            second: parseInt(currentAct.sec) + 2,
            title: currentAct.title,
            repeat: this.state.repeat - 1,
          });
        } else {
          this.setState({position: this.state.position + 1});

          if (this.state.position !== this.state.index) {
            let nextActivity = this.state.activeProfile.userActivities[
              this.state.position
            ];
            this.setState({
              hour: nextActivity.hour,
              minute: nextActivity.minute,
              second: parseInt(nextActivity.sec) + 2,
              title: nextActivity.title,
              repeat: nextActivity.repeat,
              isBreak: nextActivity.isBreak,
              breakHr: nextActivity.breakHr,
              breakMin: nextActivity.breakMin,
              breakSec: parseInt(nextActivity.breakSec) + 2,
            });
          } else {
            this.reset();
          }
        }
        this.secondCount();
      }
      this.secondCount();
    }
  };

  handleProfileSelect = props => {
    let timings = [];
    this.setState({
      activeProfile: props,
      modalVisible: false,
      header: props.name,
    });
    timings = props.userActivities;
    let i = timings.length;

    if (i !== 0) {
      this.setState({
        index: i,
        hour: timings[this.state.position].hour,
        minute: timings[this.state.position].minute,
        second: timings[this.state.position].sec,
        title: timings[this.state.position].title,
        isBreak: timings[this.state.position].isBreak,
        repeat: timings[this.state.position].repeat,
        breakHr: timings[this.state.position].breakHr,
        breakMin: timings[this.state.position].breakMin,
        breakSec: parseInt(timings[this.state.position].breakSec) + 2,
      });
    }
  };

  render() {
    return (
      <View style={this.state.title === 'Break' ? styles.appBreak : styles.app}>
        <View style={styles.picker}>
          <Modal
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}>
            <View>
              <ScrollView>
                {this.state.profiles.map(profile => (
                  <AwesomeButton
                    key={profile.name}
                    style={styles.openButton}
                    backgroundActive="blue"
                    backgroundColor="white"
                    backgroundShadow="blue"
                    stretch={true}
                    onPress={() => {
                      this.handleProfileSelect(profile);
                    }}>
                    <Text style={styles.selectionText}>{profile.name}</Text>
                  </AwesomeButton>
                ))}
              </ScrollView>
              <Button
                title="Close"
                onPress={() => {
                  this.setState({modalVisible: false});
                }}
              />
            </View>
          </Modal>
        </View>
        {!this.state.modalVisible && (
          <AwesomeButton
            style={styles.openButton}
            stretch={true}
            backgroundActive="#808080"
            backgroundColor="#E5E5E5"
            backgroundShadow="black"
            onPress={() => {
              this.setState({modalVisible: true});
            }}>
            <Text style={styles.activeTitle}>{this.state.header}</Text>
          </AwesomeButton>
        )}
        <Text style={styles.header}>{this.state.title}</Text>
        <View style={styles.timer}>
          <Text style={styles.numbers}>
            {(this.state.hour < 10 ? '0' : '') + this.state.hour}
          </Text>
          <Text style={styles.numbers}>:</Text>
          <Text style={styles.numbers}>
            {(this.state.minute < 10 ? '0' : '') + this.state.minute}
          </Text>
          <Text style={styles.numbers}>:</Text>
          <Text style={styles.numbers}>
            {(this.state.second < 10 ? '0' : '') + this.state.second}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <Text style={styles.setText}>Sets Remaining </Text>
          <Text style={styles.setText}>{this.state.repeat}</Text>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttons}>
            <Icon.Button
              name={this.state.isRunning === true ? 'pause' : 'play'}
              onPress={
                this.state.isRunning === true ? this.pause : this.countdown
              }
              style={styles.pushButtons}
              color="black"
              size={25}
            />
          </View>
          <View style={styles.buttons}>
            <Icon.Button
              style={styles.pushButtons}
              onPress={this.reset}
              color="black"
              size={25}
              name="repeat"
            />
          </View>
        </View>
      </View>
    );
  }
}

async function readData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (err) {
    alert('Unable to retrieve saved profiles');
  }
}
export default withNavigation(Timer);

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#2E8B57',
  },

  appBreak: {
    flex: 1,
    backgroundColor: '#3ACDF6',
  },

  activeTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    alignSelf: 'center',
    color: 'black',
  },

  timer: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingLeft: 10,
  },

  buttonRow: {
    flexDirection: 'row',
    alignSelf: 'center',
  },

  buttons: {
    borderRadius: 5,
    paddingLeft: 21,
    margin: 15,
  },

  numbers: {fontSize: 90},

  header: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 125,
    alignSelf: 'center',
  },

  pushButtons: {
    backgroundColor: '#E5E5E5',
    padding: 30,
    paddingLeft: 30,
  },

  inputStyle: {
    borderWidth: 1,
    borderColor: 'black',
    minWidth: 40,
    marginRight: 20,
    paddingHorizontal: 5,
    borderRadius: 3,
  },

  dropdown: {
    width: Math.round(Dimensions.get('window').width) - 150,
  },

  picker: {
    alignSelf: 'center',
    backgroundColor: 'white',
  },

  text: {paddingVertical: 5},

  openButton: {
    alignSelf: 'center',
    justifyContent: 'center',
  },

  selectionText: {
    fontSize: 16,
    alignItems: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'black',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  setText: {
    fontSize: 36,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
