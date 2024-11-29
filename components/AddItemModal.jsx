import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import ImageAnalysisModal from "./ImageAnalysisModal";

const { width, height } = Dimensions.get("window");

const AddItemModal = ({ isVisible, onClose, onAddItems }) => {
  const [items, setItems] = useState([{ name: "", quantity: 1 }]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);

  const handleAddItem = async () => {
    if (loading) return;
    setLoading(true);

    const invalidItem = items.find((item) => !item.name || item.quantity <= 0);

    if (invalidItem) {
      Alert.alert("Error", "Please fill out all fields correctly.");
      setLoading(false);
      return;
    }

    const formattedItems = items.map((item) => ({
      item_name: item.name,
      quantity: item.quantity,
    }));

    try {
      const response = await axios.post(
        "http://192.168.185.236:3000/updateuser",
        {
          email: user.emailAddresses[0].emailAddress,
          items: formattedItems,
        }
      );
      if (response) {
        console.log("Response is appended");
      }
      onAddItems(items);
    } catch (error) {
      Alert.alert("Error", "Failed to save items. Please try again.");
      console.log("Error occurred", error);
    } finally {
      resetForm();
      setLoading(false);
    }
  };

  const resetForm = () => {
    setItems([{ name: "", quantity: 1 }]);
    onClose();
  };

  const increaseQuantity = (index) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index].quantity += 1;
      return newItems;
    });
  };

  const decreaseQuantity = (index) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index].quantity = Math.max(1, newItems[index].quantity - 1);
      return newItems;
    });
  };

  const handleItemChange = (index, field, value) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index][field] = value;
      return newItems;
    });
  };

  const addMoreFields = () => {
    setItems((prevItems) => [...prevItems, { name: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    }
  };

  const handleAnalysisResult = (result) => {
    // console.log("Received analysis result:", result);
    
    if (result && result.items && Array.isArray(result.items)) {
      const formattedItems = result.items.map(item => ({
        name: item.Item_name || "Unknown",
        quantity: item.quantity || 1
      }));
      setItems(formattedItems)
    } else {
      console.error("Invalid analysis result format:", result);
    }
  };
  
  
  

  // Use formattedItems wherever needed

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={styles.modalContainer}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => setModelVisible(true)}
                style={styles.magicButton}
              >
                <MaterialIcons name="auto-awesome" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Create List</Text>
              <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
                <FontAwesome name="times" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Input Section */}
            <ScrollView
              style={styles.inputContainer}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.inputWrapper}>
                    <FontAwesome
                      name="tag"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Item Name"
                      placeholderTextColor="#999"
                      value={item.name}
                      onChangeText={(value) =>
                        handleItemChange(index, "name", value)
                      }
                    />
                    {items.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeItem(index)}
                        style={styles.removeItemButton}
                      >
                        <FontAwesome name="trash" size={18} color="#FF6B6B" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() => decreaseQuantity(index)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => increaseQuantity(index)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddItem}
                disabled={loading}
              >
                <Text style={styles.addButtonText}>
                  {loading ? "Saving..." : "Add Items"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={addMoreFields}
              >
                <Text style={styles.addMoreButtonText}>Add More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
        <ImageAnalysisModal
          isVisible={modelVisible}
          onClose={() => setModelVisible(false)}
          onAnalyze={(result) => handleAnalysisResult(result)}
          />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  blurContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalContainer: {
    width: width,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: -5,
    right: 15,
  },
  modalTitle: {
    position: "absolute",
    left: 100,
    fontWeight: "800",
    fontSize: 24,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  addMoreButton: {
    width: "100%",
    paddingTop: 20,
    alignItems: "center",
    marginBottom: 15,
  },
  addMoreButtonText: {
    color: "black",
    textDecorationLine: "underline",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    width: "100%",
    backgroundColor: "#0A0B0B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddItemModal;
