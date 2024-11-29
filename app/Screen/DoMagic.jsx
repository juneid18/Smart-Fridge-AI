import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import DoMagicAI from "../services/DoMagicAI";
import FetchUserData from "../services/FetchUserData";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";

// Color Palette
const COLORS = {
  background: "#F5F5FA",  // Keeping light background for readability
  primary: "#ffcc00",      // Primary yellow
  secondary: "#7ED7C1",    // Slightly muted secondary color, can be kept as-is or adjusted if you prefer
  text: "#0A0B0B",         // Dark text color
  textLight: "#7F8C8D",    // Lighter text for descriptions
  white: "#FFFFFF",        // White for card backgrounds
  shadow: "rgba(0, 0, 0, 0.1)",  // Shadow for depth effect
};

const { width } = Dimensions.get("window");

const RecipeCards = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [slideAnim] = useState(new Animated.Value(600)); // Initialize the animated value for the slide effect
  const { user } = useUser();

  const cleanJSON = (response) => {
    try {
      // Remove trailing commas, which are sometimes included in malformed JSON
      let cleanResponse = response.replace(/,\s*$/, "");
      // Try to match valid JSON inside the response
      const match = cleanResponse.match(/{[\s\S]*}/);
      return match ? JSON.parse(match[0]) : null;
    } catch (error) {
      console.error("Error cleaning JSON:", error.message);
      return null;
    }
  };
  

  const fetchData = async () => {
    setLoading(true);
    try {
      const userResponse = await FetchUserData(
        user.emailAddresses[0].emailAddress
      );

      if (userResponse && userResponse.userData?.items?.length > 0) {
        const itemNames = userResponse.userData.items.map(
          (item) => item.item_name
        );
        const prompt = `
  You are an AI that generates recipes based on available ingredients. The fridge contains the following items: ${itemNames}. 
  Please generate a valid JSON response that includes a list of recipes. Each recipe should have the following structure:
  {
    "name": "Recipe Name",
    "ingredients": ["Ingredient 1", "Ingredient 2", ...],
    "category": "Recipe Category",
    "instructions": "Step-by-step in detail instructions to prepare the recipe."
  }
  Make sure the JSON response is valid and properly formatted. Do not include any extra characters or information outside of the JSON structure.
`;

        const aiResponse = await DoMagicAI(prompt);
        const parsedData = cleanJSON(aiResponse);

        if (parsedData?.recipes) {
          setRecipes(parsedData.recipes);
        } else {
          throw new Error("Invalid response format.");
        }
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalVisible(true);

    // Start the sliding animation
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 10,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    // Start the sliding animation to close the modal
    Animated.spring(slideAnim, {
      toValue: 600,
      friction: 10,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Close the modal after animation
    setTimeout(() => {
      setIsModalVisible(false);
      setSelectedRecipe(null);
    }, 200);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{height:'100%', flex:1,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{fontSize:10}}>Generating recipes based on your fridge items...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.cardContainer}
          showsVerticalScrollIndicator={false}
        >
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recipeCard}
                onPress={() => openModal(recipe)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.recipeTitle} numberOfLines={2}>
                    {recipe.name}
                  </Text>
                  <FontAwesome5
                    name="chevron-right"
                    size={18}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.recipeDescription} numberOfLines={3}>
                  {recipe.instructions}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.categoryBadge}>
                    {recipe.category || "Uncategorized"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome5
                name="utensils"
                size={64}
                color={COLORS.textLight}
              />
              <Text style={styles.noRecipesText}>
                No recipes available. Let's add some ingredients!
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Modal remains mostly the same, with some style updates */}
      {selectedRecipe && (
        <Modal
          visible={isModalVisible}
          animationType="none"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <FontAwesome5 name="times" size={20} color={COLORS.white} />
                </TouchableOpacity>

                <View style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>

                  <View style={styles.recipeDetailSection}>
                    <FontAwesome5 name="tag" size={16} color={COLORS.primary} />
                    <Text style={styles.sectionDetailText}>
                      {selectedRecipe.category || "Uncategorized"}
                    </Text>
                  </View>

                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  {selectedRecipe.ingredients &&
                  selectedRecipe.ingredients.length > 0 ? (
                    selectedRecipe.ingredients.map((ingredient, index) => (
                      <View key={index} style={styles.ingredientItem}>
                        <FontAwesome5
                          name="circle"
                          size={8}
                          color={COLORS.secondary}
                          style={styles.ingredientDot}
                        />
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noIngredientsText}>
                      No ingredients available.
                    </Text>
                  )}

                  <Text style={styles.sectionTitle}>Instructions</Text>
                  <Text style={styles.instructionsText}>
                    {selectedRecipe.instructions ||
                      "No instructions available."}
                  </Text>
                </View>
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cardContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  recipeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  recipeDescription: {
    color: COLORS.textLight,
    fontSize: 14,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    overflow: "hidden",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  noRecipesText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 15,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "60%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
  },
  modalScrollContent: {
    flexGrow: 1,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 15,
  },
  recipeDetailSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionDetailText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 15,
    marginBottom: 10,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ingredientDot: {
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 15,
    color: COLORS.text,
  },
  noIngredientsText: {
    fontSize: 15,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  instructionsText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
});

export default RecipeCards;
