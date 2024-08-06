import IconButton from '@/components/ui/IconButton'
import {SipUA} from '@/services/sip/SippUA'
import { useAppSelector } from '@/store/store'
import { StyleSheet } from 'nativewind'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Iconify } from 'react-native-iconify'

const CallActionButton = () => {
    const [isMuted, setIsMuted] = useState(false)
    const [isHolded, setIsHolded] = useState(false)
    function handlePress(): void {
        throw new Error('Function not implemented.')
    }


    const handleToogleMute = () => {
        if(isMuted){
            SipUA.unmute();
        }else{
            SipUA?.mute();
        }
        setIsMuted(!isMuted)
    }

    const handleToogleHold = () => {
        if(isHolded){
            SipUA.unhold();
        }else{
            SipUA?.hold();
        }
        setIsHolded(!isHolded)
    }

    return (
        <View className='flex flex-col justify-center  w-full items-center gap-5 mt-3'>
            <View className='flex flex-row w-full justify-center gap-[20px] items-center'>
                <IconButton
                    size={30}
                    color="blue"
                    backgroundColor='white'
                    onPress={handleToogleMute}
                    style={[styles.button]}
                >
                    {
                       isMuted ? <Iconify icon="rivet-icons:microphone-off-solid" size={24} color="#3b82f6" /> : <Iconify icon="fa-solid:microphone" size={24} color="#3b82f6" />
                    }

                    {/* <Iconify icon="rivet-icons:microphone-off-solid" size={24} color="#3b82f6" /> */}
                </IconButton>
                <IconButton
                    size={30}
                    color="blue"
                    backgroundColor='white'
                    onPress={handleToogleHold}
                    style={[styles.button]}
                >
                    {
                       isHolded? <Iconify icon="solar:pause-bold" size={24} color="#3b82f6" /> : <Iconify icon="solar:play-bold" size={24} color="#3b82f6" />
                    }

                </IconButton>
                <IconButton
                    size={30}
                    color="blue"
                    backgroundColor='white'
                    onPress={handlePress}
                    style={[styles.button]}
                >
                    <Iconify icon="f7:speaker-2-fill" size={24} color="#3b82f6" />
                </IconButton>
            </View>
            <View className='flex flex-row w-full justify-center gap-[20px] items-center'>
                <IconButton
                    size={30}
                    color="blue"
                    backgroundColor='white'
                    onPress={handlePress}
                    style={[styles.button]}
                >
                    <Iconify icon="mingcute:plus-fill" size={24} color="#3b82f6" />
                </IconButton>
                <IconButton
                    size={30}
                    color="blue"
                    backgroundColor='white'
                    onPress={handlePress}
                    style={[styles.button]}
                >
                    <Iconify icon="solar:square-transfer-horizontal-bold" size={24} color="#3b82f6" />
                </IconButton>
                <IconButton
                    size={30}
                    color="blue"
                    backgroundColor='white'
                    onPress={handlePress}
                    style={[styles.button]}
                >
                    <Iconify icon="ic:round-dialpad" size={24} color="#3b82f6" />
                </IconButton>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    button: {
        elevation: 2,
        borderRadius: 10,
        borderColor: 'blue',
    }
})
export default CallActionButton