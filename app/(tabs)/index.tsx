import DialPad from '@/components/dialer/Dialpad/DialPad'
import IconButton from '@/components/ui/IconButton'
import { SipUA } from '@/services/sip/SippUA'
import { useAppSelector } from '@/store/store'
import { RegisterState } from '@/types/sip.type'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import React from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { PermissionsAndroid, Text, TouchableOpacity, View } from 'react-native'
import { Platform } from 'react-native'
import { Iconify } from 'react-native-iconify'
import { registerGlobals } from 'react-native-webrtc'

registerGlobals();
const DialPadScreen = () => {
  const [number, setNumber] = useState("")
  const { connected, regState } = useAppSelector((state) => state.sip)

  const clearNumber = () => {
    setNumber((prv: any) => prv.substring(0, prv.length - 1));
  };

  // const sipService = new SIPService();

  useEffect(() => {
    // sipService.createUA();
    requestMicrophonePermission();
  }, [])

  const handleCall = async () => {
    // console.log('number', number)
    // sipService.makeCall(number)
    SipUA?.makeCall(number)
    router.replace("/call/ongoing")
  }


  const handleAnswer = () => {
    console.log('Call answered');
    // Add your logic to answer the call
  };

  const handleHangup = () => {
    console.log('Call hung up');
    // Add your logic to hang up the call
  };


  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone for making and receiving calls.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      console.log('Microphone permission is not required on iOS');
    }
  };


  return (

    <View className='flex-1 justify-end bg-blue-100 w-full h-full' style={{ flex: 1 }}>
      <Text>{regState}</Text>
      {regState === RegisterState.UNREGISTERED && <IconButton style={{
        width: 100,
        padding: 2,
        height: 40
      }} onPress={() => SipUA.createUA()}>
        <View className='flex flex-row items-center justify-center  w-full gap-2'>
          <Iconify icon='fluent-mdl2:plug-connected' size={30} color={"white"} />
          <Text className='text-white'>Connect</Text>
        </View>
      </IconButton>
      }
      {regState === RegisterState.REGISTERED && <IconButton
        style={{
          width: 120,
          padding: 0,
          height: 40
        }}
        onPress={() => SipUA.stop()}>
        <View className='flex flex-row items-center justify-center  w-full gap-2'>
          <Iconify icon='tabler:plug-connected-x' size={30} color={"white"} />
          <Text className='text-white'>Disconnect</Text>
        </View>
      </IconButton>
      }

      <DialPad setNumber={setNumber} number={number}  >
        <View className='flex flex-row items-center justify-center mt-1  w-full'>

          <TouchableOpacity style={[styles.button]}>
            <Ionicons name="videocam" className="text-white" size={20} />
          </TouchableOpacity>


          <TouchableOpacity style={[styles.button, { backgroundColor: "green", }]} onPress={handleCall}>
            <Ionicons name="call" className="text-white" style={{ color: "white" }} size={20} />
          </TouchableOpacity>



          <TouchableOpacity style={styles.button} onPress={clearNumber}>
            <Ionicons name="backspace" size={25} />
          </TouchableOpacity>
        </View>
      </DialPad>
    </View>
  )
}
const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#ffff",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 5,
  },
  buttonText: {
    fontSize: 25,
  },
});
export default DialPadScreen
