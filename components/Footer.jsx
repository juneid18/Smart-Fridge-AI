import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route) => pathname === route;

  const navigateToScreen = (path) => {
    if (path !== pathname) { // Only navigate if it's a different screen
      router.push(path);
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.tabItem} 
        onPress={() => navigateToScreen('/Screen/HomeScreen')}
      >
        <FontAwesome 
          name="home" 
          size={24} 
          color={isActive('/Screen/HomeScreen') ? '#858787' : 'black'} 
        />
        <Text style={styles.tabLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem} 
        onPress={() => navigateToScreen('/Screen/recipe')}
      >
        <FontAwesome6 
          name="bowl-food" 
          size={24} 
          color={isActive('/Screen/recipe') ? '#858787' : 'black'} 
        />
        <Text style={styles.tabLabel}>Recipe</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigateToScreen('/Screen/profile')}
      >
        <FontAwesome 
          name="user" 
          size={24} 
          color={isActive('/Screen/profile') ? '#858787' : 'black'} 
        />
        <Text style={styles.tabLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderTopEndRadius:20,
    borderTopLeftRadius:20,
    elevation:7
  },
  tabItem: {
    alignItems: 'center',
    padding: 10,
  },
});