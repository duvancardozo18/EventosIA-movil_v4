// React & Context
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Context Providers
import { AuthProvider } from "./src/contexts/AuthContext";
import { UserProvider } from "./src/contexts/UserContext";
import { EventProvider } from "./src/contexts/EventContext";
import { ResourceProvider } from "./src/contexts/ResourceContext";
import { FoodProvider } from "./src/contexts/FoodContext";
import { LocationProvider } from "./src/contexts/LocationContext";
import { EventTypeProvider } from "./src/contexts/EventTypeContext";

// Screens
import HomeScreen from "./src/screens/home/HomeScreen";
import LoginScreen from "./src/screens/login/LoginScreen";
import RegisterScreen from "./src/screens/register/RegisterScreen";
import AccountCreatedScreen from "./src/screens/register/AccountCreatedScreen";
import RecoverPasswordScreen from "./src/screens/recovery/RecoverPasswordScreen";
import DashboardScreen from "./src/screens/dashboard/DashboardScreen";
import CreateEventScreen from "./src/screens/dashboard/myevents/event/CreateEventScreen";
import EventCreatedScreen from "./src/screens/dashboard/myevents/event/EventCreatedScreen";
import MyEventsScreen from "./src/screens/dashboard/myevents/MyEventsScreen";
import EventDetailScreen from "./src/screens/dashboard/myevents/event/EventDetailScreen";
import EventDeletedScreen from "./src/screens/dashboard/myevents/event/EventDeletedScreen";
import ParticipantListScreen from "./src/screens/dashboard/myevents/event/participant/ParticipantListScreen";
import SendInvitationScreen from "./src/screens/dashboard/myevents/event/participant/SendInvitationScreen";
import InvitationSentScreen from "./src/screens/dashboard/myevents/event/participant/InvitationSentScreen";
import AccountNotVerifiedScreen from "./src/screens/register/AccountNotVerifiedScreen";
import RestoreAccountScreen from "./src/screens/recovery/RestoreAccountScreen";
import AccountRestoredScreen from "./src/screens/recovery/AccountRestoredScreen";
import InvitationDeletedScreen from "./src/screens/dashboard/myevents/event/participant/InvitationDeletedScreen";
import EventStatusScreen from "./src/screens/dashboard/myevents/event/EventStatusScreen";
import EditEventScreen from "./src/screens/dashboard/myevents/event/EditEventScreen";
import BillingScreen from "./src/screens/dashboard/myevents/event/billing/BillingScreen";
import LinkClientScreen from "./src/screens/dashboard/myevents/event/customer/LinkClientScreen";
import QuoteSentScreen from "./src/screens/dashboard/myevents/event/customer/QuoteSentScreen";
import ClientDeletedScreen from "./src/screens/dashboard/myevents/event/customer/ClientDeletedScreen";
import ResourceListScreen from "./src/screens/dashboard/myevents/event/resource/ResourceListScreen";
import AddResourceScreen from "./src/screens/dashboard/myevents/event/resource/AddResourceScreen";
import ResourceCreatedScreen from "./src/screens/dashboard/myevents/event/resource/ResourceCreatedScreen";
import EditResourceScreen from "./src/screens/dashboard/myevents/event/resource/EditResourceScreen";
import ResourceDeletedScreen from "./src/screens/dashboard/myevents/event/resource/ResourceDeletedScreen";
import FoodListScreen from "./src/screens/dashboard/myevents/event/food/FoodListScreen";
//import AddFoodScreen from "./src/screens/AddFoodScreen";
import FoodCreatedScreen from "./src/screens/dashboard/myevents/event/food/FoodCreatedScreen";
//import EditFoodScreen from "./src/screens/EditFoodScreen";
import FoodDeletedScreen from "./src/screens/dashboard/myevents/event/food/FoodDeletedScreen";
import NotificationsScreen from "./src/screens/dashboard/notification/NotificationsScreen";
import ProfileScreen from "./src/screens/dashboard/profile/ProfileScreen";

// Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>

        
          <EventProvider>
            <ResourceProvider>
              <FoodProvider>
                <LocationProvider>
                  <EventTypeProvider>
                  <NavigationContainer>
                  <UserProvider>
                    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="Home" component={HomeScreen} />
                      <Stack.Screen name="Login" component={LoginScreen} />
                      <Stack.Screen name="Register" component={RegisterScreen} />
                      <Stack.Screen name="AccountCreated" component={AccountCreatedScreen} />
                      <Stack.Screen name="AccountNotVerified" component={AccountNotVerifiedScreen} />
                      <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />
                      <Stack.Screen name="RestoreAccount" component={RestoreAccountScreen} />
                      <Stack.Screen name="AccountRestored" component={AccountRestoredScreen} />
                      <Stack.Screen name="Dashboard" component={DashboardScreen} />
                      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
                      <Stack.Screen name="EventCreated" component={EventCreatedScreen} />
                      <Stack.Screen name="MyEvents" component={MyEventsScreen} />
                      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
                      <Stack.Screen name="EventDeleted" component={EventDeletedScreen} />
                      <Stack.Screen name="ParticipantList" component={ParticipantListScreen} />
                      <Stack.Screen name="SendInvitation" component={SendInvitationScreen} />
                      <Stack.Screen name="InvitationSent" component={InvitationSentScreen} />
                      <Stack.Screen name="InvitationDeleted" component={InvitationDeletedScreen} />
                      <Stack.Screen name="EventStatus" component={EventStatusScreen} />
                      <Stack.Screen name="EditEvent" component={EditEventScreen} />
                      <Stack.Screen name="Billing" component={BillingScreen} />
                      <Stack.Screen name="LinkClient" component={LinkClientScreen} />
                      <Stack.Screen name="QuoteSent" component={QuoteSentScreen} />
                      <Stack.Screen name="ClientDeleted" component={ClientDeletedScreen} />
                      <Stack.Screen name="ResourceList" component={ResourceListScreen} />
                      <Stack.Screen name="AddResource" component={AddResourceScreen} />
                      <Stack.Screen name="ResourceCreated" component={ResourceCreatedScreen} />
                      <Stack.Screen name="EditResource" component={EditResourceScreen} />
                      <Stack.Screen name="ResourceDeleted" component={ResourceDeletedScreen} />
                      <Stack.Screen name="FoodList" component={FoodListScreen} />
                      
                      <Stack.Screen name="FoodCreated" component={FoodCreatedScreen} />
                      
                      <Stack.Screen name="FoodDeleted" component={FoodDeletedScreen} />
                      <Stack.Screen name="Notifications" component={NotificationsScreen} />
                      <Stack.Screen name="Profile" component={ProfileScreen} />
                    </Stack.Navigator>
                    </UserProvider>
                  </NavigationContainer>
                  <StatusBar style="auto" />
                  </EventTypeProvider>
                </LocationProvider>
              </FoodProvider>
            </ResourceProvider>
          </EventProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
