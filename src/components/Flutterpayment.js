import React from 'react';
import PropTypes from 'prop-types'; // Ensure PropTypes is imported
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import logos from '../assets/img/logo_transparent.png';

const FlutterwavePayment = ({ onPaymentSuccess, formData }) => {
  const config = {
    public_key: 'FLWPUBK_TEST-54552883a8ee8066d4b7c498bc3dd687-X',
    tx_ref: `REF_${Date.now()}`,
    amount: formData.price,
    currency: 'USD',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: formData.email,
      name: formData.names,
    },
    customizations: {
      title: formData.type,
      description: `Room booking from ${formData.checkIn} to ${formData.checkOut}`,
      logo: logos // Use the default logo if none is provided in formData
    },
  };

  const handlePaymentSuccess = (response) => {
    console.log(response);
    // onPaymentSuccess is guaranteed to be a function, thanks to defaultProps
    onPaymentSuccess(response); // Pass the response object to the callback function
    closePaymentModal(); // Close the modal programmatically
  };

  const fwConfig = {
    ...config,
    text: 'Pay with Flutterwave!',
    callback: handlePaymentSuccess,
    onClose: () => {}, // Optional: Perform actions when the modal is closed without payment
  };

  return <FlutterWaveButton {...fwConfig} />;
};

// Prop types for type checking
FlutterwavePayment.propTypes = {
  onPaymentSuccess: PropTypes.func,
  formData: PropTypes.shape({
    price: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    names: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    checkIn: PropTypes.string.isRequired,
    checkOut: PropTypes.string.isRequired,
  }).isRequired,
};

// Default props in case they are not provided
FlutterwavePayment.defaultProps = {
  onPaymentSuccess: () => { console.log('Payment Success Callback not provided.'); },
};

export default FlutterwavePayment;
