import { Input } from '@/components/ui/input'
import RHFTextField from '@/hooks/hook-form/RHFTextField';
import React, { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Button, TouchableOpacity } from 'react-native';
import { Alert, Text, TextInput, View } from 'react-native'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import StorageService from '@/services/storage/storage';
import { router } from 'expo-router';
import { StorageKey } from '@/constants/storage.constant';
import { SipConfigSchema, SipConfigType } from '@/types/sip.type';
import { SipUA } from '@/services/sip/SippUA';





type FormValues = z.infer<typeof SipConfigSchema>;


const SettingsScreen = () => {
    const methods = useForm<FormValues>({
        resolver: zodResolver(SipConfigSchema),
        defaultValues: {
            username: "7002",
            password: "digit90digit@@digit90",
            sipServer: "14switch.digitechnobytes.online",
            sipPort: "7443",
            wssUrl: "wss://14switch.digitechnobytes.online:7443",
        }
    });

    const setDefaultValues = async () => {
        const values = await StorageService.getData(StorageKey.SIP_CONFIGURATION) as SipConfigType;
        if(values){
            methods.reset(values);
        }
    }
    useEffect(()=>{
        setDefaultValues()
    },[])

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        await StorageService.saveData(StorageKey.SIP_CONFIGURATION, data);
        Alert.alert("Success", "Sip Configuration saved successfully");
       SipUA.createUA();
        router.push("/")

    };


    return (
        <View className='flex-1 justify-center items-center bg-blue-100 h-full w-full p-2'>
            <Text className='text-center  mb-3 text-lg font-extrabold'>Sip Configuration</Text>
            <FormProvider {...methods}>
                <View className='flex flex-col gap-2 w-full'>
                    <View className='w-full'>
                        <Text className="mb-1">Sip Username:</Text>
                        <RHFTextField
                            name="username"
                            placeholder="Enter your Sip username"
                        />
                    </View>

                    <View className='w-full'>
                        <Text className="mb-1">Sip Password:</Text>
                        <RHFTextField
                            name="password"
                            placeholder="Enter your Sip Passowrd"
                        />
                    </View>
                    <View className='w-full'>
                        <Text className="mb-1">Sip Server:</Text>
                        <RHFTextField
                            name="sipServer"
                            placeholder="Sip Server"
                        />
                    </View>
                    <View className='w-full'>
                        <Text className="mb-1">Sip Port:</Text>
                        <RHFTextField
                            name="sipPort"
                            placeholder="Sip Port"
                        />
                    </View>
                    <View className='w-full'>
                        <Text className="mb-1">Wss Url:</Text>
                        <RHFTextField
                            name="wssUrl"
                            placeholder="WssUrl"
                        />
                    </View>
                </View>


                <TouchableOpacity  onPress={methods.handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
                    <Text className='bg-blue-500 text-white text-center px-4 py-2 rounded-lg'>Save</Text>
                </TouchableOpacity>
            </FormProvider>
        </View>
    )
}

export default SettingsScreen
