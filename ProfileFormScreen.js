import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  Button,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const DisplayActivity = props => {
  if (props.activity.isBreak) {
    return (
      <View style={styles.set}>
        <View style={styles.activityId}>
          <Text style={styles.textId}>{props.activity.key}</Text>
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.text}>Title: {props.activity.title}</Text>
          <Text style={styles.text}>
            Time:
            {props.activity.hour === '' ? '00' : props.activity.hour}:
            {props.activity.minute === ''
              ? '00'
              : (props.activity.minute < 10 ? 0 : '') + props.activity.minute}
            :
            {props.activity.sec === ''
              ? '00'
              : (props.activity.sec < 10 ? 0 : '') + props.activity.sec}
          </Text>
          <Text style={styles.text}>Cycles: {props.activity.repeat}</Text>
          <Text style={styles.text}>
            Break per Cycle:
            {props.activity.breakHr === '' ? '00' : props.activity.breakHr}:
            {props.activity.breakMin === ''
              ? '00'
              : (props.activity.breakMin < 10 ? 0 : '') +
                props.activity.breakMin}
            :
            {props.activity.breakSec === ''
              ? '00'
              : (props.activity.breakSec < 10 ? 0 : '') +
                props.activity.breakSec}
          </Text>
        </View>
        <View style={styles.buttonArea}>
          <Icon.Button
            style={styles.deleteButton}
            backgroundColor="transparent"
            color="black"
            onPress={props.onDelete}
            name="trash"
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.set}>
        <View style={styles.activityId}>
          <Text style={styles.textId}>{props.activity.key}</Text>
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.text}>Title: {props.activity.title}</Text>
          <Text style={styles.text}>
            Time:
            {props.activity.hour === '' ? '00' : props.activity.hour}:
            {props.activity.minute === ''
              ? '00'
              : (props.activity.minute < 10 ? 0 : '') + props.activity.minute}
            :
            {props.activity.sec === ''
              ? '00'
              : (props.activity.sec < 10 ? 0 : '') + props.activity.sec}
          </Text>
          <Text style={styles.text}>Cycles: {props.activity.repeat}</Text>
        </View>
        <View style={styles.buttonArea}>
          <Icon.Button
            style={styles.deleteButton}
            backgroundColor="transparent"
            color="black"
            onPress={props.onDelete}
            name="trash"
          />
        </View>
      </View>
    );
  }
};
export default class ProfileFormScreen extends React.Component {
  static navigationOptions = ({navigation, route}) => ({
    headerTitle: 'Create Profile',
    headerRight: () => (
      <Button
        title="Add Activity"
        onPress={() => navigation.navigate('ActivityForm')}
      />
    ),
  });
  constructor() {
    super();
    this.state = {
      key: '',
      name: '',
      userActivities: [],
      totalHr: 0,
      totalMin: 0,
      totalSec: 0,
      isValid: false,
    };
  }

  handleName = props => {
    this.setState({name: props});
  };

  handleSubmit = () => {
    if (this.state.name === '') {
      alert('You must Provide a title for this Profile');
      return false;
    } else if (this.state.userActivities.length === 0) {
      alert('Please add an Activity to your Profile');
      return false;
    } else {
      this.setState({isValid: true});
    }
    let index = this.state.userActivities.length;
    let hr = 0;
    let min = 0;
    let second = 0;

    //add all user inputs for all activities
    for (let i = 0; i < index; i++) {
      hr =
        hr +
        (parseInt(this.state.userActivities[i].breakHr) *
          parseInt(this.state.userActivities[i].repeat) +
          parseInt(this.state.userActivities[i].hour) *
            parseInt(this.state.userActivities[i].repeat));
      min =
        min +
        (parseInt(this.state.userActivities[i].breakMin) *
          parseInt(this.state.userActivities[i].repeat) +
          parseInt(this.state.userActivities[i].minute) *
            parseInt(this.state.userActivities[i].repeat));
      second =
        second +
        parseInt(this.state.userActivities[i].breakSec) *
          parseInt(this.state.userActivities[i].repeat) +
        parseInt(this.state.userActivities[i].sec) *
          parseInt(this.state.userActivities[i].repeat);
    }

    //Convert everything to seconds
    hr = hr * 3600;
    min = min * 60;
    second = second + min + hr;

    //Calculate everything into proper time format
    let newHr = Math.floor(second / 3600);
    let newMin = Math.floor((second - newHr * 3600) / 60);
    let newSec = second - newHr * 3600 - newMin * 60;

    this.setState({totalHr: newHr, totalMin: newMin, totalSec: newSec}, () =>
      this.props.navigation.navigate('Profiles', {profile: this.state}),
    );
  };

  deleteActivity = props => {
    this.setState({
      userActivities: this.state.userActivities.filter(
        activity => activity.key !== props,
      ),
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      let actId = this.state.userActivities.length;
      actId++;
      this.setState(prevState => ({
        userActivities: [
          ...this.state.userActivities,
          {
            key: actId,
            title: this.props.route.params.title,
            hour: this.props.route.params.hour,
            minute: this.props.route.params.minute,
            sec: this.props.route.params.sec,
            repeat: this.props.route.params.repeat,
            isBreak: this.props.route.params.isBreak,
            breakHr:
              this.props.route.params.breakHr === undefined
                ? 0
                : this.props.route.params.breakHr,
            breakMin:
              this.props.route.params.breakMin === undefined
                ? 0
                : this.props.route.params.breakMin,
            breakSec:
              this.props.route.params.breakSec === undefined
                ? 0
                : this.props.route.params.breakSec,
          },
        ],
      }));
    }
  }

  componentDidMount() {
    if (this.props.route.params !== undefined) {
      this.setState({
        name: this.props.route.params.name,
        totalHr: this.props.route.params.totalHr,
        totalMin: this.props.route.params.totalMin,
        totalSec: this.props.route.params.totalSec,
        userActivities: this.props.route.params.userActivities,
        key: this.props.route.params.key,
      });
    }
  }

  render() {
    return (
      <View>
        <View style={styles.top}>
          <Text
            style={{
              paddingRight: 10,
              paddingTop: 5,
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            Profile Name:
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={this.handleName}
            value={this.state.name}
          />
        </View>

        <ScrollView>
          {this.state.userActivities.map(activities => (
            <DisplayActivity
              key={activities.key}
              activity={activities}
              onDelete={() => {
                this.deleteActivity(activities.key);
              }}
            />
          ))}
        </ScrollView>
        <Button title="Save" onPress={this.handleSubmit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  set: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#F0FFFF',
    flexDirection: 'row',
  },

  activityId: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: 50,
    height: 75,
    backgroundColor: 'transparent',
  },

  activityContent: {
    alignItems: 'center',
    width: Math.round(Dimensions.get('window').width) - 150,
  },

  text: {
    fontWeight: 'bold',
  },

  textId: {
    paddingTop: 30,
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#c2d4dd',
    width: Math.round(Dimensions.get('window').width),
    height: 40,
  },

  top: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
  },

  buttonArea: {
    width: 50,
    marginLeft: 45,
  },

  deleteButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    borderWidth: 1,
    paddingLeft: 15,
  },
});
