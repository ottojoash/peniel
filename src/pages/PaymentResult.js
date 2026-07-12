import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";

const PaymentResult = () => {
  const [params] = useSearchParams();
  const paid = params.get("status") === "successful";
  const pending = params.get("status") === "pending";
  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#f7f5f1] flex items-center">
      <div className="bg-white max-w-xl w-full mx-auto p-10 text-center shadow-xl">
        <span
          className={`w-20 h-20 rounded-full mx-auto grid place-items-center text-3xl ${paid ? "bg-green-100 text-green-600" : pending ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"}`}
        >
          {paid ? <FaCheck /> : pending ? <FaClock /> : <FaTimes />}
        </span>
        <h1 className="font-primary text-4xl mt-6">
          {paid
            ? "Reservation confirmed"
            : pending
              ? "Reservation request received"
              : "Payment not completed"}
        </h1>
        <p className="text-gray-600 mt-4">
          {paid
            ? "Your card payment was verified and your room is reserved. Please keep your Flutterwave receipt."
            : pending
              ? "Online payment is currently paused. The hotel has received your request and will contact you after reviewing availability."
              : "Your reservation has not been confirmed. No room will be held until payment is successfully verified."}
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Reference: {params.get("reference") || "Not available"}
        </p>
        <Link
          to={paid || pending ? "/" : "/rooms"}
          className="btn btn-primary btn-lg mt-8"
        >
          {paid || pending ? "Return home" : "Try another booking"}
        </Link>
      </div>
    </main>
  );
};
export default PaymentResult;
