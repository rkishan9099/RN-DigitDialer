"use client";
import React, { useState } from "react";
import DialPad from "./DialPad";
import { TouchableOpacity } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Ionicons } from "@expo/vector-icons";
import { Iconify } from "react-native-iconify";


const CallDialpad = () => {
  const [number, setNumber] = useState<string>("");
  const callHandler = () => {
   
  };

  
  return (
    <DialPad number={number} setNumber={setNumber}>
      <TouchableOpacity className="w-[56px] h-[56px] flex justify-center items-center bg-[#44b700] rounded-full"
        onPress={callHandler}
      >
        <Ionicons name="call" />
      </TouchableOpacity>
    </DialPad>
  );
};

export default CallDialpad;
