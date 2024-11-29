import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Animated,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { debounce } from "lodash";
import { Link } from "expo-router";

// Theme configuration
const THEME = {
  colors: {
    primary: "#10B981",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      light: "#9CA3AF",
    },
    border: "#E5E7EB",
    error: "#EF4444",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

// RecipeModal Component
const RecipeModal = ({ visible, recipe, onClose }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 1 : 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!recipe) return null;

  const ingredients = Array.from({ length: 20 }, (_, i) => {
    const ingredient = recipe[`strIngredient${i + 1}`];
    const measure = recipe[`strMeasure${i + 1}`];
    return ingredient ? `${measure} ${ingredient}` : null;
  }).filter(Boolean);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: recipe.strMealThumb }}
              style={styles.modalImage}
            />
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome5 name="times" size={20} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{recipe.strMeal}</Text>
              <Text style={styles.sectionTitle}>Category</Text>
              <Text style={styles.sectionText}>{recipe.strCategory}</Text>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.ingredientText}>
                  • {ingredient}
                </Text>
              ))}
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.instructionsText}>
                {recipe.strInstructions}
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

// RecipeCard Component
const RecipeCard = ({ recipe, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={[styles.recipeCard, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        onPress={() => onPress(recipe)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: recipe.strMealThumb }}
          style={styles.recipeImage}
        />
        <View style={styles.recipeCardContent}>
          <Text style={styles.recipeCardTitle} numberOfLines={2}>
            {recipe.strMeal}
          </Text>
          <Text style={styles.recipeCardCategory}>{recipe.strCategory}</Text>
          <View style={styles.recipeCardFooter}>
            <Text style={styles.viewRecipeText}>View Recipe</Text>
            <FontAwesome5
              name="arrow-right"
              size={14}
              color={THEME.colors.primary}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Main App Component
export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    visible: false,
    recipe: null,
  });

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setRecipes([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        );
        const data = await response.json();
        setRecipes(data.meals || []);
      } catch (err) {
        setError("Failed to fetch recipes. Please try again.");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleRecipePress = (recipe) => {
    setModalState({ visible: true, recipe });
  };

  const closeModal = () => {
    setModalState({ visible: false, recipe: null });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipes 🍲</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome5
            name="search"
            size={16}
            color={THEME.colors.text.light}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={THEME.colors.text.light}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch("")}
              style={styles.clearButton}
            >
              <FontAwesome5
                name="times-circle"
                size={16}
                color={THEME.colors.text.light}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => handleSearch(searchQuery)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recipesContainer}
        >
          <View style={styles.generateRecipeContainer}>
            <Text style={styles.generateRecipeTitle}>
              Generate Recipe By The Items You Have
            </Text>
            <Link href="/Screen/DoMagic" asChild>
              <TouchableOpacity style={styles.generateRecipeButton}>
                <FontAwesome5
                  name="magic"
                  size={20}
                  color="black"
                  style={styles.generateRecipeIcon}
                />
                <Text style={styles.generateRecipeButtonText}>Do Magic</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {recipes.length > 0 ? (
            <View style={styles.recipesGrid}>
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  onPress={handleRecipePress}
                />
              ))}
            </View>
          ) : (
            searchQuery.trim() && (
              <View style={styles.noResultsContainer}>
                <FontAwesome5
                  name="search"
                  size={50}
                  color={THEME.colors.text.light}
                />
                <Text style={styles.noResultsText}>No recipes found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching for something else
                </Text>
              </View>
            )
          )}
        </ScrollView>
      )}
      <RecipeModal
        visible={modalState.visible}
        recipe={modalState.recipe}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: THEME.colors.text.primary,
  },
  searchContainer: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    borderRadius: 12,
    paddingHorizontal: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.sm,
    fontSize: 16,
    color: THEME.colors.text.primary,
  },
  clearButton: {
    padding: THEME.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recipesContainer: {
    padding: THEME.spacing.md,
  },
  generateRecipeContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  generateRecipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  generateRecipeButton: {
    backgroundColor: "#ffcc00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  generateRecipeIcon: {
    marginRight: 8,
  },
  generateRecipeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  recipesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recipeCard: {
    width: "48%",
    marginBottom: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  recipeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  recipeCardContent: {
    padding: THEME.spacing.md,
  },
  recipeCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  recipeCardCategory: {
    fontSize: 14,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.sm,
  },
  recipeCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewRecipeText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.primary,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: THEME.spacing.xl * 2,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.text.secondary,
    marginTop: THEME.spacing.md,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: THEME.colors.text.light,
    marginTop: THEME.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  closeButton: {
    position: "absolute",
    top: THEME.spacing.lg,
    right: THEME.spacing.lg,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: THEME.spacing.sm,
    borderRadius: 20,
  },
  modalBody: {
    padding: THEME.spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    marginTop: THEME.spacing.lg,
  },
  sectionText: {
    fontSize: 16,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.sm,
  },
  ingredientText: {
    fontSize: 16,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
  },
  instructionsText: {
    fontSize: 16,
    color: THEME.colors.text.secondary,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: THEME.spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: THEME.colors.error,
    textAlign: "center",
    marginBottom: THEME.spacing.md,
  },
  retryButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: 8,
  },
  retryButtonText: {
    color: THEME.colors.surface,
    fontWeight: "600",
  },
});
