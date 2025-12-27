import { router } from "expo-router";
import { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const {width,height}=Dimensions.get('window');

export default function LoginScreen(){
    const [email,setEmail]=useState('yourname@gmail.com');
    const [password,setPassword]=useState('');

   const handleLogin = () => {
  console.log("Login Pressed");
  router.replace("/(tabs)");
};

const handleForgotPassword = () => {
  router.push({
    pathname: "/(auth)/otp",
    params: { email },
  });
};

    
    const handleInstagram=()=>{
        console.log('Instagram login');
    }
    const handleTwitter=()=>{
        console.log('Twitterlogin');
    }
    const handleFacebook=()=>{
        console.log('Facebook login');
    }
    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding':'height'}
            style={styles.keyboardView}
            >

                <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                >

                    <View style={styles.header}>
                        <Text style={styles.headerText}>Hello</Text>
                        <Text style={styles.headerText}>Login Here!</Text>
                    </View>

                    <View style={styles.formWrapper}>

                        <View style={styles.formContainer}>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Gmail</Text>
                                <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder='yourname@gmail.com'
                                placeholderTextColor="#B8B8C7"
                                keyboardType='email-address'
                                autoCapitalize='none'
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                 <Text style={styles.label}>Password</Text>
                                <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder=''
                                placeholderTextColor="#B8B8C7"
                             secureTextEntry
                                />
                            </View>

                            <TouchableOpacity
                            onPress={handleForgotPassword}
                            style={styles.forgotPasswordContainer}
                            >
                                <Text style={styles.forgotPasswordText}>forgot password</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                            onPress={handleLogin}
                            style={styles.loginButton}
                            >
                                <Text style={styles.loginButtonText}>LOGIN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
  <Text style={styles.footerText}>Donot have a account?</Text>
</TouchableOpacity>

                        <Text style={styles.footerSubText}>Sign up with social media</Text>

                        <View style={styles.socialContainer}>
                            <TouchableOpacity
                            style={styles.socialButton}
                            onPress={handleInstagram}
                            >
                                <View style={styles.socialIcon}>
                                  <Image
                                  source={{uri:'https://logos-world.net/wp-content/uploads/2020/06/Instagram-Logo.png'}}
                                  style={styles.socialImage}
                                  resizeMode="contain"
                                  />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                            style={styles.socialButton}
                            onPress={handleTwitter}
                            >
                                <View style={styles.socialIcon}>
                                    <Image
                                  source={{uri:'https://static.vecteezy.com/system/resources/previews/018/930/745/original/twitter-logo-twitter-icon-transparent-free-free-png.png'}}
                                  style={styles.socialImage}
                                  resizeMode="contain"
                                  />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                            style={styles.socialButton}
                            onPress={handleFacebook}
                            >
                                <View style={styles.socialIcon}>
                                    <Image
                                  source={{uri:'https://th.bing.com/th/id/OIP.sLFgKczZ7c771m9TOYCyCwHaFL?w=250&h=180&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1'}}
                                  style={styles.socialImage}
                                  resizeMode="contain"
                                  />
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                    
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
};

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#383F78',
    },
    keyboardView:{
        flex:1,
    },
    scrollContent:{
        flexGrow:1,
        paddingHorizontal: width*0.05,
        paddingTop: height*0.06,
        paddingBottom: height*0.04,
    },
    header:{
        marginBottom: height * 0.04,
        paddingLeft: width*0.03,
    },
    headerText:{
        fontSize: width*0.09,
        fontWeight: 'bold',
        color:'#FFFFFF',
        lineHeight: width*0.11,
    },
    formWrapper:{
        marginBottom: height*0.03,
    },
    formContainer:{
        backgroundColor:'#F5F5F5',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        padding: width*0.08,
        paddingTop: height*0.08,
        paddingBottom: height*0.05,
        shadowColor: '#000',
        shadowOffset:{
            width:0,
            height:4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        transform: [{rotate: '-3deg'}],
    },
    inputGroup:{
        marginBottom: height*0.03,
    },
    label:{
        fontSize: width*0.04,
        color:'#9B9BAA',
        marginBottom: 8,
        fontWeight: '500',
    },
    input:{
        borderBottomWidth:1,
        borderBottomColor: '#D1D1D6',
        paddingVertical: 10,
        fontSize: width*0.04,
        color:'#333333',
    },
    forgotPasswordContainer:{
        alignItems:'flex-end',
        marginTop:10,
        marginBottom: height*0.06,
    },
    forgotPasswordText:{
        color:'#B8B8C7',
        fontSize: width*0.035,
    },
    loginButton:{
        backgroundColor:'#5B5F8D',
        borderRadius: 30,
        paddingVertical: height*0.022,
        alignItems:'center',
        marginTop: height*0.02,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    loginButtonText:{
        color: '#FFFFFF',
        fontSize:width*0.04,
        fontWeight:'bold',
        letterSpacing: 1.5,
    },
    footer:{
        alignItems:'center',
        marginTop: height*0.04,
    },
    footerText:{
        color:'#FFFFFF',
          fontSize: width * 0.038,
          marginBottom: 5,
    },
    footerSubText:{
        color: '#FFFFFF',
    fontSize: width * 0.038,
    marginBottom: height * 0.025,
    },
    socialContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop: 10,
    },
    socialButton:{
        marginHorizontal: 12,
    },
    socialIcon:{
        width: 50,
        height:50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        justifyContent:'center',
        alignItems:'center',
        shadowColor:'#000',
        shadowOffset:{
            width: 0,
            height:2,
        },
        shadowOpacity: 0.2,
        shadowRadius:3,
        elevation:4,
        overflow:'hidden',
    },
     socialImage: {
    width: '100%',
    height: '100%',
  },

});

