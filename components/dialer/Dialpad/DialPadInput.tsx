import { Ionicons } from '@expo/vector-icons';
import { unstable_styled } from 'nativewind';
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';

const DialPadInput = ({ number, setNum }: { number: string; setNum: any }) => {
  const changeHandler = (text: string) => {
    setNum(text);
  };

  const clearNumber = () => {
    setNum((prev: string) => prev.substring(0, prev.length - 1));
  };


  return (
    <View className='flex flex-row items-center text-center bg-transparent shadow-none p-2'>
      <TextInput className='text-2xl text-center pl-4 flex-1 shadow-none'
        value={number}
        onChangeText={changeHandler}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={clearNumber}>
        <Ionicons name="backspace-sharp" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default DialPadInput;
