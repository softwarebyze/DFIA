import { SafeAreaView, StyleProp, ViewStyle } from "react-native";

export const Screen = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <SafeAreaView
    style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, style]}
  >
    {children}
  </SafeAreaView>
);
