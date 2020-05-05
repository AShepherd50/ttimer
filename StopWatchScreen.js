import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Icon from 'react-native-vector-icons/FontAwesome';

class StopWatch extends React.Component {
  interval;
  constructor() {
    super();
    this.state = {
      isRunning: false,
      title: 'Stop Watch',
      hour: 0,
      minute: 0,
      second: 0,
      centisecond: 0,
      placeholder: 0,
    };
  }

  countdown = () => {
    this.setState({isRunning: true});
    this.interval = BackgroundTimer.setInterval(this.secondCount, 5);
  };

  secondCount = () => {
    if (this.state.centisecond === 60) {
      this.setState(prevState => ({
        centisecond: 0,
        second: prevState.second + 1,
        placeholder: 0,
      }));
      if (this.state.second === 59) {
        this.setState(prevState => ({second: 0, minute: prevState.minute + 1}));
        if (this.state.minute === 60) {
          this.setState(prevState => ({hour: prevState.hour + 1, minute: 0}));
        }
      }
    } else {
      this.setState(prevState => ({
        centisecond: prevState.centisecond + 1,
        placeholder: prevState.placeholder + 1.6,
      }));
    }
  };

  pause = () => {
    BackgroundTimer.clearInterval(this.interval);
    this.setState({isRunning: false});
  };

  reset = () => {
    this.setState(prevState => ({
      hour: 0,
      minute: 0,
      second: 0,
      centisecond: 0,
      placeholder: 0,
      isRunning: false,
    }));
    BackgroundTimer.clearInterval(this.interval);
  };

  render() {
    return (
      <View style={styles.app}>
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
          <Text style={styles.smallNumbers}>
            {parseInt(this.state.placeholder)}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttons}>
            <Icon.Button
              name={this.state.isRunning === true ? 'pause' : 'play'}
              onPress={
                this.state.isRunning === true ? this.pause : this.countdown
              }
              style={styles.pushButtons}
              color="white"
              size={30}
            />
          </View>
          <View style={styles.buttons}>
            <Icon.Button
              onPress={this.reset}
              style={styles.pushButtons}
              color="white"
              size={30}
              name="repeat"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    flexDirection: 'row',
    padding: 5,
  },

  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
  },

  buttonRow: {flexDirection: 'row'},

  buttons: {
    borderRadius: 5,
    paddingLeft: 21,
    margin: 15,
  },

  pushButtons: {
    backgroundColor: '#0245EE',
    padding: 30,
    paddingLeft: 30,
  },

  numbers: {fontSize: 72},

  smallNumbers: {
    fontSize: 24,
  },

  header: {fontSize: 24},

  inputStyle: {
    borderWidth: 1,
    borderColor: 'black',
    minWidth: 40,
    marginRight: 20,
    paddingHorizontal: 5,
    borderRadius: 3,
  },

  text: {paddingVertical: 5},
});
export default StopWatch;
