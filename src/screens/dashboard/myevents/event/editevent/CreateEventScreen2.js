"use client"

import { View, StyleSheet, ScrollView, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import DateTimePicker from "@react-native-community/datetimepicker"

// Components
import EventStepsIndicator from "./EventStepIndicator"
import EventFormHeader from "./EventFormHeader"
import EventFormNavigation from "./EventFormNavigation"
import BasicInfoStep from "./steps/BasicInfoStep"
import EventDetailsStep from "./steps/EventDetailStep"
import LocationStep from "./steps/LocationStep"

// Hooks
import { useEventForm } from "./EventFormProvider"
import { colors } from "../../../../../styles/colors"

export default function CreateEventScreen2() {
  const navigation = useNavigation()
  const {
    formData,
    currentStep,
    loading,
    error,
    imagePreview,
    showStartDate,
    showStartTime,
    showEndDate,
    showEndTime,
    setShowStartDate,
    setShowStartTime,
    setShowEndDate,
    setShowEndTime,
    handleChange,
    handleDateChange,
    handleImageSelected,
    nextStep,
    prevStep,
    handleSubmit
  } = useEventForm(navigation)

  // Render the appropriate step component based on currentStep
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            handleChange={handleChange}
            imagePreview={imagePreview}
            onImageSelected={handleImageSelected}
          />
        )
      case 2:
        return (
          <EventDetailsStep
            formData={formData}
            handleChange={handleChange}
            setShowStartDate={setShowStartDate}
            setShowStartTime={setShowStartTime}
            setShowEndDate={setShowEndDate}
            setShowEndTime={setShowEndTime}
          />
        )
      case 3:
        return (
          <LocationStep
            formData={formData}
            handleChange={handleChange}
          />
        )
      default:
        return <Text>Paso no válido</Text>
    }
  }

  return (
    <View style={styles.container}>
      <EventFormHeader 
        title="Crear evento" 
        onBack={() => navigation.navigate("Dashboard")} 
      />

      <EventStepsIndicator 
        totalSteps={3} 
        currentStep={currentStep} 
      />

      <ScrollView style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {renderCurrentStep()}
        </View>
      </ScrollView>

      {/* Date and time pickers */}
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

      <EventFormNavigation 
        currentStep={currentStep}
        totalSteps={3}
        onPrevious={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  form: {
    marginBottom: 24,
  }
});