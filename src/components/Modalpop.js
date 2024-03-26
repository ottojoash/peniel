import React from 'react';
import PayPalPayment from '../components/Paypal';
import FlutterwavePayment from '../components/Flutterpayment';
import StripePayment from '../components/Stripe';
import ReservationMessage from '../components/Reserve';
// Import logos if needed

function PaymentModal({ isOpen, onClose, price, formData, onPaymentSuccess, onSendMessage }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 py-6 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4 relative">
        <h2 className="text-center text-lg font-bold mb-4">Choose Your Payment Method for ${price}</h2>
        <div className="flex flex-col items-center gap-4">
          <PayPalPayment onPaymentSuccess={onPaymentSuccess} formData={formData} />
          <FlutterwavePayment onPaymentSuccess={onPaymentSuccess} formData={formData} />
          <StripePayment onPaymentSuccess={onPaymentSuccess} formData={formData} />
          <ReservationMessage onClose={onSendMessage} formData={formData} />
        </div>
        <button onClick={onClose} className="absolute top-0 right-0 m-4 p-1 rounded-full bg-white hover:bg-gray-100 transition-all duration-150 ease-in-out" aria-label="Close">
          {/* Close SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>

        </button>
      </div>
    </div>
  );
}

export default PaymentModal;
