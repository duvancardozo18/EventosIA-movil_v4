import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../../../styles/colors';
import ImageBanner from '../../../../../../assets/banner_event.jpg'; // Cambia la ruta según tu estructura de carpetas

const EventHeader = ({ 
  eventData,
  formatDateRange,
  formatTimeRange 
}) => {
  // Componente reutilizable para filas de detalle
  const DetailRow = ({ icon, mainText, secondaryText }) => (
    <View style={styles.iconDetailContainer}>
      <View style={styles.iconBackground}>
        <Icon name={icon} size={20} color={colors.indigo[500]} />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailMainText}>{mainText || "..."}</Text>
        {secondaryText && <Text style={styles.detailSecondaryText}>{secondaryText}</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.header}>
      <Image
        source={eventData?.image_url?.[0] ? { uri: eventData.image_url[0] } : ImageBanner}
        style={styles.eventImage}
      />

      {/* Badge superpuesto */}
      <View style={styles.badgeOverlay}>
        <View style={styles.plannedBadge}>
          <Text style={styles.badgeText}>{eventData?.state || "Planeado"}</Text>
          <Icon name="edit-2" size={20} color={colors.indigo[500]} />
        </View>
      </View>

      {/* Contenido del header */}
      <View style={styles.headerContent}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.eventTitle}>{eventData?.event_name || "..."}</Text>
          <Text style={styles.eventSubtitle}>{eventData?.category_name || "..."}</Text>
        
          {/* Fila de fecha y hora */}
          <DetailRow 
            icon="calendar" 
            mainText={formatDateRange()} 
            secondaryText={formatTimeRange()} 
          />
          
          {/* Fila de ubicación */}
          <DetailRow 
            icon="map-pin" 
            mainText={eventData?.location_name} 
            secondaryText={eventData?.location_address} 
          />
          
          {/* Fila de modalidad */}
          <DetailRow 
            icon="monitor" 
            mainText={`Modalidad - ${eventData?.event_type}`}
            secondaryText={eventData?.video_conference_link ? "Enlace disponible" : "Sin enlace virtual"}
          />
          
          {/* Participantes */}
          <DetailRow 
            icon="users" 
            mainText={`Max. Participantes: ${eventData?.max_participants}`}
          />
        </View>
      </View>
    </View>
  );
};

// Estilos (los mismos que ya tenías)
const styles = StyleSheet.create({
  header: {
    position: 'relative',
    marginBottom: 16,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  badgeOverlay: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  plannedBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
    paddingRight: 16,
  },
  badgeText: {
    color: colors.indigo[500],
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  headerContent: {
    marginTop: 10,
  },
  headerTextContainer: {
    padding: 16,
    paddingTop: 30,
  },
  iconDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.indigo[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailMainText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 2,
  },
  detailSecondaryText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  eventSubtitle: {
    fontSize: 20,
    color: colors.gray[500],
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 40,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 0,
    color: colors.gray[800],
    lineHeight: 40,
  },
});

export default EventHeader;