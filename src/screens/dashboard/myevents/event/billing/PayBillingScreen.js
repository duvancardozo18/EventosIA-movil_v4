import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Image, ActivityIndicator, Alert
} from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../../../styles/colors';
import { billingService } from '../../../../../services/api'; 


export default function PayBillingScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [nequiNumber, setNequiNumber] = useState('');
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const response = await billingService.getBillingByEventId(eventId);
        console.log('📦 Datos de facturación:', response.data);
        setBillingData(response.data.billings[0]);
      } catch (error) {
        console.error("Error al obtener facturación:", error); // 👈 Ver más detalles
        Alert.alert("Error", "No se pudo cargar la información de facturación.");
      } finally {
        setLoading(false);
      }
    };
    fetchBillingData();
  }, [eventId]);

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
        alert('Número de Nequi inválido');
      }
    }

    if (isValid) {
      navigation.navigate('BillPaid');
    }
  };

  const detectCardType = (number) => {
    const cardNum = number.replace(/\s/g, '');
    const visaRegex = /^4/;
    const mastercardRegex = /^(5[1-5]|2[2-7])/;

    if (visaRegex.test(cardNum)) return 'visa';
    if (mastercardRegex.test(cardNum)) return 'mastercard';
    if (cardNum.length > 0) return 'unknown';
    return null;
  };

  const formatCardNumber = (number) => {
    const cardNum = number.replace(/\s/g, '');
    const groups = cardNum.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cardNum;
  };

  const handleCardNumberChange = (text) => {
    const cleaned = text.replace(/[^\d\s]/g, '');
    if (cleaned.replace(/\s/g, '').length <= 16) {
      const formatted = formatCardNumber(cleaned);
      setCardNumber(formatted);
      const type = detectCardType(cleaned);
      setCardType(type);
    }
  };

  const handleExpiryDateChange = (text) => {
    let cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length <= 4) {
      if (cleaned.length > 2) {
        cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      }
      setExpiryDate(cleaned);
    }
  };

  const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s/g, ''));
  const validateExpiryDate = (expiry) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
  const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);
  const validatePaypalEmail = (email) => /^[\w.-]+@[\w.-]+\.\w{2,6}$/.test(email);
  const validateNequiNumber = (number) => /^\d{10}$/.test(number);

  const renderCardTypeIcon = () => {
    if (!cardType) return null;
    if (cardType === 'visa') {
      return <Image source={require('../../../../../../assets/Visa_Logo.png')} style={styles.icon2} />;
    } else if (cardType === 'mastercard') {
      return <Image source={require('../../../../../../assets/mastercard2.png')} style={styles.icon2} />;
    } else if (cardType === 'unknown') {
      return <Feather name="help-circle" size={20} color="#999" />;
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!billingData) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron datos de facturación.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volver a la factura</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Datos personales</Text>
        <Text style={styles.addressText}>
          Nombre: {billingData?.user_name} {billingData?.user_last_name || ''}
        </Text>
        <Text style={styles.addressText}>
          Correo: {billingData?.user_email || 'No disponible'}
        </Text>
      </View>


      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Métodos de pago</Text>

        {['cards', 'paypal', 'nequi'].map((method) => (
          <TouchableOpacity
            key={method}
            style={styles.paymentMethodRow}
            onPress={() => handlePaymentMethodChange(method)}
          >
            <View style={styles.paymentMethodInfo}>
              {method === 'cards' && <Feather name="credit-card" size={22} color="#333" />}
              {method === 'paypal' && <Image source={require('../../../../../../assets/paypal.png')} style={styles.icon} />}
              {method === 'nequi' && <Image source={require('../../../../../../assets/nequi.png')} style={styles.icon} />}
              <Text style={styles.paymentMethodText}>
                {method === 'cards' ? 'Tarjeta débito/crédito' : method === 'paypal' ? 'PayPal' : 'Nequi'}
              </Text>
            </View>
            <View style={[styles.radioButton, selectedPaymentMethod === method && styles.radioButtonSelected]}>
              {selectedPaymentMethod === method && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        ))}

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
              <View style={styles.cardTypeContainer}>{renderCardTypeIcon()}</View>
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
        <Text style={styles.sectionHeader}>VALOR TOTAL</Text>

        <View style={[styles.billDetail, styles.totalRow]}>
          <Text style={styles.totalLabel}>Precio</Text>
          <Text style={styles.totalValue}>
            {billingData?.price ? `$${parseInt(billingData.price).toLocaleString('es-CO')}` : "No disponible"}
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
  container: { flex: 1, backgroundColor: '#F5F5F7', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { width: 24, height: 24 },
  icon2: { width: 80, height: 25 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#333' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionHeader: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  addressText: { fontSize: 14, color: '#000', marginBottom: 5 },
  paymentMethodRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EEE'
  },
  paymentMethodInfo: { flexDirection: 'row', alignItems: 'center' },
  paymentMethodText: { marginLeft: 12, fontSize: 16, color: '#333' },
  radioButton: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: '#CCC', justifyContent: 'center', alignItems: 'center'
  },
  radioButtonSelected: { borderColor: colors.indigo[500] },
  radioButtonInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.indigo[500] },
  paymentDetails: { marginTop: 16 },
  cardInputContainer: { position: 'relative', marginBottom: 10 },
  cardTypeContainer: { position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -10 }] },
  input: {
    backgroundColor: '#FFF', padding: 12, borderRadius: 8, fontSize: 16,
    borderWidth: 1, borderColor: '#EEE'
  },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between' },
  inputHalf: { width: '48%' },
  billDetail: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  billLabel: { fontSize: 14, color: '#666' },
  billValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EEE' },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#333' },
  button: {
    backgroundColor: colors.indigo[500], padding: 16,
    alignItems: 'center', borderRadius: 10, marginTop: 20, marginBottom: 30
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
