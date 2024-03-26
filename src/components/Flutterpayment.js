import React, { useEffect, useState } from 'react';

const FlutterwavePayment = ({ onPaymentSuccess, formData }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (window.FlutterwaveCheckout) {
      setIsScriptLoaded(true); // Script is already loaded
      return;
    }

    // Dynamically load the Flutterwave script
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!isScriptLoaded) return; // Check if the script is loaded

    const config = {
      public_key: "",
      tx_ref: `REF_${Date.now()}`,
      amount: formData.price,
      currency: "USD",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: formData.email,
        name: formData.names,
      },
      meta: {
        consumer_mac: "92a3-912ba-1192a",
      },
      customizations: {
        title: formData.type,
        description: `Room booking from ${formData.checkIn} to ${formData.checkOut}`,
        logo: "public/logo_transparent.png", // Replace with your actual logo URL
      }
    };

    window.FlutterwaveCheckout(config);
  };

  return (
    <button onClick={handlePayment} disabled={!isScriptLoaded} className="payment-button">
      Pay with Flutter
    </button>
  );
};

export default FlutterwavePayment;
