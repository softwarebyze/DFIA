import { router } from "expo-router";

/**
 * This is used to run the navigation logic from root level
 */
export const staticNavigateToRingingCall = () => {
  console.log("[staticNavigateToRingingCall]");
  //   const intervalId = setInterval(async () => {
  // add any requirements here (like authentication)
  // if (GlobalState.hasAuthentication) {
  //   clearInterval(intervalId);
  router.replace("/home");
  // }
  //   }, 300);
};

export const staticNavigateToCall = () => {
  console.log("[staticNavigateToCall]");
  router.replace(`/home?join=true`);
  console.log("[staticNavigateToCall] Navigated to /home?join=true");
};
