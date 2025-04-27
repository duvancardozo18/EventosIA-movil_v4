import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/colors';
import ParticipantsTab from './tabssection/ParticipantsTab';
import ResourcesTab from './tabssection/ResourcesTab';
import FoodsTab from './tabssection/FoodsTab';
import { useAuth } from '../../../../../contexts/AuthContext';


const TabSection = ({
  activeTab,
  setActiveTab,
  participants,
  resources,
  foods,
  loadingParticipants,
  loadingResources,
  loadingFoods,
  event_id,
  navigation
}) => {
  const TabButton = ({ tabName }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTabButton]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabButtonText, activeTab === tabName && styles.activeTabButtonText]}>
        {tabName}
      </Text>
    </TouchableOpacity>
  );

  const { user } = useAuth();
  console.log("User in TabSection:", user);

  const isGestor = user?.role_name === "Gestor" || "SuperAdmin"; // O como venga en tu backend ("admin", "manager", etc.)

  return (
    <View style={styles.tabsSection}>
      <View style={styles.tabsHeader}>
        <TabButton tabName="Participantes" />
        <TabButton tabName="Recursos" />
        <TabButton tabName="Alimentos" />
      </View>

      <View style={styles.tabContent}>
        {activeTab === "Participantes" && (
          <ParticipantsTab 
            participants={participants}
            loading={loadingParticipants}
            event_id={event_id}
            navigation={navigation}
            isGestor={isGestor}
          />
        )}
        
        {activeTab === "Recursos" && (
          <ResourcesTab 
            resources={resources}
            loading={loadingResources}
            event_id={event_id}
            navigation={navigation}
            isGestor={isGestor}
          />
        )}
        
        {activeTab === "Alimentos" && (
          <FoodsTab 
            foods={foods}
            loading={loadingFoods}
            event_id={event_id}
            navigation={navigation}
            isGestor={isGestor}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsSection: {
    marginBottom: 100,
  },
  tabsHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.indigo[500],
  },
  tabButtonText: {
    color: colors.gray[500],
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: colors.indigo[500],
    fontWeight: "600",
  },
  tabContent: {
    minHeight: 200,
    padding: 16,
  },
});

export default TabSection;