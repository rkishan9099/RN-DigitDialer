import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import CallProfileAvatar from '../CallProfileAvatar'
import CallActionButton from './CallActionButton'
import IconButton from '@/components/ui/IconButton'
import { Iconify } from 'react-native-iconify'
import SipUA from '@/services/sip/SippUA'
import { router } from 'expo-router'

const OngoingAudioCall = () => {
    const sipUa = new SipUA();
    const handlePress = () => {
        sipUa.terminate(400, 'Call Terminated')
        router.replace("/index-dial")
    }
    return (
        <SafeAreaView className='flex-1 w-full flex-col justify-around items-center py-[50px] bg-white '>
            <View>
                <CallProfileAvatar number={sipUa.getDialNumber() as string} name='Kishan Ramani' />
            </View>
            <View className='w-full mt-9 flex justify-center items-center'>
                <CallActionButton />

                <IconButton
                    size={30}
                    color="blue"
                    backgroundColor='red'
                    onPress={handlePress}
                    style={{
                        marginTop: 30,

                    }}

                >
                    <Iconify icon="ic:baseline-call-end" size={30} color="white" />
                </IconButton>



            </View>
        </SafeAreaView>
    )
}

export default OngoingAudioCall