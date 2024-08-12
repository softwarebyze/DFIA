import { openURL, canOpenURL } from "expo-linking";
import { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

/**
 * Renders a component that calls the specified phone number when pressed.
 *
 * @param phoneNumber - The phone number to call. Should include the plus sign and country code.
 * @returns The rendered call button.
 * 
 * Add this in app.json:
 * "infoPlist": {
    "LSApplicationQueriesSchemes": ["tel"]
    }
 */
export const CallButton = ({
  phoneNumber,
  onPress
}: //   title = phoneNumber,
//   Component = Button,
{
  //   title?: string;
  phoneNumber: string;
  //   Component?: React.ComponentType<any>;
  onPress?: () => void;
}) => {
  // const [canCall, setCanCall] = useState(false);

  // useEffect(() => {
  //   canOpenURL(`tel:${phoneNumber}`).then(setCanCall);
  // }, [phoneNumber]);

  // const onPress = () => openURL(`tel:${phoneNumber}`);

  return (
    // <Component
    //   title={title}
    //   disabled={!canCall}
    // />
    <TouchableOpacity
      style={{
        backgroundColor: "#EFFFB0",
        paddingVertical: 15,
        paddingHorizontal: 43,
        borderRadius: 40,
      }}
      onPress={onPress}
      // disabled={!canCall}
    >
      <Text style={{ fontSize: 22 }}>Call an Angel</Text>
    </TouchableOpacity>
  );
};
