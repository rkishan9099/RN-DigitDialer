import { Input } from '@/components/ui/input';
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
type Props = {
    name: string;
    helperText?: string;
    [key: string]: any;
};
const RHFTextField = ({ name, helperText, ...other }: Props) => {
    const { control } = useFormContext();

    return (
        <Controller
            rules={{
                required: true
            }}
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <View className='w-full'>
                        <Input
                            {...field}
                            value={typeof field.value === 'number' && field.value === 0 ? '' : String(field.value)}
                            onChangeText={field.onChange}
                            onBlur={field.onBlur}
                            {...other}
                        />
                        {error ? <Text className='text-red-500 text-sm'>{error.message}</Text> : helperText && <Text style={styles.helperText}>{helperText}</Text>}
                    </View>
                )
            }}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#000',
        marginVertical: 5,
    },
    errorInput: {
        borderColor: 'red',
        color: 'red'
    },
    helperText: {
        color: '#6c757d',
        fontSize: 12,
        marginTop: 4,
    },
});
export default RHFTextField
