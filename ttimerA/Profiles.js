import React from 'react'
import {View, StyleSheet, ScrollView, Text, Dimensions, Button} from 'react-native'
import * as RootNavigation from './RootNavigation'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const Profile = props => {
    return (
        <View style={styles.profile}>
                <View style={styles.profileId}>
                    <Icon.Button
                        name="edit"
                        style={styles.button}
                        backgroundColor="#46ADEB"
                        color='black'
                        borderColor='black'
                        onPress={()=>props.editProfile()}
                    />

                </View>
                <View style={styles.profileContent}>
                    <Text style={styles.title}>{props.profile.name}</Text>
                    <Text style={styles.text}>Number of Activities: {props.profile.userActivities.length}</Text>
                    <Text style={styles.text}>Total Time: {props.profile.totalHr}:
                        {props.profile.totalMin<10? "0" + props.profile.totalMin: props.profile.totalMin}:
                        {props.profile.totalSec<10?"0" + props.profile.totalSec: props.profile.totalSec}</Text>
                </View>
                <View style={styles.trashButton}>
                    <Icon.Button
                        name="trash"
                        style={styles.button}
                        backgroundColor="#C80127"
                        color='black'
                        onPress={props.onDelete}
                    />

                </View>
        </View>
    )
}

export default class Profiles extends React.Component{
    state={
        profiles: [],
        keys: [],
        nextKey:1,
    }

    getAllKeys = async() =>{
        let keys = []
        try{
            keys = await AsyncStorage.getAllKeys()
            return keys
        } catch(err){
            alert("Unable to retrieve Keys")
        }
    }

    componentDidMount =async() => {
        //Get Storage Keys for All profiles
        let temp = await this.getAllKeys()

        this.setState({keys: temp})
        //Populate profiles array with previously created Profiles
        const results = this.state.keys.map(async key => {
            if (key !== null) {
                return await readData(key)
            }

        })
        Promise.all(results)
            .then(values => this.setState({profiles: values}))
            .catch(e => {
                alert("Its not you its Me :(")
            })

        let index = this.state.keys.pop()
        if (index !== undefined) {
            this.setState({nextKey: parseInt(index) + 1})
        }else{
            this.setState({nextKey: parseInt(this.state.nextKey)+1})
        }
    }



    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
            if( this.props.route.params.profile.key === "") {
                const newProfile = {
                    key: this.state.nextKey,
                    name: this.props.route.params.profile.name,
                    userActivities: this.props.route.params.profile.userActivities,
                    totalHr: this.props.route.params.profile.totalHr,
                    totalMin: this.props.route.params.profile.totalMin,
                    totalSec: this.props.route.params.profile.totalSec
                }
                this.setState(prevState => ({
                    profiles: [...this.state.profiles, newProfile],
                    keys: [...this.state.keys, this.state.nextKey], nextKey: parseInt(this.state.nextKey) + 1
                }))
                storeData(newProfile)
            }else{
                this.state.profiles.map(profile=>{
                    let index = this.state.profiles.indexOf(profile);
                    if(index !== -1){
                        if(profile.key === this.props.route.params.profile.key ){
                            removeData(profile.key.toString())
                                .then(temp=>{
                                    temp = this.state.profiles
                                    temp[index] = this.props.route.params.profile
                                    this.setState({profiles: temp},()=>(storeData(temp[index])))
                                }).done();

                        }

                    }
                })


            }


        }
    }

    componentWillUnmount(){
        return storeData(this.state.keys, this.state)
    }

    handleDelete=props=>{
        this.setState({profiles: this.state.profiles.filter(profile => profile.key !== props), nextKey: parseInt(this.state.nextKey) +1})
        removeData(props)
    }

    editProfile=props=>{
        RootNavigation.navigate('ProfileFormScreen', props)
    }

    render(){
        return(
            <ScrollView style={{backgroundColor: '#E0F1Fb'}}>
                {this.state.profiles.map(profile =>(
                    <Profile
                        key={profile.key}
                        profile={profile}
                        onDelete={()=>{this.handleDelete((profile.key))}}
                        editProfile={()=>this.editProfile(profile)}
                    />
                ))}
            </ScrollView>

        )
    }
}

async function readData(key){
    try{
        const value = await AsyncStorage.getItem(key)
        if( value !== null){
            return JSON.parse(value)
        }
    }catch (err){
        alert("Unable to retrieve saved profiles")
    }
}


async function removeData(key){
    try{
        await AsyncStorage.removeItem(key.toString())
        return true
    }catch (err){
        return false
    }
}

//Saves data when user clicks submit button
async function storeData(props){
    try{
        await AsyncStorage.setItem(props.key.toString(), JSON.stringify(props))
    }catch(err){
        alert("Unable to Save Profile")
    }
}

const styles = StyleSheet.create({
    profile: {
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: '#EDEEFD',
        flexDirection: 'row',
    },

    profileId: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        width: 75,
        height: 75,
    },

    profileContent: {
        alignItems: 'center',
        width: (Math.round(Dimensions.get('window').width) - 130),
    },

    text:{
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },

    title:{
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },

    trashButton: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },

    button:{
        alignSelf: 'flex-end',
        paddingLeft: 15,
        height: 75,
        borderWidth: 1
    }

});
