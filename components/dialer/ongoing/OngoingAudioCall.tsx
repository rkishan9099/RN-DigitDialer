import { SafeAreaView, Text, View } from 'react-native'
import CallProfileAvatar from '../CallProfileAvatar'
import CallActionButton from './CallActionButton'
import IconButton from '@/components/ui/IconButton'
import { Iconify } from 'react-native-iconify'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/store/store'
import { useCallDurationTimer } from '@/hooks/dialer/useCallDurationTimer'
import { OngoingSessionState } from '@/types/sip.type'

const OngoingAudioCall = () => {

    const [timeStart, setTimerStart] = useState(false)
    const { TimerAction } = useCallDurationTimer()
    const { SipUA, sessions, sessionState } = useAppSelector((state) => state.sip)

    const handlePress = () => {
        SipUA?.terminate(400, 'Call Terminated')
        router.replace("/")
    }

    useEffect(() => {
        if (sessions.size > 0 && sessionState === OngoingSessionState.ANSWERED && !timeStart) {
            setTimerStart(true)
            TimerAction("start")
        } else {
            TimerAction("stop")
            setTimerStart(false)
        }
    }, [sessions, timeStart, sessionState])



    return (
        <SafeAreaView className='flex-1 w-full flex-col justify-around items-center py-[50px] bg-white '>
            <View>
                <CallProfileAvatar number={SipUA?.getDialNumber() as string} name='Kishan Ramani' />
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