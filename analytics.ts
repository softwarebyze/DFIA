import { auth } from "firebase";

export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    console.log(event, properties, {
      email: auth.currentUser?.email,
    });
  },
};
