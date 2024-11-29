import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  ImageBackground,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useOAuth } from '@clerk/clerk-expo'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';

// Reusable social button
const SocialButton = React.memo(({ icon, label, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity
    style={[styles.socialButton, { backgroundColor }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <FontAwesome name={icon} size={24} color={textColor} style={styles.socialIcon} />
    <Text style={[styles.socialButtonText, { color: textColor }]}>{label}</Text>
  </TouchableOpacity>
));

// Warm up browser for OAuth
const useWarmUpBrowser = () => {
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => WebBrowser.coolDownAsync();
  }, []);
};

// Main screen
export default function GetStartedScreen() {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        console.log('Handle sign-in or sign-up flow');
      }
    } catch (err) {
      console.error('Google Sign-In error:', err);
    }
  }, [startOAuthFlow]);

  const handleAppleSignIn = useCallback(() => {
    console.log('Apple Sign-In triggered');
    // Add Apple OAuth logic here
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={{ uri: 'https://cdn-icons-png.freepik.com/512/1680/1680548.png' }}
        style={styles.backgroundPattern}
      >
        <LinearGradient colors={['rgba(255,255,255,0.9)', '#f3f4f6']} style={styles.gradient}>
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appNameText}>FridgeTracker</Text>
            <Text style={styles.descriptionText}>
              Keep track of your fridge items and discover exciting new recipes
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <SocialButton
              icon="google"
              label="Continue with Google"
              onPress={handleGoogleSignIn}
              backgroundColor="#ffffff"
              textColor="#000000"
            />
            {IS_IOS && (
              <SocialButton
                icon="apple"
                label="Continue with Apple"
                onPress={handleAppleSignIn}
                backgroundColor="#000000"
                textColor="#ffffff"
              />
            )}
              <Text style={styles.skipButtonText}>*login with google</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  backgroundPattern: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  welcomeText: {
    fontSize: SCREEN_WIDTH * 0.06,
    color: '#4b5563',
  },
  appNameText: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  descriptionText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: SCREEN_WIDTH * 0.06,
  },
  buttonContainer: {
    gap: 12,
    marginTop: SCREEN_WIDTH,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 3,
  },
  socialIcon: {
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
  },
  skipButtonText: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: '#6b7280',
    textAlign:'center'
  },
});
