// components/steps/EventDetailsStep.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from '../../../../../../styles/colors';
import { useEventForm } from '../EventFormProvider';

const EventDetailsStep = () => {
  const { 
    formData, 
    handleChange, 
    handleDateChange,
    showStartDate,
    showStartTime,
    showEndDate,
    showEndTime,
    setShowStartDate,
    setShowStartTime,
    setShowEndDate,
    setShowEndTime
  } = useEventForm();

  return (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Tipo de evento *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.event_modality}
            onValueChange={(value) => handleChange("event_modality", value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar tipo de evento" value="" />
            <Picker.Item label="Virtual" value="virtual" />
            <Picker.Item label="Presencial" value="presencial" />
            <Picker.Item label="Híbrido" value="hibrido" />
          </Picker>
        </View>
      </View>

      {(formData.event_modality === 'virtual' || formData.event_modality === 'hibrido') && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Enlace del meet</Text>
          <TextInput
            style={styles.input}
            value={formData.video_conference_link}
            onChangeText={(value) => handleChange("video_conference_link", value)}
            placeholder="Enlace de videoconferencia"
          />
        </View>
      )}

      <View style={styles.dateTimeRow}>
        <Text style={styles.dateTimeLabel}>Inicio</Text>
        <TouchableOpacity 
          style={styles.dateInput} 
          onPress={() => setShowStartDate(true)}
        >
          <Text>
            {formData.start_time 
              ? formData.start_time.toLocaleDateString() 
              : "Seleccionar fecha"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.timeInput} 
          onPress={() => setShowStartTime(true)}
        >
          <Text>
            {formData.start_time 
              ? formData.start_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
              : "Seleccionar hora"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateTimeRow}>
        <Text style={styles.dateTimeLabel}>Fin</Text>
        <TouchableOpacity 
          style={styles.dateInput} 
          onPress={() => setShowEndDate(true)}
        >
          <Text>
            {formData.end_time 
              ? formData.end_time.toLocaleDateString() 
              : "Seleccionar fecha"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.timeInput} 
          onPress={() => setShowEndTime(true)}
        >
          <Text>
            {formData.end_time 
              ? formData.end_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
              : "Seleccionar hora"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DateTimePicker components */}
      {showStartDate && (
        <DateTimePicker
          value={formData.start_time || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "startDate")}
        />
      )}
      {showStartTime && (
        <DateTimePicker
          value={formData.start_time || new Date()}
          mode="time"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "startTime")}
        />
      )}
      {showEndDate && (
        <DateTimePicker
          value={formData.end_time || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "endDate")}
        />
      )}
      {showEndTime && (
        <DateTimePicker
          value={formData.end_time || new Date()}
          mode="time"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "endTime")}
        />
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Número máximo de participantes</Text>
        <TextInput
          style={styles.input}
          value={formData.max_participants}
          onChangeText={(value) => handleChange("max_participants", value)}
          placeholder="Número máximo de participantes"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Precio del evento (NO incluye: recursos, alimentacion, etc)</Text>
        <TextInput
          style={styles.input}
          value={formData.price_event}
          onChangeText={(value) => handleChange("price_event", value)}
          placeholder="Precio del evento"
          keyboardType="numeric"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateTimeLabel: {
    width: 50,
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
  },
  dateInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default EventDetailsStep;