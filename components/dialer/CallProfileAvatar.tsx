import { useCallDurationTimer } from '@/hooks/dialer/useCallDurationTimer'
import React from 'react'
import { Image, Text, View } from 'react-native'

type PropsType = {
    number: string
    name?: string
}

const CallProfileAvatar = (props: PropsType) => {
    const {callTimer}=useCallDurationTimer()
    const { number, name } = props
    return (
        <View className='flex flex-col items-center'>
            <View className=' border-4 border-blue-400 p-1 w-[120px] h-[120px] flex justify-center items-center rounded-full' >
                <Image
                    source={require('../../assets/images/avatars/5.png')}
                    className='rounded-[60] bg-red-500 w-full h-full'
                />
            </View>
            {name && <Text className='text-center text-blue-500 mt-1 text-2xl font-bold '>{name}</Text>}
            <Text className='text-center text-gray-500 text-md font-bold mt-2'>{number}</Text>
            <Text className='text-center text-gray-500 text-md font-semibold mt-3'>{callTimer}</Text>
        </View>
    )
}

export default CallProfileAvatar