import { analytics } from "analytics";
import { presentProPaywall } from "components/RevenueCat";
import AppColors from "constants/app.colors";
import { AppPNGs } from "constants/app.image";
import { Image, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

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
    <View style={styles.container}>
      <Link
        href="#"
        onPress={event => {
          event.preventDefault();
          onPress();
        }}
        style={styles.linkButton}>
        <Text style={styles.text}>{"Call an Angel"}</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.blue,
    // paddingVertical: 15,
    // paddingHorizontal: 40,
    position: "absolute",
    borderRadius: 40,
    borderWidth: 1,
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
  },
  linkButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
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
