import React from "react";
import { View } from "react-native"
import TextTicker from "react-native-text-ticker";
import { Colors } from "../../constants";
import { MaterialIcons } from '@expo/vector-icons';

export const Ticker = (props) => {
  const { string, maxLength, style, isExplicit } = props;
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TextTicker
        style={{
          height: 20,
          ...style,
        }}
        duration={7000}
        bounce
        repeatSpacer={50}
        marqueeDelay={3000}
        shouldAnimateTreshold={40}
      >
        {string}
      </TextTicker>
      {isExplicit &&
      <MaterialIcons name="explicit" size={18} color="gray" />}
    </View>
  );
};

export const Truncate = (string, maxLength) => {
  return string.length > maxLength
    ? string.substring(0, maxLength - 3) + "..."
    : string;
};
