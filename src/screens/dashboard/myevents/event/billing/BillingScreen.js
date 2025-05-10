import React, { useState, useEffect, useCallback  } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../../styles/colors";
import { useEvent } from "../../../../../contexts/EventContext";
import { billingService } from "../../../../../services/api";
import BottomTabBar from "../../../../../components/BottomTabBar";
import { useAuth } from "../../../../../contexts/AuthContext";






const BillingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { FetchEventPrice } = useEvent();
  const [billing, setBilling] = useState(null);




  const [event, setEvent, ] = useState(null);
  const [loading, setLoading] = useState(true);
  const { eventId } = route.params || {};
  const { user } = useAuth();
  const isFocused = useIsFocused();


 

  const formatCurrency = (value) =>
    Number(value).toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const fetchData = async () => {
    try {
      const response = await FetchEventPrice(eventId);
      if (response) setEvent(response);
  
      const billingResponse = await billingService.getBillingByEventId(eventId);
      if (billingResponse?.data?.billings?.length > 0) {
        setBilling(billingResponse.data.billings[0]);
      } else {
        setBilling(null);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setBilling(null);
      } else {
        console.error("Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  //Recargar al mostrar vista
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchData();
        setLoading(false);
      };
      
      if (eventId) {
        loadData();
      }
    }, [eventId])
  );
      
    
    

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Facturación</Text>
      </View>

    <ScrollView style={styles.content}>

      <View style={styles.eventInfo}>
        <Text style={styles.sectionTitle}>Información del evento</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Evento</Text>
          <Text style={styles.infoValue}>{event.event_name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dirección</Text>
          <Text style={styles.infoValue}>
            {event.location_name}, {event.location_address}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Modalidad</Text>
          <Text style={styles.infoValue}>{event.event_type}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Max. Participantes</Text>
          <Text style={styles.infoValue}>{event.max_participants}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Inicio</Text>
          <Text style={styles.infoValue}>
            {new Date(event.start_time).toLocaleString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Finalización</Text>
          <Text style={styles.infoValue}>
            {new Date(event.end_time).toLocaleString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Costos</Text>

        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Logística</Text>
          <Text style={styles.costValue}>${formatCurrency(event.logistics_price)}</Text>
        </View>

        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Alquiler del Sitio</Text>
          <Text style={styles.costValue}>${formatCurrency(event.location_rent)}</Text>
        </View>

        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Alimentación</Text>
          <Text style={styles.costValue}>${formatCurrency(event.food_total)}</Text>
        </View>

        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Recursos</Text>
          <Text style={styles.costValue}>${formatCurrency(event.resources_total)}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>${formatCurrency(event.total_value)}</Text>
        </View>
      </View>
      {billing ? (
        <View style={styles.noClientContainer}>
          <Feather name="user-check" size={60} color={colors.primary} />
          <Text style={styles.noClientText}>Cliente asociado</Text>
          <Text style={styles.noClientSubtext}>
            {billing.user_name} {billing.user_last_name} - {billing.user_email}
          </Text>
          
          {/* Nueva sección para estado y fecha */}
          <View style={styles.billingInfoContainer}>
            <View style={styles.billingInfoRow}>
              <Text style={styles.billingInfoLabel}>Estado:</Text>
              <Text style={[
                styles.billingInfoValue,
                billing.state === 'Enviado' && styles.stateSent,
                billing.state === 'Pagado' && styles.statePaid,
                billing.state === 'Pendiente' && styles.statePending
              ]}>
                {billing.state}
              </Text>
            </View>
            
            <View style={styles.billingInfoRow}>
              <Text style={styles.billingInfoLabel}>Fecha creación:</Text>
              <Text style={styles.billingInfoValue}>
                {new Date(billing.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              navigation.navigate("BillingPayment", { eventId });
            }}
          >
            <Text style={styles.linkButtonText}>PAGAR</Text>
          </TouchableOpacity>
          

           {(user?.role === "SuperAdmin" || user?.role === "EventManager") && (
            <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                "Eliminar Cliente",
                "¿Estás seguro de que deseas eliminar el cliente?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                      setLoading(true);
                      try {
                        await billingService.deleteBilling(billing.id_billing);
                        setBilling(null);
                        Alert.alert("Eliminado", "El cliente ha sido eliminado exitosamente.");
                      } catch (error) {
                        console.error("Error al eliminar:", error);
                        Alert.alert("Error", "No se pudo eliminar la factura.");
                      } finally {
                        setLoading(false);
                      }
                    },
                  },
                ]
              );
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              
              <Text style={styles.deleteButtonText}>ELIMINAR CLIENTE</Text>
            )}
          </TouchableOpacity>    
        )}




        </View>
        ) : (
          <View style={styles.noClientContainer}>
            <Feather name="user-x" size={60} color={colors.textSecondary} />
            <Text style={styles.noClientText}>No hay cliente asociado</Text>
            <Text style={styles.noClientSubtext}>
              Enlaza un cliente para generar cotizaciones y facturas
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("LinkClient", { eventId: eventId })}
            >
              <Text style={styles.linkButtonText}>Enlazar Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.linkButton, { opacity: 0.5 }]}
              disabled
            >
              <Text style={styles.linkButtonText}>PAGAR</Text>
            </TouchableOpacity>
          </View>
        )}
    </ScrollView>


     <BottomTabBar activeTab="home" />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  eventInfo: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 18,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontWeight: "500",
  },
  infoValue: {
    color: colors.text,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  costLabel: {
    fontWeight: "500",
    color: colors.text,
  },
  costValue: {
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  noClientContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  noClientText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noClientSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  linkButton: {
    backgroundColor: colors.indigo[500],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10
  },
  linkButtonText: {
    color: colors.white[100],
    fontSize: 16,
    fontWeight: "600",
  },
  billingInfoContainer: {
    width: '100%',
    marginVertical: 16,
    padding: 12,
    backgroundColor: colors.grayLight,
    borderRadius: 8,
  },
  billingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billingInfoLabel: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  billingInfoValue: {
    color: colors.text,
    fontWeight: '600',
  },
  stateSent: {
    color: colors.warning,
  },
  statePaid: {
    color: colors.success,
  },
  statePending: {
    color: colors.error,
  },
  deleteButton: {
    backgroundColor: colors.red[500],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteButtonText: {
    color: colors.white[100],
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  
});

export default BillingScreen;
