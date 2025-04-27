"use client"

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useEvent } from "../../../../contexts/EventContext"
import BottomTabBar from "../../../../components/BottomTabBar"
import { colors } from "../../../../styles/colors"

export default function CompleteEventScreen() {
  const navigation = useNavigation();
  // const route = useRoute();
  
  console.log(route.params);  // Depura el contenido de los parámetros
  // const { event } = route.params || {};  // Asegúrate de que `event` exista  
  
  // Usar el contexto del evento
  const { 
    registerParticipant,
    assignResourceToEvent,
    assignFoodToEvent,
    loading,
    error
  } = useEvent();
  
  // Estado para el evento - inicializado con los datos recibidos
  // const [eventData, setEventData] = useState({
  //   name: event?.name || "",
  //   description: event?.description || "",
  //   date: event?.date || "",
  //   location: event?.location?.address || "", // Asumiendo que location es un objeto con address
  //   image_url: event?.image_url || null,
  // });
  
  const [activeTab, setActiveTab] = useState("Participantes");
  const [participants, setParticipants] = useState([]);
  const [resources, setResources] = useState([]);
  const [foods, setFoods] = useState([]);
  
  // Estados para los modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  
  // Estado para el formulario activo
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    email: "",
    phone: "",
    status: "invited"
  });

  // Efecto para cargar los datos iniciales del evento
  useEffect(() => {
    if (event) {
      // Si hay participantes, recursos o alimentos en el evento, cargarlos
      if (event.participants) setParticipants(event.participants);
      if (event.resources) setResources(event.resources);
      if (event.foods) setFoods(event.foods);
    }
  }, [event]);

  const openCreateModal = (formType) => {
    setCurrentForm(formType);
    setFormData({
      name: "",
      description: "",
      quantity: "",
      price: "",
      email: "",
      phone: "",
      status: "invited"
    });
    setShowCreateModal(true);
  };

  const handleCreateItem = async () => {
    try {
      if (currentForm === "Participantes") {
        const newParticipant = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          event_id: event.id_event // Asignar el ID del evento recibido
        };
        
        const createdParticipant = await registerParticipant(newParticipant);
        
        if (createdParticipant) {
          setParticipants([...participants, createdParticipant]);
        }
        
      } else if (currentForm === "Recursos") {
        const newResource = {
          name: formData.name,
          description: formData.description,
          quantity: formData.quantity,
          price: formData.price,
          event_id: event.id_event // Asignar el ID del evento recibido
        };
        
        const createdResource = await assignResourceToEvent(newResource);
        
        if (createdResource) {
          setResources([...resources, createdResource]);
        }
        
      } else if (currentForm === "Alimentos") {
        const newFood = {
          name: formData.name,
          description: formData.description,
          quantity: formData.quantity,
          price: formData.price,
          event_id: event.id_event // Asignar el ID del evento recibido
        };
        
        const createdFood = await assignFoodToEvent(newFood);
        
        if (createdFood) {
          setFoods([...foods, createdFood]);
        }
      }
      
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error al crear item:", err);
      Alert.alert("Error", "No se pudo guardar el elemento");
    }
  };

  const handleSaveEvent = async () => {
    try {
      Alert.alert("Éxito", "Todos los detalles del evento han sido guardados");
      navigation.navigate("EventDetail", { eventId: event.id_event });
    } catch (error) {
      console.error("Error al guardar detalles del evento:", error);
      Alert.alert("Error", "No se pudieron guardar todos los detalles del evento");
    }
  };

  // ... (resto del código de renderFormFields y el JSX permanece igual)
  const renderFormFields = () => {
    switch(currentForm) {
      case "Participantes":
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              keyboardType="phone-pad"
            />
            <View style={styles.radioGroup}>
              <TouchableOpacity 
                style={[styles.radioButton, formData.status === "invited" && styles.radioButtonSelected]}
                onPress={() => setFormData({...formData, status: "invited"})}
              >
                <Text>Invitado</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.radioButton, formData.status === "confirmed" && styles.radioButtonSelected]}
                onPress={() => setFormData({...formData, status: "confirmed"})}
              >
                <Text>Confirmado</Text>
              </TouchableOpacity>
            </View>
          </>
        )
      case "Recursos":
      case "Alimentos":
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder={`Nombre del ${currentForm?.toLowerCase() || ""}`}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descripción"
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              multiline
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10 }]}
                placeholder="Cantidad"
                value={formData.quantity}
                onChangeText={(text) => setFormData({...formData, quantity: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Precio"
                value={formData.price}
                onChangeText={(text) => setFormData({...formData, price: text})}
                keyboardType="numeric"
              />
            </View>
          </>
        )
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      {/* Header con imagen del evento */}
      <View style={styles.header}>
        {eventData.image_url ? (
          <Image source={{ uri: eventData.image_url }} style={styles.eventImage} />
        ) : (
          <TouchableOpacity 
            style={styles.noImage} 
            onPress={() => console.log("Seleccionar imagen")}
          >
            <Icon name="image" size={40} color={colors.gray[400]} />
            <Text style={styles.noImageText}>Toca para añadir imagen</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Información básica del evento */}
        <TextInput 
          style={styles.eventTitleInput}
          placeholder="Nombre del evento"
          value={eventData.name}
          onChangeText={(text) => setEventData({...eventData, name: text})}
        />
        
        <TextInput 
          style={styles.eventDescription}
          placeholder="Descripción del evento"
          value={eventData.description}
          onChangeText={(text) => setEventData({...eventData, description: text})}
          multiline
        />

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color={colors.gray[500]} />
            <TextInput 
              style={styles.detailInput}
              placeholder="Fecha del evento"
              value={eventData.date}
              onChangeText={(text) => setEventData({...eventData, date: text})}
            />
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="map-pin" size={20} color={colors.gray[500]} />
            <TextInput 
              style={styles.detailInput}
              placeholder="Ubicación"
              value={eventData.location}
              onChangeText={(text) => setEventData({...eventData, location: text})}
            />
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "Participantes" && styles.activeTab]}
            onPress={() => setActiveTab("Participantes")}
          >
            <Text style={[styles.tabText, activeTab === "Participantes" && styles.activeTabText]}>Participantes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "Alimentos" && styles.activeTab]}
            onPress={() => setActiveTab("Alimentos")}
          >
            <Text style={[styles.tabText, activeTab === "Alimentos" && styles.activeTabText]}>Alimentos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "Recursos" && styles.activeTab]}
            onPress={() => setActiveTab("Recursos")}
          >
            <Text style={[styles.tabText, activeTab === "Recursos" && styles.activeTabText]}>Recursos</Text>
          </TouchableOpacity>
        </View>

        {/* Contenido de cada tab */}
        <View style={styles.tabContent}>
          {activeTab === "Participantes" && (
            <>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openCreateModal("Participantes")}
              >
                <Icon name="plus" size={20} color="white" />
                <Text style={styles.addButtonText}>Agregar Participante</Text>
              </TouchableOpacity>
              
              {participants.length === 0 ? (
                <Text style={styles.emptyMessage}>No hay participantes aún</Text>
              ) : (
                <View>
                  {participants.map((p) => (
                    <View key={p.id} style={styles.listItem}>
                      <View>
                        <Text style={styles.itemName}>{p.name}</Text>
                        <Text style={styles.itemEmail}>{p.email}</Text>
                      </View>
                      <Text style={[
                        styles.statusText, 
                        p.status === "confirmed" ? styles.statusConfirmed : styles.statusInvited
                      ]}>
                        {p.status === "confirmed" ? "Confirmado" : "Invitado"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === "Alimentos" && (
            <>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openCreateModal("Alimentos")}
              >
                <Icon name="plus" size={20} color="white" />
                <Text style={styles.addButtonText}>Agregar Alimento</Text>
              </TouchableOpacity>
              
              {foods.length === 0 ? (
                <Text style={styles.emptyMessage}>No hay alimentos aún</Text>
              ) : (
                <View>
                  {foods.map((f) => (
                    <View key={f.id} style={styles.listItem}>
                      <View>
                        <Text style={styles.itemName}>{f.name}</Text>
                        <Text style={styles.itemDescription}>{f.description}</Text>
                      </View>
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemQuantity}>{f.quantity} unidades</Text>
                        <Text style={styles.itemPrice}>${f.price}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === "Recursos" && (
            <>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openCreateModal("Recursos")}
              >
                <Icon name="plus" size={20} color="white" />
                <Text style={styles.addButtonText}>Agregar Recurso</Text>
              </TouchableOpacity>
              
              {resources.length === 0 ? (
                <Text style={styles.emptyMessage}>No hay recursos aún</Text>
              ) : (
                <View>
                  {resources.map((r) => (
                    <View key={r.id} style={styles.listItem}>
                      <View>
                        <Text style={styles.itemName}>{r.name}</Text>
                        <Text style={styles.itemDescription}>{r.description}</Text>
                      </View>
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemQuantity}>{r.quantity} unidades</Text>
                        <Text style={styles.itemPrice}>${r.price}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Botón para guardar todo el evento */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveEvent}
        >
          <Text style={styles.saveButtonText}>Crear Evento</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para crear items */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar {currentForm}</Text>
            
            {renderFormFields()}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateItem}
              >
                <Text style={styles.confirmButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <BottomTabBar activeTab="events" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[200],
  },
  noImageText: {
    color: colors.gray[500],
    marginTop: 8,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  eventTitleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  eventDescription: {
    fontSize: 16,
    color: colors.gray[700],
    marginBottom: 16,
    padding: 4,
    minHeight: 60,
  },
  eventDetails: {
    marginBottom: 24,
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailInput: {
    flex: 1,
    marginLeft: 8,
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.indigo[500],
  },
  tabText: {
    color: colors.gray[500],
  },
  activeTabText: {
    color: colors.indigo[500],
    fontWeight: 'bold',
  },
  tabContent: {
    minHeight: 200,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.indigo[500],
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    color: colors.gray[500],
    marginTop: 32,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemEmail: {
    color: colors.gray[500],
    fontSize: 12,
  },
  itemDescription: {
    color: colors.gray[600],
    fontSize: 12,
    marginTop: 2,
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    color: colors.gray[700],
  },
  itemPrice: {
    color: colors.indigo[600],
    fontWeight: 'bold',
    marginTop: 2,
  },
  statusText: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusConfirmed: {
    backgroundColor: colors.green[100],
    color: colors.green[700],
  },
  statusInvited: {
    backgroundColor: colors.yellow[100],
    color: colors.yellow[700],
  },
  saveButton: {
    backgroundColor: colors.indigo[600],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.indigo[500],
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  radioButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  radioButtonSelected: {
    backgroundColor: colors.indigo[100],
    borderColor: colors.indigo[500],
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray[200],
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.gray[700],
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: colors.indigo[500],
    marginLeft: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})