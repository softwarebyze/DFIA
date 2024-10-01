// app/_layout.tsx
import { RevenueCat } from "components/RevenueCat";
import { Slot } from "expo-router";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { setPushConfig } from "utils/setPushConfig";
import { auth } from "../firebase";
// import { OverlayProvider } from "

setPushConfig();

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
});

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      <RevenueCat>
        {/* <OverlayProvider> */}
        <Slot />
        {/* </OverlayProvider> */}
      </RevenueCat>
    </AuthContext.Provider>
  );
}
