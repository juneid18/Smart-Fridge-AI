import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fridge</Text>
        <View style={styles.headerIcons}>
          <FontAwesome name="search" size={24} color="black" />
          <Image
            source={{ uri: 'https://storage.googleapis.com/a1aa/image/oIYxADGeHRzrESBro9R0LAONePNNzLxft6FzuNJB3SGlyUonA.jpg' }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Welcome Message */}
      <Text style={styles.welcomeMessage}>Welcome to your Fridge Inventory</Text>

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Recipes</Text>
        </TouchableOpacity>
      </View>

      {/* Item Categories */}
      <View style={styles.itemCategories}>
        <View style={styles.itemCategoriesHeader}>
          <Text style={styles.itemCategoriesTitle}>Item Categories</Text>
          <Image
            source={{ uri: 'https://storage.googleapis.com/a1aa/image/YjNkvvlaw1Z3ClqLg6LedSUCo1Qx2UgeFe3Uijjpv4MbyUonA.jpg' }}
            style={styles.categoryImage}
          />
        </View>
        <Text>Track your daily items progress</Text>
        <Text style={styles.progressText}>76% Full</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* Recipes Section */}
      <Text style={styles.sectionTitle}>Recipes</Text>
      <View style={styles.recipes}>
        {/* Recipe Card 1 */}
        <View style={styles.recipeCard}>
          <View style={styles.recipeCardHeader}>
            <FontAwesome name="utensils" size={24} color="black" />
            <Image
              source={{ uri: 'https://storage.googleapis.com/a1aa/image/K0GYAGLcGX5lGtR0Uyn3k2bBNhCO0H7GOoIYV558v63TmC9E.jpg' }}
              style={styles.recipeImage}
            />
          </View>
          <Text style={styles.recipeCount}>5 New</Text>
          <Text>Cookbooks</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
        {/* Recipe Card 2 */}
        <View style={styles.recipeCard}>
          <View style={styles.recipeCardHeader}>
            <FontAwesome name="box" size={24} color="black" />
            <Image
              source={{ uri: 'https://storage.googleapis.com/a1aa/image/K0GYAGLcGX5lGtR0Uyn3k2bBNhCO0H7GOoIYV558v63TmC9E.jpg' }}
              style={styles.recipeImage}
            />
          </View>
          <Text style={styles.recipeCount}>2 New</Text>
          <Text>Leftovers</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
        {/* Recipe Card 3 */}
        <View style={styles.recipeCard}>
          <View style={styles.recipeCardHeader}>
            <FontAwesome name="utensil-spoon" size={24} color="black" />
            <Image
              source={{ uri: 'https://storage.googleapis.com/a1aa/image/K0GYAGLcGX5lGtR0Uyn3k2bBNhCO0H7GOoIYV558v63TmC9E.jpg' }}
              style={styles.recipeImage}
            />
          </View>
          <Text style={styles.recipeCount}>9 New</Text>
          <Text>Meal</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
        {/* Recipe Card 4 */}
        <View style={styles.recipeCard}>
          <View style={styles.recipeCardHeader}>
            <FontAwesome name="bell" size={24} color="black" />
            <Image
              source={{ uri: 'https://storage.googleapis.com/a1aa/image/K0GYAGLcGX5lGtR0Uyn3k2bBNhCO0H7GOoIYV558v63TmC9E.jpg' }}
              style={styles.recipeImage}
            />
          </View>
          <Text style={styles.recipeCount}>5 New</Text>
          <Text>Quick Meals</Text>
          <TouchableOpacity style={[styles.viewAllButton, styles.viewAllButtonBlack]}>
            <Text style={[styles.viewAllButtonText, styles.viewAllButtonTextWhite]}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <FontAwesome name="home" size={24} color="black" />
        <FontAwesome name="plus-circle" size={24} color="black" />
        <FontAwesome name="user" size={24} color="black" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 16,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  navButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  navButton: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemCategories: {
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  itemCategoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemCategoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#d1d5db',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    width: '76%',
    height: '100%',
    backgroundColor: '#4b5563',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recipes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipeCard: {
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 8,
    width: '48%',
    marginBottom: 16,
  },
  recipeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  recipeCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  viewAllButton: {
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  viewAllButtonBlack: {
    backgroundColor: 'black',
  },
  viewAllButtonTextWhite: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    marginTop: 16,
  },
});
