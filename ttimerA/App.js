import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import Timer from './Timer'
import StopWatch from './StopWatchScreen'
import Profiles from './Profiles'
import ProfileFormScreen from "./ProfileFormScreen";
import ActivityFormScreen from './ActivityFormScreen'
import { navigationRef } from "./RootNavigation";

const Stack = createStackNavigator();
enableScreens()

function TimerScreen(){
  return(
      <View style={styles.container}>
        <Timer />
      </View>
  )
}

function StopWatchScreen(){
  return(
      <View style={styles.container}>
        <StopWatch />
      </View>
  )
}

function TimingSetup(){
  return(
      <Stack.Navigator>
        <Stack.Screen
            name="Profiles"
            component={Profiles}
            options={({ navigation, route }) => ({
              headerTitle: 'Timing Profiles',
              headerRight: ()=>(
                  <Button
                      title="Add"
                      onPress={()=> navigation.navigate('ProfileFormScreen')}
                  />
              )
            })}
        />
        <Stack.Screen
            name="ProfileFormScreen"
            component={ProfileFormScreen}
            options={({ navigation, route }) => ({
              headerTitle: 'Create Profile',
              headerRight: ()=>(
                  <Button
                      title="Add Activity"
                      onPress={()=> navigation.navigate('ActivityForm')}
                  />
              )
            })}
        />
        <Stack.Screen
            name="ActivityForm"
            component={ActivityFormScreen}
        />
      </Stack.Navigator>

  )
}

const Tab = createBottomTabNavigator()


export default function App() {
  return (
      <SafeAreaProvider>
        <NavigationContainer  ref={navigationRef}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                tabBarIcon: ({focused, size}) => {
                    let iconName;

                    switch (route.name) {
                    case 'Timer':
                        iconName = focused?
                            "md-hourglass": "md-hourglass"
                        break;
                    case 'StopWatch':
                        iconName = focused?
                            "md-time": "md-time"
                        break;
                        case 'Profiles':
                        iconName = focused?
                             "md-save"  : "md-save";
                        break;
                    default:
                        break;
                    }

                    return <Ionicons name={iconName} size={25}/>
                },
                })}>
                <Tab.Screen name="Timer" component={Timer}/>
                <Tab.Screen name="StopWatch" component={StopWatchScreen}/>
                <Tab.Screen name="Profiles" component={TimingSetup}/>
            </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profile:{
    flex: 1,
  }
});
