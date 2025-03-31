import { View, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { colors } from "../styles/colors"

export default function BottomTabBar({ activeTab }) {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Dashboard")}>
        <Icon name="home" size={24} color={activeTab === "home" ? colors.indigo[600] : colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("MyEvents")}>
        <Icon name="calendar" size={24} color={activeTab === "calendar" ? colors.indigo[600] : colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Notifications")}>
        <Icon name="bell" size={24} color={activeTab === "notifications" ? colors.indigo[600] : colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Profile")}>
        <Icon name="user" size={24} color={activeTab === "profile" ? colors.indigo[600] : colors.gray[500]} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingVertical: 12,
    backgroundColor: "white",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

