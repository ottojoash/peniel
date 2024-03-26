import React, { useState } from 'react';

const ReservationMessage = ({ onClose, formData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendMessage = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/sendReserve', {  
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to book room');
      }

      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to Send Reserve Message. Please try again later.');
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <button onClick={sendMessage} className="payment-button" disabled={isSubmitting}>
      {isSubmitting ? 'Sending...' : 'Send a Reserve Message'}
    </button>
  );
};

export default ReservationMessage;
