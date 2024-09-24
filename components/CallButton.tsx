import { presentProPaywall } from "components/RevenueCat";
import { analytics } from "analytics";
import { Text, TouchableOpacity } from "react-native";

export const CallButton = (props: { onPress: () => void }) => {
  const onPress = async () => {
    // const isSubscribed = await presentProPaywall();
    // if (isSubscribed || __DEV__) {
    // }
    props.onPress();
    analytics.track("call_an_angel", {
      call_id: "call-id",
    });
  };
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#EFFFB0",
        paddingVertical: 15,
        paddingHorizontal: 43,
        borderRadius: 40,
        borderWidth: 1,
      }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 22 }}>Call an Angel</Text>
    </TouchableOpacity>
  );
};
