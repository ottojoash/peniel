import React from 'react';

const ReservationMessage = ({ onClose, formData }) => {
  const sendMessage = () => {
    alert('Reservation message sent!');
    console.log('Reservation data:', formData);
    onClose();
  };

  return (
    <button onClick={sendMessage} className="payment-button">
      Send a Reserve Message
    </button>
  );
};

export default ReservationMessage;
