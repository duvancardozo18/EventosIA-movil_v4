"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useEvent } from "../contexts/EventContext"
import BottomTabBar from "../components/BottomTabBar"
import { colors } from "../styles/colors"

export default function EventDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params
  const [activeTab, setActiveTab] = useState("Participantes")
  const { fetchEvent, currentEvent, loading, error, fetchEventParticipants, fetchEventResources, fetchEventFoods } =
    useEvent()
  const [participants, setParticipants] = useState([])
  const [resources, setResources] = useState([])
  const [foods, setFoods] = useState([])
  const [loadingResources, setLoadingResources] = useState(false)
  const [loadingFoods, setLoadingFoods] = useState(false)
  const [loadingParticipants, setLoadingParticipants] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      await fetchEvent(id)
    }

    loadEvent()
  }, [fetchEvent, id])

  useEffect(() => {
    const loadTabData = async () => {
      if (activeTab === "Participantes") {
        setLoadingParticipants(true)
        try {
          const data = await fetchEventParticipants(id)
          setParticipants(data || [])
        } catch (error) {
          console.error("Error al cargar participantes:", error)
        } finally {
          setLoadingParticipants(false)
        }
      } else if (activeTab === "Recursos") {
        setLoadingResources(true)
        try {
          const data = await fetchEventResources(id)
          setResources(data || [])
        } catch (error) {
          console.error("Error al cargar recursos:", error)
        } finally {
          setLoadingResources(false)
        }
      } else if (activeTab === "Alimentos") {
        setLoadingFoods(true)
        try {
          const data = await fetchEventFoods(id)
          setFoods(data || [])
        } catch (error) {
          console.error("Error al cargar alimentos:", error)
        } finally {
          setLoadingFoods(false)
        }
      }
    }

    loadTabData()
  }, [activeTab, fetchEventParticipants, fetchEventResources, fetchEventFoods, id])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando evento...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("MyEvents")}>
          <Text style={styles.backButtonText}>Volver a mis eventos</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!currentEvent) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se encontró el evento</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("MyEvents")}>
          <Text style={styles.backButtonText}>Volver a mis eventos</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {currentEvent.image_url ? (
          <Image source={{ uri: currentEvent.image_url }} style={styles.eventImage} resizeMode="cover" />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
        )}
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.navigate("MyEvents")}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.statusButton} onPress={() => navigation.navigate("EventStatus", { id })}>
          <Text style={styles.statusText}>
            {currentEvent.event_state_id === 1
              ? "Planificado"
              : currentEvent.event_state_id === 2
                ? "En curso"
                : currentEvent.event_state_id === 3
                  ? "Completado"
                  : currentEvent.event_state_id === 4
                    ? "Cancelado"
                    : "Desconocido"}
          </Text>
          <Icon name="edit-2" size={16} color={colors.indigo[500]} style={styles.statusIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>{currentEvent.name}</Text>
        <Text style={styles.category}>
          {currentEvent.type_of_event_id ? `Tipo: ${currentEvent.type_of_event_id}` : "Sin categoría"}
        </Text>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Icon name="calendar" size={20} color={colors.indigo[500]} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoTitle}>
                {currentEvent.start_time
                  ? new Date(currentEvent.start_time).toLocaleDateString()
                  : "Fecha no disponible"}
              </Text>
              <Text style={styles.infoSubtitle}>
                {currentEvent.start_time && currentEvent.end_time
                  ? `${new Date(currentEvent.start_time).toLocaleTimeString()} - ${new Date(currentEvent.end_time).toLocaleTimeString()}`
                  : "Horario no disponible"}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Icon name="map-pin" size={20} color={colors.indigo[500]} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoTitle}>{currentEvent.location_name || "Ubicación no especificada"}</Text>
              <Text style={styles.infoSubtitle}>{currentEvent.location_address || "Dirección no disponible"}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Icon name="video" size={20} color={colors.indigo[500]} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoTitle}>
                Modalidad - {currentEvent.type_of_event_id ? "Virtual" : "Presencial"}
              </Text>
              <Text style={styles.infoSubtitle}>
                {currentEvent.video_conference_link || "Sin enlace de videoconferencia"}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Icon name="users" size={20} color={colors.indigo[500]} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoTitle}>
                Max. Participantes: {currentEvent.max_participants || "No especificado"}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditEvent", { id })}>
            <Icon name="edit-2" size={20} color={colors.indigo[500]} style={styles.editIcon} />
            <Text style={styles.editButtonText}>Editar Ajustes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{currentEvent.description || "Sin descripción"}</Text>
          {currentEvent.description && currentEvent.description.length > 100 && (
            <TouchableOpacity>
              <Text style={styles.readMoreText}>Read More...</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tabsSection}>
          <View style={styles.tabsHeader}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "Participantes" && styles.activeTabButton]}
              onPress={() => setActiveTab("Participantes")}
            >
              <Text style={[styles.tabButtonText, activeTab === "Participantes" && styles.activeTabButtonText]}>
                Participantes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "Recursos" && styles.activeTabButton]}
              onPress={() => setActiveTab("Recursos")}
            >
              <Text style={[styles.tabButtonText, activeTab === "Recursos" && styles.activeTabButtonText]}>
                Recursos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "Alimentos" && styles.activeTabButton]}
              onPress={() => setActiveTab("Alimentos")}
            >
              <Text style={[styles.tabButtonText, activeTab === "Alimentos" && styles.activeTabButtonText]}>
                Alimentos
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>
            {activeTab === "Participantes" && (
              <View>
                {loadingParticipants ? (
                  <Text style={styles.loadingText}>Cargando participantes...</Text>
                ) : participants.length === 0 ? (
                  <Text style={styles.emptyText}>No hay participantes registrados</Text>
                ) : (
                  <>
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <View style={styles.statDot}>
                          <View style={styles.statDotInner}></View>
                        </View>
                        <Text style={styles.statLabel}>Confirmados</Text>
                      </View>
                      <Text style={styles.statValue}>
                        {participants.filter((p) => p.participant_status_id === 2).length}
                      </Text>
                    </View>

                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <View style={styles.emptyStatDot}></View>
                        <Text style={styles.statLabel}>Invitados</Text>
                      </View>
                      <Text style={styles.statValue}>
                        {participants.filter((p) => p.participant_status_id === 1).length}
                      </Text>
                    </View>

                    {participants.slice(0, 3).map((participant) => (
                      <View key={participant.id} style={styles.participantItem}>
                        <View style={styles.participantInfo}>
                          <View style={styles.participantAvatar}>
                            <Image source={{ uri: "https://via.placeholder.com/48" }} style={styles.avatarImage} />
                          </View>
                          <Text style={styles.participantName}>{participant.user_name || "Usuario"}</Text>
                        </View>
                        <View
                          style={[
                            styles.statusTag,
                            participant.participant_status_id === 2 ? styles.confirmedTag : styles.invitedTag,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusTagText,
                              participant.participant_status_id === 2 ? styles.confirmedTagText : styles.invitedTagText,
                            ]}
                          >
                            {participant.participant_status_id === 1
                              ? "Invitado"
                              : participant.participant_status_id === 2
                                ? "Confirmado"
                                : "Desconocido"}
                          </Text>
                        </View>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.viewAllButton}
                      onPress={() => navigation.navigate("ParticipantList", { id })}
                    >
                      <Text style={styles.viewAllText}>Ver todos</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            {activeTab === "Recursos" && (
              <View>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddResource", { id })}>
                  <Icon name="plus" size={24} color="white" />
                </TouchableOpacity>

                {loadingResources ? (
                  <Text style={styles.loadingText}>Cargando recursos...</Text>
                ) : resources.length === 0 ? (
                  <Text style={styles.emptyText}>No hay recursos asignados</Text>
                ) : (
                  <View>
                    {resources.slice(0, 2).map((recurso) => (
                      <View key={recurso.id} style={styles.resourceItem}>
                        <View style={styles.resourceHeader}>
                          <Text style={styles.resourceName}>{recurso.name}</Text>
                          <Text style={styles.resourcePrice}>${recurso.price}</Text>
                        </View>
                        <View style={styles.resourceQuantity}>
                          <View style={styles.quantityDot}>
                            <View style={styles.quantityDotInner}></View>
                          </View>
                          <Text style={styles.quantityText}>{recurso.quantity_available} unidades</Text>
                        </View>
                        <Text style={styles.resourceDescription}>{recurso.description}</Text>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.viewAllButton}
                      onPress={() => navigation.navigate("ResourceList", { id })}
                    >
                      <Text style={styles.viewAllText}>Ver todos</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {activeTab === "Alimentos" && (
              <View>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddFood", { id })}>
                  <Icon name="plus" size={24} color="white" />
                </TouchableOpacity>

                {loadingFoods ? (
                  <Text style={styles.loadingText}>Cargando alimentos...</Text>
                ) : foods.length === 0 ? (
                  <Text style={styles.emptyText}>No hay alimentos asignados</Text>
                ) : (
                  <View>
                    {foods.slice(0, 2).map((alimento) => (
                      <View key={alimento.id} style={styles.foodItem}>
                        <View style={styles.foodHeader}>
                          <Text style={styles.foodName}>{alimento.name}</Text>
                          <Text style={styles.foodPrice}>${alimento.price}</Text>
                        </View>
                        <View style={styles.foodQuantity}>
                          <Text style={styles.quantityText}>{alimento.quantity_available} unidades</Text>
                        </View>
                        <Text style={styles.foodDescription}>{alimento.description}</Text>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.viewAllButton}
                      onPress={() => navigation.navigate("FoodList", { id })}
                    >
                      <Text style={styles.viewAllText}>Ver todos</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.billingButton} onPress={() => navigation.navigate("Billing", { id })}>
          <Text style={styles.billingButtonText}>FACTURACIÓN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => navigation.navigate("EventDeleted", { id })}>
          <Text style={styles.deleteButtonText}>ELIMINAR EVENTO</Text>
        </TouchableOpacity>
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
  imageContainer: {
    height: 192,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.indigo[100],
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: colors.indigo[500],
  },
  backIcon: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 8,
  },
  statusButton: {
    position: "absolute",
    bottom: -20,
    left: "50%",
    transform: [{ translateX: -60 }],
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 2,
  },
  statusText: {
    color: colors.indigo[500],
    fontWeight: "500",
  },
  statusIcon: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  category: {
    color: colors.gray[500],
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: colors.blue[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTitle: {
    fontWeight: "500",
  },
  infoSubtitle: {
    color: colors.gray[500],
    fontSize: 14,
  },
  editButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.indigo[500],
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 8,
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    color: colors.indigo[500],
    fontWeight: "500",
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionText: {
    color: colors.gray[700],
  },
  readMoreText: {
    color: colors.indigo[500],
    marginTop: 4,
  },
  tabsSection: {
    marginBottom: 100, // Space for action buttons
  },
  tabsHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.indigo[500],
  },
  tabButtonText: {
    color: colors.gray[500],
  },
  activeTabButtonText: {
    color: colors.indigo[500],
    fontWeight: "500",
  },
  tabContent: {
    paddingTop: 16,
  },
  loadingText: {
    textAlign: "center",
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    padding: 16,
    color: colors.gray[500],
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.indigo[500],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  statDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.indigo[500],
  },
  emptyStatDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[300],
    marginRight: 8,
  },
  statLabel: {
    fontWeight: "500",
  },
  statValue: {
    color: colors.indigo[500],
    fontWeight: "500",
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
  participantAvatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    //backgroundColor: colors.orange[500],
    overflow: "hidden",
    marginRight: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  participantName: {
    fontWeight: "500",
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
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
  viewAllButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  viewAllText: {
    color: colors.indigo[500],
  },
  addButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.indigo[500],
    justifyContent: "center",
    alignItems: "center",
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 4,
    zIndex: 1,
  },
  resourceItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingBottom: 16,
    marginBottom: 16,
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  resourceName: {
    fontWeight: "500",
  },
  resourcePrice: {
    color: colors.indigo[500],
    fontWeight: "500",
  },
  resourceQuantity: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  quantityDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[400],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  quantityDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[400],
  },
  quantityText: {
    color: colors.gray[500],
    fontSize: 14,
  },
  resourceDescription: {
    color: colors.gray[500],
    fontSize: 14,
  },
  foodItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingBottom: 16,
    marginBottom: 16,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  foodName: {
    fontWeight: "500",
  },
  foodPrice: {
    color: colors.indigo[500],
    fontWeight: "500",
  },
  foodQuantity: {
    marginBottom: 4,
  },
  foodDescription: {
    color: colors.gray[500],
    fontSize: 14,
  },
  actionButtons: {
    position: "absolute",
    bottom: 60, // Space for bottom tab bar
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  billingButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  billingButtonText: {
    color: "white",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: colors.red[500],
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.red[700],
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.indigo[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: "white",
  },
})

