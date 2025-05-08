"use client";
import { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'; 
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { useEvent } from "../../../../../contexts/EventContext";
import { useAuth } from "../../../../../contexts/AuthContext";
import BottomTabBar from "../../../../../components/BottomTabBar";
import { colors } from "../../../../../styles/colors";

export default function ParticipantListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { user } = useAuth();
  const { fetchEventParticipants, deleteParticipant, loading, error } = useEvent();
  
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingParticipant, setDeletingParticipant] = useState(false); // Nuevo loading local

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const loadParticipants = async () => {
        const data = await fetchEventParticipants(id);
        setParticipants(Array.isArray(data) ? data : []);
      };
      loadParticipants();
    }
  }, [isFocused, id]);

  const handleDeleteParticipant = (participantId) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro que deseas eliminar este participante?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => confirmDelete(participantId)
        }
      ]
    );
  };

  const confirmDelete = async (participantId) => {
    try {
      setDeletingParticipant(true);
      const success = await deleteParticipant(user.id_user, { id_participants: participantId });
  
      if (success) {
        // Recargar los participantes en lugar de navegar
        const updatedParticipants = await fetchEventParticipants(id);
        setParticipants(Array.isArray(updatedParticipants) ? updatedParticipants : []);
      } else {
        Alert.alert("Error", "No se pudo eliminar el participante");
      }
    } catch (error) {
      console.error("Error eliminando participante:", error);
      Alert.alert("Error", "Hubo un problema eliminando el participante");
    } finally {
      setDeletingParticipant(false);
    }
  };

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderParticipantItem = ({ item }) => (
    <View style={styles.participantItem}>
      <View style={styles.participantInfo}>
        <View style={styles.avatar}>
          <Icon name="user" size={40} color="#B0B0B0" />
        </View>
  
        <View style={styles.participantDetails}>
          <Text style={styles.participantName}>
            {item.user_name || "Usuario"} {item.user_last_name}
          </Text>
          <Text style={styles.participantEmail}>{item.email || "Sin correo"}</Text>
          <View style={[
            styles.statusTag, 
            item.participant_status_id === 2 ? styles.confirmedTag : styles.invitedTag
          ]}>
            <Text style={[
              styles.statusTagText,
              item.participant_status_id === 2 ? styles.confirmedTagText : styles.invitedTagText,
            ]}>
              {item.status_name}
            </Text>
          </View>
        </View>
      </View>
  
      <View style={styles.participantActions}>
      {(user?.role === "SuperAdmin" || user?.role === "EventManager") && (
        <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              //console.log("item:", item); // Verifica que 'item' tiene el campo 'id_participants'
              navigation.navigate("ParticipantStatus", {
                participantId: item.id_participants,  // Usa 'id_participants' en lugar de 'id'
                eventId: id,
              });
            }}
          >
            <Icon name="edit-2" size={20} color={colors.indigo[500]} />
        </TouchableOpacity>
      )}

      {(user?.role === "SuperAdmin" || user?.role === "EventManager") && (
          <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteParticipant(item.id_participants)}
        >
          <Icon name="trash-2" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        )}
      </View>
    </View>
  );
  if (loading && !deletingParticipant) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando participantes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={colors.gray[800]} />
      </TouchableOpacity>
        <Text style={styles.headerTitle}>Participantes</Text>
      </View>

      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.searchRow}>
          {(user?.role === "SuperAdmin" || user?.role === "EventManager") && (
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("SendInvitation", { id })}>
              <Icon name="plus" size={20} color="white" />
            </TouchableOpacity>
          )}


          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Icon name="search" size={20} color={colors.indigo[500]} style={styles.searchIcon} />
          </View>
        </View>

        {filteredParticipants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron participantes</Text>
          </View>
        ) : (
          <FlatList
            data={filteredParticipants}
            renderItem={renderParticipantItem}
            keyExtractor={(item, index) => (item?.id_participants ? item.id_participants.toString() : index.toString())}
            contentContainerStyle={styles.participantsList}
          />
        )}
      </View>

      <BottomTabBar activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    backgroundColor: colors.red[100],
    borderWidth: 1,
    borderColor: colors.red[400],
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    color: colors.red[700],
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.indigo[500],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  participantsList: {
    paddingBottom: 16,
  },
  participantItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
    paddingBottom: 9, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.gray[200], 
  },

  participantInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: colors.gray[200],
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  participantName: {
    fontWeight: "700",
    fontSize: 16,
  },
  participantEmail: {
    color: colors.gray[500],
    fontSize: 15,
    width: 250,        
  },  
  participantActions: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  
  statusTag: {
    paddingHorizontal: 12,  
    paddingVertical: 6,    
    borderRadius: 3,       
    marginTop: 12,
    alignSelf: 'flex-start',
},
  confirmedTag: {
    backgroundColor: colors.indigo[500],
  },
  invitedTag: {
    backgroundColor: colors.gray[100],
  },
  statusTagText: {
    fontSize: 15,  
    lineHeight: 18, 
  },
  confirmedTagText: {
    color: "white",
  },
  invitedTagText: {
    color: colors.indigo[500],
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.gray[500],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  
});