import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
const DeleteDialogBox = ({ isVisible, onCancel, currentItem, onDeleteItem }) => {

    const onConfirm = async () =>{
        try {
            const response = await axios.post('http://192.168.185.236:3000/deleteItem',{
                email: currentItem.email,
                itemID: currentItem.id,
            })
            if (response) {
                console.log("Item Deleted successfully");
                onDeleteItem(response);
              }
        } catch (error) {
            Alert.alert("Error", "Failed to Delete item. Please try again.");
            console.log("Error:", error);
        }
    }
  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.dialogBox}> 
        <MaterialIcons name="delete-outline" size={150} color={'red'} />
          <Text style={styles.title}>Are you sure?</Text>
          <Text style={styles.message}>Do you want to delete this item?</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  dialogBox: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DeleteDialogBox;
