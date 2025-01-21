import { router } from "expo-router";

/**
 * This is used to run the navigation logic from root level
 */
export const staticNavigateToRingingCall = () => {
  //   const intervalId = setInterval(async () => {
  // add any requirements here (like authentication)
  // if (GlobalState.hasAuthentication) {
  //   clearInterval(intervalId);
  router.replace("/home");
  // }
  //   }, 300);
};

export const staticNavigateToCall = () => {
  router.replace(`/home?join=true`);
};
