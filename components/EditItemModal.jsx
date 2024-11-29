import React, { useState, useEffect } from "react";
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
import { BlurView } from "expo-blur";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";

const { width, height } = Dimensions.get("window");

const EditItemModal = ({ isVisible, onClose, onUpdateItem, currentItem }) => {
  const [item, setItem] = useState({ itemId: "", name: "", quantity: 1 });
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // Sync currentItem with item state when modal opens
  useEffect(() => {
    if (currentItem) {
      setItem({
        itemId: currentItem.id,
        name: currentItem.name,
        quantity: currentItem.quantity,
      });
    }
  }, [currentItem, isVisible]);

  const handleUpdateItem = async () => {
    if (loading) return;
    setLoading(true);

    if (!item.name || item.quantity <= 0) {
      Alert.alert("Error", "Please fill out all fields correctly.");
      setLoading(false);
      return;
    }

    const formattedItem = {
      itemId: item.itemId,
      item_name: item.name,
      quantity: item.quantity,
    };

    try {
      const response = await axios.post(
        "http://192.168.185.236:3000/updateItem",
        {
          email: user.emailAddresses[0].emailAddress,
          itemID: formattedItem.itemId, // Use the actual item ID
          name: formattedItem.item_name, // Item name
          quantity: formattedItem.quantity,
        }
      );

      if (response) {
        console.log("Item updated successfully");
        onUpdateItem(formattedItem); // Pass the updated item to the parent component
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update item. Please try again.");
      console.log("Error:", error);
    } finally {
      resetForm();
      setLoading(false);
    }
  };

  const resetForm = () => {
    setItem({ name: "", quantity: 1 });
    onClose();
  };

  const increaseQuantity = () => {
    setItem((prevItem) => ({
      ...prevItem,
      quantity: prevItem.quantity + 1,
    }));
  };

  const decreaseQuantity = () => {
    setItem((prevItem) => ({
      ...prevItem,
      quantity: Math.max(1, prevItem.quantity - 1),
    }));
  };

  const handleItemChange = (field, value) => {
    setItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

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
              <Text style={styles.modalTitle}>Edit Item</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome name="times" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Input Section */}
            <ScrollView
              style={styles.inputContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.itemRow}>
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
                    value={item.name} // Bind value to item.name
                    onChangeText={(value) => handleItemChange("name", value)} // Update item name
                  />
                </View>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={decreaseQuantity}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={increaseQuantity}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleUpdateItem}
              >
                <Text style={styles.addButtonText}>
                  {loading ? "Updating..." : "Update Item"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
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
    marginBottom: 50,
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

export default EditItemModal;
