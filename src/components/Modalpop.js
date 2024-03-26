import React from 'react';
import paypalLogo from '../assets/img/payment/paypal.png';
import flutterLogo from '../assets/img/payment/flutterlogo.jpeg';
import stripeLogo from '../assets/img/payment/Stripe.png';
import messageLogo from '../assets/img/payment/message.jpg'; // Corrected path for a unique message logo

// PaymentButton Component for each payment method
const PaymentButton = ({ logo, children, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 w-full p-2 bg-white border border-gray-200 rounded-md text-black hover:bg-gray-50 transition-all duration-150 ease-in-out"
  >
    <img src={logo} alt="" className="w-6 h-6" />
    <span className="text-sm font-medium">{children}</span>
  </button>
);

// PaymentModal Component
function PaymentModal({ isOpen, onClose, price }) {
  if (!isOpen) return null; // Render nothing if the modal is not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 py-6 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4 relative">
        <h2 className="text-center text-lg font-bold mb-4">Choose Your Payment Method for ${price}</h2>
        <div className="flex flex-col items-center gap-4">
          {/* Payment buttons */}
          <PaymentButton logo={paypalLogo} onClick={() => console.log('Pay with PayPal')}>
            Pay with PayPal
          </PaymentButton>
          <PaymentButton logo={flutterLogo} onClick={() => console.log('Pay with Flutter')}>
            Pay with Flutter
          </PaymentButton>
          <PaymentButton logo={stripeLogo} onClick={() => console.log('Pay with Stripe')}>
            Pay with Stripe
          </PaymentButton>
          <PaymentButton logo={messageLogo} onClick={() => { alert('Reservation message sent!'); onClose(); }}>
            Send a Reserve Message
          </PaymentButton>
        </div>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 p-1 rounded-full bg-white hover:bg-gray-100 transition-all duration-150 ease-in-out"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;
