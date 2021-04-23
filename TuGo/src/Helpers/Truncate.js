import React from "react";
import TextTicker from "react-native-text-ticker";
import { Colors } from "../../constants";

export const Ticker = (props) => {
  const { string, maxLength, style } = props;
  return (
    <TextTicker
      style={{
        height: 20,
        ...style,
      }}
      duration={7000}
      bounce
      repeatSpacer={50}
      marqueeDelay={1000}
      shouldAnimateTreshold={40}
    >
      {string}
    </TextTicker>
  );
};

export const Truncate = (string, maxLength) => {
  return string.length > maxLength
    ? string.substring(0, maxLength - 3) + "..."
    : string;
};
