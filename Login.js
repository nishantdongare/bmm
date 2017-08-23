'use strict';
import React from 'react';
import { StyleSheet, Text, View,Image,TextInput ,TouchableHighlight,ActivityIndicator} from 'react-native';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showProgress : false

		};
	}
	 render() {
		var errorCtrl = <View/>;

		if(!this.state.success && this.state.badCredentials) {
			errorCtrl = <Text style={styles.error}>Invalid Phone Number or Password.</Text>;
		}

		if(!this.state.success && this.state.invalidData) {
			var response = this.state.response.json();
			response.then((response) => {
				errorCtrl = <Text style={styles.error}>{response.error[0]}</Text>;
			}).catch(() => {});
		}

		if(!this.state.success && this.state.unknownError) {
			errorCtrl = <Text style={styles.error}>Internal Server Error.</Text>;
		}
		return (
				<View style={styles.container}>
					<Image style={styles.logo} source={require('./buddhistmatchmakericon.png')} />
					<Text style={styles.heading} >Buddhist Match Maker</Text>
					<TextInput style={styles.input} onChangeText={(text) => this.setState({contactno : text})} placeholder="Phone" />
					<TextInput style={styles.input} onChangeText={(text) => this.setState({password : text})} placeholder="Password" secureTextEntry="true" />
					 <TouchableHighlight style={styles.button} onPress={this.authenticate} >
					 <Text style={styles.buttonText} >Login</Text>
					</TouchableHighlight>
					{errorCtrl}
					<ActivityIndicator
						animating={this.state.showProgress}
						size="large"
						style={styles.loader}
					/>
					<View style={{flex: 1, flexDirection: 'row',marginTop:100}}>
					<TouchableHighlight style={styles.forgotButton} >
					 <Text style={styles.buttonText}>Forgot Password</Text>
					</TouchableHighlight>
					<TouchableHighlight onPress={this.buttonPressed} style={styles.registerButton} >
					 <Text style={styles.buttonText}>Register</Text>
					</TouchableHighlight>
					</View>
				</View>
			);
	}


	authenticate = () => {
			let formData = new FormData();
			formData.append('contactno', this.state.contactno);
			formData.append('password', this.state.password);
			this.setState({showProgress: true});
			fetch('http://buddhistmatchmaker.aidor.in/api/authenticate',
				{method: 'POST',
				headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
				body: formData
			}).then( (response) => {
				if(response.status == 200 ) {
					this.setState({success:true});
					return response.json();
				}

				this.setState({success:false});
				
				throw {
					badCredentials : response.status == 401,
					invalidData : response.status == 422,
					internalServerError : response.status == 500,
					response : response,
				};
			})
			.then((response) => {
				console.log(response.token);
				this.setState({showProgress: false});

			}).catch((err) => {
				this.setState(err); 
				
			}).finally(() => {
				this.setState({showProgress: false});
			});
		}

	
}


var styles = StyleSheet.create({
	container: {
		flex : 1,
		alignItems:'center',
		backgroundColor: '#F5FCFF',
		padding:10
	},
	logo: {
		width: 100,
		height: 100,
		marginTop:100
	},
	heading : {
		fontSize:30,
		marginTop:10
	},
	input: {
		height:50,
		marginTop:10,
		padding:4,
		fontSize:18,
		borderWidth:1,
		borderColor:'#3d5b99',
		alignSelf:'stretch'
	},
	button: {
		height:50,
		backgroundColor:'#3d5b99',
		alignSelf:'stretch',
		marginTop:10,
		justifyContent:'center'
	},
	forgotButton: {
		height:50,
		backgroundColor:'#3d5b99',
		marginTop:20,
		justifyContent:'center',
		alignSelf:'baseline',
		width:170,
		marginRight:5
	},
	buttonText:{
		fontSize:18,
		color:'#fff',
		alignSelf:'center'
	},
	registerButton :{
		height:50,
		backgroundColor:'#3d5b99',
		marginTop:20,
		justifyContent:'center',
		alignSelf:'baseline',
		width:180
	},
	loader : {
		marginTop:10
	},
	error : {
		color:'red'
	}
});