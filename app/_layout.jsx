import React, { useEffect, useState } from "react";
import { ClerkProvider, ClerkLoaded, useUser } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import Footer from "@/components/Footer";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item || null;
    } catch (error) {
      console.error("SecureStore error:", error);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <AppContent />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function AppContent() {
  const { isSignedIn, user } = useUser(); // Access user data
  const router = useRouter();
  const [error, setError] = useState(null); // Add state for error message

  const saveUserAndRedirect = async () => {
    try {
      const profileImage = user.imageUrl || "default-image-url"; // Fallback image
      const response = await axios.post("http://192.168.185.236:3000/user", {
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName || "Default Name",
        profile_img: profileImage,
      });

      if (response.status === 201) {
        router.push("/Screen/HomeScreen");
      } else {
        console.log(`User Already exist: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      setError("Error saving user data. Please try again."); // Show error message
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      saveUserAndRedirect();
    }
  }, [isSignedIn]);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {error && <Text>{error}</Text>}
        {/* <StatusBar style="light" backgroundColor="#0A0B0B" translucent={true}/> */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Screen/HomeScreen" />
          <Stack.Screen name="Screen/profile" />
          <Stack.Screen name="Screen/DoMagic" options={{headerShown: true, title:'DoMagic AI 🪄'}} />
        </Stack>
        {isSignedIn && <Footer />}
      </GestureHandlerRootView>
    </>
  );
}
