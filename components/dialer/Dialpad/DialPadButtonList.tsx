import React from "react";
import DialPadButton from "./DialPadButton";
import { View } from "react-native";

const buttons = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

const DialPadButtonList = ({ typeNumber }: { typeNumber: any }) => {
  return (
    <>
      <View className="flex flex-col gap-3 w-ful bg-white shadow-lg  pt-2" >
        {buttons.map((btnlist: string[], index: number) => (
          <View
          className="flex flex-row flex-wrap gap-[40px] justify-center items-center mb-2"
            key={index}
          >
            {btnlist.map((btn: string, btnIndex: number) => (
              <DialPadButton
                key={btnIndex}
                button={btn}
                typeNumber={typeNumber}
              />
            ))}
          </View>
        ))}
      </View>
    </>
  );
};

export default DialPadButtonList;
