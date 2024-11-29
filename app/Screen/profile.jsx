import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";


// Theme Configuration
const THEME = {
  colors: {
    primary: '#0A0B0B',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      light: '#9CA3AF'
    },
    border: '#E5E7EB',
    error: '#EF4444'
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }
};

const ProfileScreen = () => {
const { user , isLoaded  } = useUser()

const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (isLoaded) {
        await signOut(); // Log the user out
        router.replace("/"); // Redirect to the login screen
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };



  const ProfileMenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <FontAwesome5 
          name={icon} 
          size={20} 
          color={THEME.colors.text.secondary} 
        />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <FontAwesome5 
        name="chevron-right" 
        size={16} 
        color={THEME.colors.text.light} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: user?.imageUrl }} 
            style={styles.avatar} 
          />
          <Text style={styles.nameText}>{user?.firstName}</Text>
          <Text style={styles.emailText}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>
 

        {/* Profile Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account Settings</Text>
          <ProfileMenuItem 
            icon="bell" 
            title="Notifications" 
            onPress={() => {}}
          />
        </View>

        {/* Other Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Support</Text>
          <ProfileMenuItem 
            icon="question-circle" 
            title="Help & Support" 
            onPress={() => {}}
          />
          <ProfileMenuItem 
            icon="info-circle" 
            title="About App" 
            onPress={() => {}}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <FontAwesome5 
            name="sign-out-alt" 
            size={20} 
            color="#FFF" 
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.md
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    backgroundColor: THEME .colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: THEME.colors.primary,
    marginBottom: THEME.spacing.md
  },
  nameText: {
    fontSize: 24,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    marginTop: THEME.spacing.sm
  },
  emailText: {
    fontSize: 16,
    color: THEME.colors.text.secondary
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    marginBottom: THEME.spacing.md
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    marginTop: 4
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.text.secondary
  },
  menuSection: {
    backgroundColor: THEME.colors.surface,
    marginTop: THEME.spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: THEME.spacing.md
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuItemText: {
    marginLeft: THEME.spacing.md,
    fontSize: 16,
    color: THEME.colors.text.primary
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.error,
    padding: THEME.spacing.md,
    borderRadius: 12,
    marginVertical: THEME.spacing.lg,
    marginHorizontal: THEME.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: THEME.spacing.sm
  }
});

export default ProfileScreen;