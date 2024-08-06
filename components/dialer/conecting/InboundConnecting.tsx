import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'nativewind'
import React from 'react'
import { Alert, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import SipUA from '@/services/sip/SippUA';

const InboundConnecting = () => {
    const sipUA = new SipUA();
    const answerHandler = () => {
        sipUA.answer()
        router.replace("/call/ongoing")
    }

    const rejectHandler = () => {
        sipUA.terminate(486, 'Call Rejected')
        router.replace("/index-dial")
    }
    return (
        <SafeAreaView className='flex-1 flex-col justify-between py-[50px] bg-blue-100 '>
                <View className='w-full flex flex-col items-center gap-3 mt-[60px]'>
                    <Text className='text-2xl text-gray-500 font-bold text-center'>
                    {sipUA.getActiveSession()?.user}
                    </Text>
                    <Image
                        source={require('../../../assets/images/avatars/1.png')}
                        className='w-35 h-35 rounded-[60]'
                    />
                </View>

                <View className='w-full flex  flex-row justify-around '>
                    <TouchableOpacity onPress={answerHandler} style={[styles.button, { backgroundColor: 'green' }]}>
                        <Ionicons name="call"  style={styles.buttonText} size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={rejectHandler} style={[styles.button, {
                        backgroundColor: 'red'
                    }]}>
                        <MaterialIcons name="call-end"  style={styles.buttonText} size={25} />
                    </TouchableOpacity>
                </View>

            
        </SafeAreaView>

    )
}

export default InboundConnecting


const styles = StyleSheet.create({
    button: {
        width: 70,
        height: 70,
        borderRadius: 50,
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
        fontSize: 30,
        color: "white"
    },
})