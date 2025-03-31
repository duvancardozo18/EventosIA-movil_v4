"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { colors } from "../styles/colors"
import { useEvent } from "../contexts/EventContext"

const BillingScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId } = route.params
  const { getEvent, getEventBilling, removeEventClient } = useEvent()

  const [event, setEvent] = useState(null)
  const [billing, setBilling] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEventData()
  }, [eventId])

  const loadEventData = async () => {
    try {
      const eventData = await getEvent(eventId)
      setEvent(eventData)

      const billingData = await getEventBilling(eventId)
      setBilling(billingData)
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información de facturación")
    } finally {
      setLoading(false)
    }
  }

  const handleLinkClient = () => {
    navigation.navigate("LinkClient", { eventId })
  }

  const handleRemoveClient = async () => {
    Alert.alert("Eliminar cliente", "¿Estás seguro de que deseas eliminar el cliente asociado a este evento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true)
            await removeEventClient(eventId)
            navigation.navigate("ClientDeleted", { eventId })
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el cliente")
            setLoading(false)
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Facturación</Text>
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{event?.name}</Text>
        <Text style={styles.eventDate}>
          {new Date(event?.date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      {!billing?.client ? (
        <View style={styles.noClientContainer}>
          <Feather name="user-x" size={60} color={colors.textSecondary} />
          <Text style={styles.noClientText}>No hay cliente asociado</Text>
          <Text style={styles.noClientSubtext}>Enlaza un cliente para generar cotizaciones y facturas</Text>
          <TouchableOpacity style={styles.linkButton} onPress={handleLinkClient}>
            <Text style={styles.linkButtonText}>Enlazar cliente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.billingContainer}>
          <View style={styles.clientSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Información del cliente</Text>
              <TouchableOpacity onPress={handleLinkClient}>
                <Feather name="edit-2" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{billing.client.name}</Text>
              <Text style={styles.clientDetail}>
                <Feather name="mail" size={16} color={colors.textSecondary} /> {billing.client.email}
              </Text>
              <Text style={styles.clientDetail}>
                <Feather name="phone" size={16} color={colors.textSecondary} /> {billing.client.phone}
              </Text>
              {billing.client.company && (
                <Text style={styles.clientDetail}>
                  <Feather name="briefcase" size={16} color={colors.textSecondary} /> {billing.client.company}
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveClient}>
              <Feather name="trash-2" size={16} color={colors.danger} />
              <Text style={styles.removeButtonText}>Eliminar cliente</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quotesSection}>
            <Text style={styles.sectionTitle}>Cotizaciones</Text>

            {billing.quotes && billing.quotes.length > 0 ? (
              billing.quotes.map((quote, index) => (
                <View key={index} style={styles.quoteItem}>
                  <View style={styles.quoteHeader}>
                    <Text style={styles.quoteTitle}>Cotización #{quote.id}</Text>
                    <Text style={styles.quoteDate}>{new Date(quote.date).toLocaleDateString("es-ES")}</Text>
                  </View>
                  <Text style={styles.quoteAmount}>${quote.amount.toFixed(2)}</Text>
                  <View style={styles.quoteActions}>
                    <TouchableOpacity style={styles.quoteButton}>
                      <Feather name="eye" size={16} color={colors.primary} />
                      <Text style={styles.quoteButtonText}>Ver</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quoteButton}>
                      <Feather name="send" size={16} color={colors.primary} />
                      <Text style={styles.quoteButtonText}>Enviar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No hay cotizaciones</Text>
                <TouchableOpacity style={styles.createButton}>
                  <Text style={styles.createButtonText}>Crear cotización</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.invoicesSection}>
            <Text style={styles.sectionTitle}>Facturas</Text>

            {billing.invoices && billing.invoices.length > 0 ? (
              billing.invoices.map((invoice, index) => (
                <View key={index} style={styles.invoiceItem}>
                  <View style={styles.invoiceHeader}>
                    <Text style={styles.invoiceTitle}>Factura #{invoice.id}</Text>
                    <Text style={styles.invoiceDate}>{new Date(invoice.date).toLocaleDateString("es-ES")}</Text>
                  </View>
                  <Text style={styles.invoiceAmount}>${invoice.amount.toFixed(2)}</Text>
                  <View style={styles.invoiceStatus}>
                    <View
                      style={[
                        styles.statusBadge,
                        invoice.status === "paid"
                          ? styles.paidBadge
                          : invoice.status === "pending"
                            ? styles.pendingBadge
                            : styles.canceledBadge,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {invoice.status === "paid"
                          ? "Pagada"
                          : invoice.status === "pending"
                            ? "Pendiente"
                            : "Cancelada"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.invoiceActions}>
                    <TouchableOpacity style={styles.invoiceButton}>
                      <Feather name="eye" size={16} color={colors.primary} />
                      <Text style={styles.invoiceButtonText}>Ver</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.invoiceButton}>
                      <Feather name="send" size={16} color={colors.primary} />
                      <Text style={styles.invoiceButtonText}>Enviar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No hay facturas</Text>
                <TouchableOpacity style={styles.createButton}>
                  <Text style={styles.createButtonText}>Crear factura</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

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
    padding: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  linkButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  billingContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  clientSection: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  clientInfo: {
    marginBottom: 16,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  clientDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  removeButtonText: {
    color: colors.danger,
    marginLeft: 8,
    fontSize: 14,
  },
  quotesSection: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  quoteItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  quoteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  quoteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  quoteDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quoteAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  quoteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  quoteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  quoteButtonText: {
    color: colors.primary,
    marginLeft: 4,
    fontSize: 14,
  },
  invoicesSection: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
  },
  invoiceItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  invoiceDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  invoiceStatus: {
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  paidBadge: {
    backgroundColor: colors.successLight,
  },
  pendingBadge: {
    backgroundColor: colors.warningLight,
  },
  canceledBadge: {
    backgroundColor: colors.dangerLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  invoiceActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  invoiceButtonText: {
    color: colors.primary,
    marginLeft: 4,
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
})

export default BillingScreen

