import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { setPushConfig } from "./utils/setPushConfig";
import { setNotifeeListeners } from "./utils/setNotifeeListeners";
import { setFirebaseListeners } from "./utils/setFirebaseListeners";
import { setPushMessageHandlers } from "./utils/setPushMessageHandlers";

setNotifeeListeners();
setFirebaseListeners();
setPushMessageHandlers();
setPushConfig();
export function appEntry() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

// Register your notifee.onBackgroundEvent here. You can add any other function that you need in your Headless JS too here.

//Then finally register the Root Component
registerRootComponent(appEntry);
