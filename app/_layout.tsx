import { NotificationObserver } from "components/NotificationObserver";
import { RevenueCat } from "components/RevenueCat";
import { AuthContextProvider } from "context/AuthContext";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <NotificationObserver>
        <RevenueCat>
          <Slot />
        </RevenueCat>
      </NotificationObserver>
    </AuthContextProvider>
  );
}
