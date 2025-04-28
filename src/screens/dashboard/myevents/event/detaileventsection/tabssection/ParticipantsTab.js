import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../../../../styles/colors';
import AddButton from '../../../../../../components/AddButton';

const ParticipantsTab = ({ participants, loading, event_id, navigation, isGestor }) => {
  const handleAddPress = () => {
    navigation.navigate("SendInvitation", { id: event_id });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Cargando participantes...</Text>;
  }

  const pendingCount = participants.filter(p => p.status_name === "Pendiente").length;
  const confirmedCount = participants.filter(p => p.status_name === "Confirmado").length;
  const attendedCount = participants.filter(p => p.status_name === "Asistió").length;
  const canceledCount = participants.filter(p => p.status_name === "Cancelado").length;

  return (
    <>
 <View style={styles.container}>
      {/* Primera fila */}
      <View style={styles.row}>
       
        <StatItem 
          label="Confirmados" 
          value={confirmedCount} 
          isConfirmed={true}
          icon="check-circle" 
        />
         <StatItem 
          label="Pendientes" 
          value={pendingCount} 
          isConfirmed={true}
          icon="clock" 
        />
      </View>

      {/* Segunda fila */}
      <View style={styles.row}>
        <StatItem 
          label="Asistió" 
          value={attendedCount} 
          isConfirmed={false}
          icon="user-check" 
        />
        <StatItem 
          label="Cancelado" 
          value={canceledCount} 
          isConfirmed={false}
          icon="x-circle" 
        />
      </View>
    </View>

      {/* Botón de agregar 
    {isGestor && <AddButton onPress={handleAddPress} />}*/}
      {/* Participantes o mensaje vacío */}
      {participants.length > 0 ? (
        participants.slice(0, 3).map(participant => (
          <ParticipantItem 
            key={participant.id} 
            participant={participant} 
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay participantes registrados</Text>
        </View>
      )}

      {/* Siempre muestra Ver Todos */}
      <TouchableOpacity 
        style={styles.viewAllButton}
        onPress={() => navigation.navigate("ParticipantList", { id: event_id })}
      >
        <Text style={styles.viewAllText}>Ver todos</Text>
      </TouchableOpacity>
    </>
  );
};

// Componentes internos específicos para participantes
const StatItem = ({ label, value, isConfirmed = false, icon }) => (
  <View style={styles.statItem}>
    <Icon name={icon} size={24} color={isConfirmed ? colors.indigo[500] : colors.gray[500]} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, isConfirmed ? styles.confirmedValue : styles.invitedValue]}>{value}</Text>
  </View>
);

const ParticipantItem = ({ participant }) => {
  const isConfirmed = participant.participant_status_id === 2;
  return (
    <View style={styles.participantContainer}>
      <View style={styles.participantInfo}>
        <Icon name="user" size={40} color="#B0B0B0" />
        <View style={styles.participantText}>
          <Text style={styles.participantName}>
            {participant.user_name || "Usuario"} {participant.user_last_name}
            </Text>
             <Text style={styles.participantEmail}>{participant.email || "Sin correo"}</Text>
        </View>
        
      </View>
      
      <View style={styles.participantActions}>
        <View style={[styles.statusTag, isConfirmed ? styles.confirmedTag : styles.invitedTag]}>
         <Text style={[styles.statusTagText,participant.participant_status_id === 2 ? styles.confirmedTagText : styles.invitedTagText,]}>
          {participant.status_name}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.gray[500],
    marginTop: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.gray[500],
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
    // Cambiar statsRow para que sea columna
    statsRow: {
        flexDirection: 'column',
        gap: 16, // más pequeño y ordenado
    },
  
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    color: colors.gray[600],
    fontSize: 14,
  },
  statValue: {
    fontWeight: '600',
    fontSize: 14,
  },
  confirmedValue: {
    color: colors.indigo[500],
  },
  invitedValue: {
    color: colors.gray[500],
  },
  participantContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    paddingVertical: 12,
    marginBottom: 12,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  participantText: {
    flex: 1,
  },
  participantName: {
    fontWeight: '500',
    color: colors.gray[800],
    fontSize: 16,
  },
  participantActions: {
   
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confirmedTag: {
    backgroundColor: colors.indigo[500],
  },
  invitedTag: {
    backgroundColor: colors.gray[200],
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  confirmedTagText: {
    color: colors.white,
  },
  invitedTagText: {
    color: colors.gray[600],
  },
  viewAllButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    marginTop: 8, 
  },  
  viewAllText: {
    color: colors.indigo[500],
    fontWeight: '500',
  },
  container: {
    flexDirection: 'column', 
    gap: 12, 
    marginBottom: 26,
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 1, 
  },
});

export default ParticipantsTab;