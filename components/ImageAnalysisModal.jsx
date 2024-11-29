import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import ImageAnalysisService from "../app/services/ImageAnalysis";

const ImageAnalysisModal = ({ isVisible, onClose, onAnalyze }) => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async (source) => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleImageAnalysis = async () => {
    setAnalysisResult(null); // Clear previous analysis result
  
    if (selectedImage) {
      setLoading(true);
      try {
        const analysisResult = await ImageAnalysisService(selectedImage);
  
        if (analysisResult && Array.isArray(analysisResult.items)) {
          // console.log("Items Array Found:", analysisResult.items);
          setAnalysisResult(analysisResult);  // Update the state with the analysis result
          onAnalyze(analysisResult);  // Trigger the onAnalyze callback
        } else {
          console.error("Analysis result is missing the expected 'items' array.");
          setAnalysisResult({ error: "Items array missing." });  // Set an error result to show in the UI
          Alert.alert("Error", "Analysis result is missing items.");
        }
  
        onClose();
      } catch (error) {
        console.error("Analysis failed:", error);
        setAnalysisResult({ error: "Analysis failed. Please try again." });  // Set an error message
        Alert.alert("Error", "Failed to analyze image");
      } finally {
        setLoading(false);
      }
    }
  };
  
  
  
  
  
  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
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
            {/* Header */}
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialIcons name="close" size={24} color="#0A0B0B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Image Analysis</Text>
            </View>

            {/* Image Selection Area */}
            <TouchableOpacity
              style={styles.imagePickerContainer}
              onPress={() => {
                // Prompt user for camera or gallery choice
                Alert.alert(
                  "Choose Image Source",
                  "Select the image source",
                  [
                    {
                      text: "Camera",
                      onPress: () => pickImage("camera"),
                    },
                    {
                      text: "Gallery",
                      onPress: () => pickImage("gallery"),
                    },
                  ]
                );
              }}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <MaterialIcons name="add-photo-alternate" size={50} color="#888" />
                  <Text style={styles.placeholderText}>Select Image</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Analysis Result */}
            {/* {analysisResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Analysis Result:</Text>
                <Text style={styles.resultText}>{analysisResult}</Text>
              </View>
            )} */}

            {/* Action Buttons */}
            <View style={styles.actionButtonContainer}>
              {selectedImage && !analysisResult && (
                <TouchableOpacity
                  style={styles.analyzeButton}
                  onPress={handleImageAnalysis}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Analyzing..." : "Analyze Image"}
                  </Text>
                </TouchableOpacity>
              )}

              {analysisResult && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetAnalysis}
                >
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  blurContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 0,
    padding: 10,
  },
  modalTitle: {
    color: "black",
    fontWeight: "800",
    fontSize: 24,
  },
  imagePickerContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#D3D3D3",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
    marginTop: 10,
  },
  resultContainer: {
    backgroundColor: "#1A1B1B",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  resultTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
  },
  resultText: {
    color: "#aaa",
  },
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  analyzeButton: {
    backgroundColor: "#0A0B0B",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ImageAnalysisModal;
