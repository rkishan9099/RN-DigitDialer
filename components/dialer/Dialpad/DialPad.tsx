
import React, { ReactNode } from "react";
import DialPadButtonList from "./DialPadButtonList";
import { StyleSheet, Text, View } from "react-native";

type PropsType = {
  setNumber: any
  number: string,
  children?: ReactNode
}

const DialPad = ({ setNumber, number, children }: PropsType) => {
  const typeNumber = (num: any) => {
    setNumber((prev: string) => prev.concat(num));
  };

  return (
    <View className="w-full  bg-white flex justify-end rounded-t-[40]" style={{ padding: 20 }}>
      <Text className="text-center text-[30px] mb-3">{number}</Text>
      <DialPadButtonList typeNumber={typeNumber} />
      {children && children}
    </View>
  )
};

export default DialPad;
