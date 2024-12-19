import { analytics } from "analytics";
import { presentProPaywall } from "components/RevenueCat";
import AppColors from "constants/app.colors";
import { AppPNGs } from "constants/app.image";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

export const CallButton = (props: { onPress: () => void }) => {
  const onPress = async () => {
    const isSubscribed = __DEV__ ? true : await presentProPaywall();
    if (isSubscribed) {
      props.onPress();
      analytics.track("[CallButton] call_an_angel", {
        call_id: "call-id",
      });
    }
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={AppPNGs.IcVideoCall} style={styles.callIcon} />
      <Text style={styles.text}>{"Call an Angel"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.blue,
    paddingVertical: 15,
    paddingHorizontal: 40,
    position: "absolute",
    borderRadius: 40,
    borderWidth: 1,
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 22,
    color: AppColors.white,
  },
  callIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    tintColor: AppColors.white,
  },
});
