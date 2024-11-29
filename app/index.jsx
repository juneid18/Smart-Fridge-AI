import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import GetStarted from "../components/GetStarted";
import HomeScreen from "./Screen/HomeScreen";

export default function Index() {
  const { isSignedIn } = useUser(); // Clerk user data
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // Flag to track mount status

  useEffect(() => {
    // Set mounted state to true after the component is mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // If the app is mounted and user is signed in, navigate
    if (isMounted && isSignedIn) {
      router.replace("/Screen/HomeScreen"); // Redirect to HomeScreen
    }
  }, [isMounted, isSignedIn, router]);

  return (
    <View style={styles.container}>
      {isSignedIn ? <HomeScreen /> : <GetStarted />}
    </View>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
