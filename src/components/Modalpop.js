import React from 'react';
import paypalLogo from '../assets/img/payment/paypal.png';
import flutterLogo from '../assets/img/payment/flutterlogo.jpeg';
import stripeLogo from '../assets/img/payment/Stripe.png';
import messageLogo from '../assets/img/payment/Stripe.png'; // Assuming you have a different image for messages

const PaymentButton = ({ logo, children, onClick }) => (
  <button
    onClick={onClick}
    className="btn flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-gray-50"
  >
    <img src={logo} alt="" className="w-6 h-6" />
    <span className="text-sm font-medium">
      {children}
    </span>
  </button>
);

function PaymentModal({ isOpen, onClose, price }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-5 m-4">
        <h2 className="text-center text-lg font-bold mb-4 text-black">
          Choose Your Payment Method for ${price}
        </h2>
        <div className="flex flex-col items-center gap-4">
          <PaymentButton logo={paypalLogo} onClick={() => {}}>
            Pay with PayPal
          </PaymentButton>
          <PaymentButton logo={flutterLogo} onClick={() => {}}>
            Pay with Flutter
          </PaymentButton>
          <PaymentButton logo={stripeLogo} onClick={() => {}}>
            Pay with Stripe
          </PaymentButton>
          <PaymentButton logo={messageLogo} onClick={() => { alert('Reservation message sent!'); onClose(); }}>
            Send a Reserve Message
          </PaymentButton>
        </div>
        <div className="flex justify-between items-center mt-5">
        <button 
        className="btn btn-sm btn-circle absolute top-2 right-2 flex items-center justify-center"
        onClick={onClose}
        aria-label="Close"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
