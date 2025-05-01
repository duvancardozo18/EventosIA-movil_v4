import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { colors } from '../../../../../styles/colors.js'; // Importando colores
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios'; // Asegúrate de tener axios instalado

export default function PayBillingScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal'); // PayPal seleccionado por defecto
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [nequiNumber, setNequiNumber] = useState('');

  // Datos de ejemplo para la dirección y la factura
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params; // Obtener el eventId de los parámetros de la ruta

  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBillingData = async (id) => {
    try {
      setLoading(true);
      // Configuración de la URL base dependiendo de la plataforma
      const baseUrl = Platform.OS === 'android'
        ? 'http://10.0.2.2:7777'
        : 'http://localhost:7777';

      const response = await axios.get(`${baseUrl}/api/billing/${id}`);
      setBillingData(response.data);
    } catch (error) {
      console.error("Error al obtener datos de facturación:", error);
      Alert.alert("Error", "No se pudieron cargar los datos de facturación");
    } finally {
      setLoading(false);
    }
  };

  // Llamar a la función para obtener los datos de facturación cuando el componente se monta
  useEffect(() => {
    if (eventId) {
      fetchBillingData(eventId);
    } else {
      Alert.alert("Error", "No se recibió el ID del evento");
      navigation.goBack();
    }
  }, [eventId]);

  // Verificar si los datos de facturación están cargados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Si no hay datos de facturación
  if (!billingData) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron datos de facturación.</Text>
      </View>
    );
  }

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayBilling = () => {
    let isValid = true;

    if (selectedPaymentMethod === 'cards') {
      if (!validateCardNumber(cardNumber)) {
        isValid = false;
        alert('Número de tarjeta inválido');
      } else if (!validateExpiryDate(expiryDate)) {
        isValid = false;
        alert('Fecha de expiración inválida');
      } else if (!validateCVV(cvv)) {
        isValid = false;
        alert('CVV inválido');
      }
    } else if (selectedPaymentMethod === 'paypal') {
      if (!validatePaypalEmail(paypalEmail)) {
        isValid = false;
        alert('Correo de PayPal inválido');
      }
    } else if (selectedPaymentMethod === 'nequi') {
      if (!validateNequiNumber(nequiNumber)) {
        isValid = false;
        alert('Número de Nequi debe tener exactamente 10 dígitos');
      }
    }

    // Si todo es válido, navegar a la pantalla de pago
    if (isValid) {
      navigation.navigate('BillPaid');
    }
  };

  // Función para detectar el tipo de tarjeta
  const detectCardType = (number) => {
    const cardNum = number.replace(/\s/g, '');
    
    const visaRegex = /^4/;
    const mastercardRegex = /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/;
    
    if (visaRegex.test(cardNum)) {
      return 'visa';
    } else if (mastercardRegex.test(cardNum)) {
      return 'mastercard';dd
    } else if (cardNum.length > 0) {
      return 'unknown';
    }
    
    return null;
  };

  // Función para formatear el número de tarjeta con espacios cada 4 dígitos
  const formatCardNumber = (number) => {
    const cardNum = number.replace(/\s/g, '');
    const groups = cardNum.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cardNum;
  };

  // Manejar cambio en el número de tarjeta
  const handleCardNumberChange = (text) => {
    const cleaned = text.replace(/[^\d\s]/g, '');
    if (cleaned.replace(/\s/g, '').length <= 16) {
      const formatted = formatCardNumber(cleaned);
      setCardNumber(formatted);
      
      // Detectar tipo de tarjeta
      const type = detectCardType(cleaned);
      setCardType(type);
    }
  };

  // Formatear fecha de expiración automáticamente (MM/YY)
  const handleExpiryDateChange = (text) => {
    let cleaned = text.replace(/[^\d]/g, '');
    
    if (cleaned.length <= 4) {
      if (cleaned.length > 2) {
        cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      }
      setExpiryDate(cleaned);
    }
  };

  // Validar número de tarjeta (solo números, 16 dígitos)
  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    const regex = /^\d{16}$/; // 16 dígitos
    return regex.test(cleaned);
  };

  // Validar fecha de expiración (MM/YY)
  const validateExpiryDate = (expiry) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY
    return regex.test(expiry);
  };

  // Validar CVV (3 o 4 dígitos)
  const validateCVV = (cvv) => {
    const regex = /^\d{3,4}$/; // 3 o 4 dígitos
    return regex.test(cvv);
  };

  // Validar email de PayPal
  const validatePaypalEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Validar número de Nequi (exactamente 10 dígitos)
  const validateNequiNumber = (number) => {
    const regex = /^\d{10}$/; // Exactamente 10 dígitos
    return regex.test(number);
  };

  // Mostrar ícono del tipo de tarjeta identificado
  const renderCardTypeIcon = () => {
    if (!cardType) return null;
    
    if (cardType === 'visa') {
      return <Image source={require('../../../../../../assets/Visa_Logo.png')} style={styles.icon2}/>;
    } else if (cardType === 'mastercard') {
      return <Image source={require('../../../../../../assets/mastercard2.png')} style={styles.icon2}/>;
    } else if (cardType === 'unknown') {
      return <Feather name="help-circle" size={20} color="#999" />;
    }
    
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volver a la factura</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Datos personales</Text>
        <View style={styles.addressContainer}>
          {/* Mostrar nombre y correo del cliente */}
          <Text style={styles.addressText}>
            Nombre: {billingData.cliente?.nombre || "No disponible"}
          </Text>
          <Text style={styles.addressText}>
            Correo: {billingData.cliente?.correo || "No disponible"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Métodos de pago</Text>

        <TouchableOpacity 
          style={styles.paymentMethodRow} 
          onPress={() => handlePaymentMethodChange('cards')}>
          <View style={styles.paymentMethodInfo}>
            <Feather name="credit-card" size={22} color="#333" />
            <Text style={styles.paymentMethodText}>Tarjeta débito/crédito</Text>
          </View>
          <View style={[styles.radioButton, selectedPaymentMethod === 'cards' && styles.radioButtonSelected]}>
            {selectedPaymentMethod === 'cards' && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.paymentMethodRow} 
          onPress={() => handlePaymentMethodChange('paypal')}>
          <View style={styles.paymentMethodInfo}>
            <Image 
              source={require('../../../../../../assets/paypal.png')} 
              style={styles.icon} 
            />
            <Text style={styles.paymentMethodText}>PayPal</Text>
          </View>
          <View style={[styles.radioButton, selectedPaymentMethod === 'paypal' && styles.radioButtonSelected]}>
            {selectedPaymentMethod === 'paypal' && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.paymentMethodRow} 
          onPress={() => handlePaymentMethodChange('nequi')}>
          <View style={styles.paymentMethodInfo}>
            <Image 
                source={require('../../../../../../assets/nequi.png')}  
                style={styles.icon} 
            />
            <Text style={styles.paymentMethodText}>Nequi</Text>
          </View>
          <View style={[styles.radioButton, selectedPaymentMethod === 'nequi' && styles.radioButtonSelected]}>
            {selectedPaymentMethod === 'nequi' && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>

        {selectedPaymentMethod === 'cards' && (
          <View style={styles.paymentDetails}>
            <View style={styles.cardInputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Número de Tarjeta"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                maxLength={19}
              />
              <View style={styles.cardTypeContainer}>
                {renderCardTypeIcon()}
              </View>
            </View>
            <View style={styles.inputRow}>
              <TextInput 
                style={[styles.input, styles.inputHalf]} 
                placeholder="MM/YY" 
                keyboardType="numeric"
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                maxLength={5}
              />
              <TextInput 
                style={[styles.input, styles.inputHalf]} 
                placeholder="CVV" 
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
                maxLength={4}
              />
            </View>
          </View>
        )}

        {selectedPaymentMethod === 'paypal' && (
          <View style={styles.paymentDetails}>
            <TextInput 
              style={styles.input} 
              placeholder="Email de PayPal" 
              keyboardType="email-address"
              value={paypalEmail}
              onChangeText={setPaypalEmail}
              autoCapitalize="none"
            />
          </View>
        )}

        {selectedPaymentMethod === 'nequi' && (
          <View style={styles.paymentDetails}>
            <TextInput 
              style={styles.input} 
              placeholder="Número de Nequi" 
              keyboardType="numeric"
              value={nequiNumber}
              onChangeText={setNequiNumber}
              maxLength={10}
            />
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Costo del evento</Text>
        <View style={styles.billDetail}>
          <Text style={styles.billLabel}>Valor Total</Text>
          {/* Mostrar el total de la factura desde la respuesta */}
          <Text style={styles.billValue}>
            ${billingData.costos?.total ? billingData.costos.total.toLocaleString('es-CO') : "No disponible"}
          </Text>
        </View>
        <View style={[styles.billDetail, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${billingData.costos?.total ? billingData.costos.total.toLocaleString('es-CO') : "No disponible"}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayBilling}>
        <Text style={styles.buttonText}>Pagar ahora</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    padding: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  icon2: {
    width: 80,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  addressContainer: {
    borderRadius: 10,
    padding: 12,
  },
  addressText: {
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.indigo[500],
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.indigo[500],
  },
  paymentDetails: {
    marginTop: 16,
  },
  cardInputContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  cardTypeContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -1 }],
  },
  cardTypeText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#666',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  billDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  button: {
    backgroundColor: colors.indigo[500],
    padding: 16,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
