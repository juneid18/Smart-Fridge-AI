import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import AddItemModal from "../../components/AddItemModal";
import EditItemModal from "../../components/EditItemModal";
import DeleteDialogBox from "../../components/DeleteDialogBox";
import { useUser } from "@clerk/clerk-expo";
import FetchUserData from "../services/FetchUserData";
import { RectButton, Swipeable } from "react-native-gesture-handler";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [EditmodalVisible, setEditModalVisible] = useState(false);
  const [UserData, setUserData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    email: "",
    id: null,
    name: "",
    quantity: 0,
  });
  const { user } = useUser();
  const swipeableRefs = useRef([]);

  // Fetch user data function
  const fetchData = async () => {
    try {
      const data = await FetchUserData(user?.emailAddresses[0]?.emailAddress);
      setUserData(data.userData || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle add item
  const handleAddItem = async (newItem) => {
    console.log("Adding items:", newItem);
    setModalVisible(false);
    setEditModalVisible(false);
    setIsOpen(true);
    setDialogVisible(false);

    // Refetch data to update the list
    await fetchData();

    // Close the swipeable item after data submission
    swipeableRefs.current.forEach((ref) => {
      if (ref && ref.close) {
        ref.close(); // Close all swipeable items
      }
    });
  };

  useEffect(() => {
    if (user?.emailAddresses[0]?.emailAddress) {
      fetchData();
    }
  }, [user?.emailAddresses[0]?.emailAddress]);

  const LeftSwapBtn = (id) => {
    return (
      <RectButton
        style={styles.ReactButtonDelete}
        onPress={() => {
          setDialogVisible(true);
          setCurrentItem({
            email: user?.emailAddresses[0]?.emailAddress,
            id: id,
          });
        }}
      >
        <MaterialCommunityIcons name="delete" size={24} color="red" />
      </RectButton>
    );
  };
  const RightSwapBtn = (id, name, quantity) => {
    return (
      <RectButton
        style={styles.ReactButtonEdit}
        onPress={() => {
          setEditModalVisible(true);
          setCurrentItem({ id, name, quantity });
        }}
      >
        <Feather
          name="edit-2"
          size={24}
          color="#4CAF50"
          style={{ elevation: 7 }}
        />
      </RectButton>
    );
  };
  function calculatePercentage(part, total) {
    if (total === 0) {
      return 0; // Avoid division by zero
    }
    return (part / total) * 100;
  }

  // Ensure UserData and UserData.items are defined
  const numberOfItems = UserData && UserData.items ? UserData.items.length : 0; // Default to 0 if undefined
  const totalCapacity = 40; // Define the total capacity

  // Calculate the percentage
  const percentageUsed = calculatePercentage(numberOfItems, totalCapacity);

  const progressFill = {
    height: "100%",
    width: `${percentageUsed}%`,
    backgroundColor: "#4b5563",
  };
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hello, {user?.firstName} 👋</Text>
          <View style={styles.headerIcons}>
            <Image
              source={{ uri: `${user?.imageUrl}` }}
              style={styles.profileImage}
            />
          </View>
        </View>
        <ScrollView style={styles.main}>
          <Text style={styles.welcomeText}>
            Welcome to your Fridge Inventory
          </Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Item Storage</Text>
              <Image
                source={{
                  uri: "https://cdn-icons-png.freepik.com/512/10495/10495156.png?ga=GA1.1.1129789819.1731424660",
                }}
                style={styles.categoryImage}
              />
            </View>
            <Text style={styles.sectionSubtitle}>
              Track your daily items storage
            </Text>
            <Text style={styles.progressText}>
              {Math.ceil(percentageUsed)}%
            </Text>
            <View style={styles.progressBar}>
              <View style={progressFill} />
            </View>
          </View>
          <Text style={styles.itemsTitle}>Items</Text>
          <View style={styles.itemsList}>
            {Array.isArray(UserData.items) && UserData.items.length > 0 ? (
              UserData.items.map((item, index) => {
                return (
                  <Swipeable
                    key={index}
                    ref={(ref) => (swipeableRefs.current[index] = ref)} // Save reference to each swipeable item
                    renderLeftActions={() => LeftSwapBtn(item._id)}
                    renderRightActions={() =>
                      RightSwapBtn(item._id, item.item_name, item.quantity)
                    }
                    onSwipeableOpen={() => setIsOpen(true)} // Open swipeable
                    onSwipeableClose={() => setIsOpen(false)} // Close swipeable
                  >
                    <View style={styles.itemRow}>
                      {/* <FontAwesome name="egg" size={24} color="black" /> */}
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>
                          {item.item_name || "Unknown Item"}
                        </Text>
                        <Text style={styles.itemInfo}>
                          Quantity: {item.quantity || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </Swipeable>
                );
              })
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  paddingVertical: 100,
                }}
              >
                <Image
                  source={{
                    uri: "https://cdn-icons-png.freepik.com/512/11503/11503428.png?ga=GA1.1.1129789819.1731424660",
                  }}
                  style={{
                    width: 50, // Adjust width to better fit the text
                    height: 50, // Adjust height to scale proportionately
                    resizeMode: "contain", // Maintain aspect ratio
                    marginBottom: 16,
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: "#6b7280",
                  }}
                >
                  No Items Yet
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
          accessibilityLabel="Add new inventory item"
          accessibilityHint="Opens a modal to add a new item to your fridge inventory"
        >
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
        {/* Add Item Modal */}
        <AddItemModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddItems={handleAddItem}
        />

        {/* Edit Item Modal */}
        <EditItemModal
          isVisible={EditmodalVisible}
          onClose={() => setEditModalVisible(false)}
          onUpdateItem={handleAddItem}
          currentItem={currentItem}
        />

        {/* Delete Item Model */}
        <DeleteDialogBox
          isVisible={isDialogVisible}
          onCancel={() => setDialogVisible(false)}
          onDeleteItem={handleAddItem}
          currentItem={currentItem}
        />
      </View>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "#858787",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: "black",
    elevation: 7,
  },
  main: {
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  section: {
    backgroundColor: "#e5e7eb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryImage: {
    width: 40,
    height: 40,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#d1d5db",
    borderRadius: 5,
    overflow: "hidden",
  },
  itemsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemsList: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  itemDetails: {
    marginLeft: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemInfo: {
    fontSize: 14,
  },
  addButton: {
    position: "absolute",
    bottom: 32,
    right: 32,
    backgroundColor: "#0A0B0B",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
  },
  ReactButtonDelete: {
    backgroundColor: '#FFCCCC', 
    padding: 12,             
    alignItems: 'center',    
    justifyContent: 'center',
  },
  ReactButtonEdit: {
    backgroundColor: '#D4EED1', 
    padding: 12,             
    alignItems: 'center',    
    justifyContent: 'center',
  },
});
