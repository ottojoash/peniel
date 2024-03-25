import React from 'react';

// Assuming you have or will create components or functions to handle each payment method:
// For demonstration, these are simple placeholders. You would replace them with actual integration code.
const PayPalButton = ({ price }) => <button>Pay with PayPal</button>;
const FlutterButton = ({ price }) => <button>Pay with Flutter</button>;
const StripeButton = ({ price }) => <button>Pay with Stripe</button>;
const ReserveMessageOption = ({ onClose }) => (
  <button onClick={() => { alert('Reservation message sent!'); onClose(); }}>
    Send a Reserve Message
  </button>
);

function PaymentModal({ isOpen, onClose, price }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', width: '80%', maxWidth: '600px', textAlign: 'center' }}>
        <h2>Choose Your Payment Method for ${price}</h2>
        {/* Payment method options */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <PayPalButton price={price} />
          <FlutterButton price={price} />
          <StripeButton price={price} />
          <ReserveMessageOption onClose={onClose} />
        </div>
        <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
      </div>
    </div>
  );
}

export default PaymentModal;
