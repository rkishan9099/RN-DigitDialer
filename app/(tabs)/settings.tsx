import { Input } from '@/components/ui/input'
import RHFTextField from '@/hooks/hook-form/RHFTextField';
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Button } from 'react-native';
import { Alert, Text, TextInput, View } from 'react-native'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import StorageService from '@/services/storage/storage';
import { router } from 'expo-router';
import { StorageKey } from '@/constants/storage.constant';



// Define the validation schema
const schema = z.object({
    username: z.string().min(1, 'UserName is required'),
    password: z.string().min(1, 'Password is required'),
    sipServer: z.string().min(1, 'Sip Server is required'),
    sipPort: z.string().min(1, 'Sip Port is required'),
    wssUrl: z.string().min(1, 'Wss Url is required'),
});

type FormValues = z.infer<typeof schema>;


const SettingsScreen = () => {

    const methods = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            password: "digit90digit@@digit90",
            sipServer: "14switch.digitechnobytes.online",
            sipPort: "7443",
            wssUrl: "wss://14switch.digitechnobytes.online:7443",
        }
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        await StorageService.saveData(StorageKey.SIP_CONFIGURATION, data);
        Alert.alert("Success", "Sip Configuration saved successfully");
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
                            name="sipPort"
                            placeholder="Sip Port"
                        />
                    </View>
                </View>


                <Button title="Submit" onPress={methods.handleSubmit(onSubmit)} />
            </FormProvider>
        </View>
    )
}

export default SettingsScreen
