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

  const confirmedCount = participants.filter(p => p.status_name === "Confirmado").length;
  const invitedCount = participants.filter(p => p.status_name === "Invitado").length;

  return (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatItem 
            label="Confirmados" 
            value={confirmedCount} 
            isConfirmed={true}
            icon="check-circle"
          />
          <StatItem 
            label="Invitados" 
            value={invitedCount} 
            isConfirmed={false}
            icon="message-circle"
          />
        </View>
        {isGestor && <AddButton onPress={handleAddPress} />}
      </View>

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
        <Image source={{ uri: participant.avatar || "https://via.placeholder.com/48" }} style={styles.avatarImage} />
        <View style={styles.participantText}>
          <Text style={styles.participantName}>{participant.user_name || "Usuario"}</Text>
        </View>
      </View>
      
      <View style={styles.participantActions}>
        <View style={[styles.statusTag, isConfirmed ? styles.confirmedTag : styles.invitedTag]}>
          <Text style={[styles.statusTagText, isConfirmed ? styles.confirmedTagText : styles.invitedTagText]}>
            {isConfirmed ? "Confirmado" : "Invitado"}
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    marginTop: 8, // un poquito de separación
  },  
  viewAllText: {
    color: colors.indigo[500],
    fontWeight: '500',
  },
});

export default ParticipantsTab;