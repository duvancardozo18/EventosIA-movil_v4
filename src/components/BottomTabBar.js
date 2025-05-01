import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { colors } from "../styles/colors";
import { useUnreadNotifications } from "../hooks/useUnreadNotifications"; // importar el nuevo hook

export default function BottomTabBar({ activeTab }) {
  const navigation = useNavigation();
  const unreadCount = useUnreadNotifications(); // usar el contador

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Dashboard")}>
        <Icon
          name="home"
          size={24}
          color={activeTab === "home" ? colors.indigo[600] : colors.gray[500]}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("MyEvents")}>
        <Icon
          name="calendar"
          size={24}
          color={activeTab === "calendar" ? colors.indigo[600] : colors.gray[500]}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Notifications")}>
        <View style={styles.iconWithBadge}>
          <Icon
            name="bell"
            size={24}
            color={activeTab === "notifications" ? colors.indigo[600] : colors.gray[500]}
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Profile")}>
        <Icon
          name="user"
          size={24}
          color={activeTab === "profile" ? colors.indigo[600] : colors.gray[500]}
        />
      </TouchableOpacity>
    </View>
  );
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
  iconWithBadge: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: colors.red[500],
    borderRadius: 10,
    paddingHorizontal: 6,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
