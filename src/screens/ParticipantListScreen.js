"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useEvent } from "../contexts/EventContext"
import BottomTabBar from "../components/BottomTabBar"
import { colors } from "../styles/colors"

export default function ParticipantListScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params
  const [searchTerm, setSearchTerm] = useState("")
  const { fetchEventParticipants, loading, error } = useEvent()
  const [participants, setParticipants] = useState([])

  useEffect(() => {
    const loadParticipants = async () => {
      const data = await fetchEventParticipants(id)
      setParticipants(data || [])
    }

    loadParticipants()
  }, [fetchEventParticipants, id])

  // Filtrar participantes según el término de búsqueda
  const filteredParticipants = participants.filter(
    (participant) =>
      participant.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.user_email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderParticipantItem = ({ item }) => (
    <View style={styles.participantItem}>
      <View style={styles.participantInfo}>
        <View style={styles.avatar}>
          <Image source={{ uri: "https://via.placeholder.com/48" }} style={styles.avatarImage} />
        </View>
        <View>
          <Text style={styles.participantName}>{item.user_name || "Usuario"}</Text>
          <Text style={styles.participantEmail}>{item.user_email || "Sin correo"}</Text>
        </View>
      </View>

      <View style={styles.participantActions}>
        <View style={[styles.statusTag, item.participant_status_id === 2 ? styles.confirmedTag : styles.invitedTag]}>
          <Text
            style={[
              styles.statusTagText,
              item.participant_status_id === 2 ? styles.confirmedTagText : styles.invitedTagText,
            ]}
          >
            {item.participant_status_id === 1
              ? "Invitado"
              : item.participant_status_id === 2
                ? "Confirmado"
                : "Desconocido"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => navigation.navigate("InvitationDeleted", { id, participanteId: item.id })}
        >
          <Icon name="trash-2" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando participantes...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("EventDetail", { id })}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Participantes</Text>
      </View>

      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("SendInvitation", { id })}>
            <Icon name="plus" size={20} color="white" />
          </TouchableOpacity>

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
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.participantsList}
          />
        )}
      </View>

      <BottomTabBar activeTab="home" />
    </View>
  )
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
    marginBottom: 16,
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
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  participantName: {
    fontWeight: "500",
  },
  participantEmail: {
    color: colors.gray[500],
    fontSize: 14,
  },
  participantActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  confirmedTag: {
    backgroundColor: colors.indigo[500],
  },
  invitedTag: {
    backgroundColor: colors.gray[100],
  },
  statusTagText: {
    fontSize: 12,
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
})

